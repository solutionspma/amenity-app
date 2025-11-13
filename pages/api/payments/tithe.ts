import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TitheRequest {
  churchId: string;
  amount: number;
  userId: string;
  isRecurring?: boolean;
  frequency?: 'weekly' | 'monthly';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { churchId, amount, userId, isRecurring, frequency }: TitheRequest = req.body;

    // Validate minimum tithe amount ($5.00)
    if (amount < 500) {
      return res.status(400).json({ error: 'Minimum tithe amount is $5.00' });
    }

    // Get church's Stripe account
    const { data: church } = await supabase
      .from('churches')
      .select('stripe_account_id, name')
      .eq('id', churchId)
      .single();

    if (!church?.stripe_account_id) {
      return res.status(400).json({ error: 'Church has not set up payments' });
    }

    // Get user's customer ID
    const { data: profile } = await supabase
      .from('amenity_profiles')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email,
        metadata: { user_id: userId },
      });

      customerId = customer.id;

      await supabase
        .from('amenity_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Platform fee for tithes is only 2.9% (processing fees)
    const platformFeeAmount = Math.floor(amount * 0.029);
    const churchAmount = amount - platformFeeAmount;

    if (isRecurring) {
      // Create recurring tithe subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tithe to ${church.name}`,
            } as any,
            unit_amount: amount,
            recurring: {
              interval: frequency === 'weekly' ? 'week' : 'month',
            },
          } as any,
        }],
        application_fee_percent: 2.9,
        transfer_data: {
          destination: church.stripe_account_id,
        },
        metadata: {
          type: 'recurring_tithe',
          church_id: churchId,
          user_id: userId,
        },
      });

      // Record in database
      await supabase
        .from('tithes')
        .insert({
          user_id: userId,
          church_id: churchId,
          amount: churchAmount,
          platform_fee: platformFeeAmount,
          is_recurring: true,
          frequency,
          stripe_subscription_id: subscription.id,
          status: 'active',
        });

      res.status(200).json({ subscriptionId: subscription.id });
    } else {
      // One-time tithe payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_data: {
          destination: church.stripe_account_id,
          amount: churchAmount,
        },
        application_fee_amount: platformFeeAmount,
        metadata: {
          type: 'tithe',
          church_id: churchId,
          user_id: userId,
        },
      });

      // Record in database
      const { data: tithe } = await supabase
        .from('tithes')
        .insert({
          user_id: userId,
          church_id: churchId,
          amount: churchAmount,
          platform_fee: platformFeeAmount,
          is_recurring: false,
          stripe_payment_intent: paymentIntent.id,
          status: 'pending',
        })
        .select()
        .single();

      // Notify church
      await supabase
        .from('notifications')
        .insert({
          user_id: churchId, // Assuming church has a user account
          type: 'tithe',
          title: 'Tithe Received',
          message: `Received a $${(churchAmount / 100).toFixed(2)} tithe`,
          data: { tithe_id: tithe.id, amount: churchAmount },
        });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        titheId: tithe.id,
      });
    }
  } catch (error) {
    console.error('Tithe processing error:', error);
    res.status(500).json({ error: 'Failed to process tithe' });
  }
}