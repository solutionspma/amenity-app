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

interface SubscriptionRequest {
  creatorId: string;
  tierId?: string;
  userId: string;
  priceId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { creatorId, tierId, userId, priceId }: SubscriptionRequest = req.body;

    // Get user's Stripe customer ID or create one
    let { data: profile } = await supabase
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

      // Update user profile with customer ID
      await supabase
        .from('amenity_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Get creator's connected account
    const { data: creator } = await supabase
      .from('amenity_profiles')
      .select('stripe_account_id')
      .eq('id', creatorId)
      .single();

    if (!creator?.stripe_account_id) {
      return res.status(400).json({ error: 'Creator has not set up payments' });
    }

    // Get tier details if specified
    let tierDetails = null;
    if (tierId) {
      const { data: tier } = await supabase
        .from('creator_tiers')
        .select('*')
        .eq('id', tierId)
        .single();
      tierDetails = tier;
    }

    // Create subscription with application fee
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      application_fee_percent: 10, // 10% platform fee
      transfer_data: {
        destination: creator.stripe_account_id,
      },
      metadata: {
        creator_id: creatorId,
        tier_id: tierId || '',
        user_id: userId,
      },
    });

    // Record subscription in database
    const { data: dbSubscription, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        creator_id: creatorId,
        tier_id: tierId,
        stripe_subscription_id: subscription.id,
        status: 'pending',
        amount: tierDetails?.price || 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for creator
    await supabase
      .from('notifications')
      .insert({
        user_id: creatorId,
        type: 'subscription',
        title: 'New Subscriber!',
        message: `Someone subscribed to your ${tierDetails?.name || 'content'}`,
        data: { subscription_id: dbSubscription.id },
      });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.status(200).json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
}