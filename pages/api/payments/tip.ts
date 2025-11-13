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

interface TipRequest {
  creatorId: string;
  amount: number;
  message?: string;
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { creatorId, amount, message, userId }: TipRequest = req.body;

    // Validate minimum tip amount ($1.00)
    if (amount < 100) {
      return res.status(400).json({ error: 'Minimum tip amount is $1.00' });
    }

    // Get creator's Stripe account
    const { data: creator } = await supabase
      .from('amenity_profiles')
      .select('stripe_account_id, display_name')
      .eq('id', creatorId)
      .single();

    if (!creator?.stripe_account_id) {
      return res.status(400).json({ error: 'Creator has not set up payments' });
    }

    // Calculate platform fee (15% for tips)
    const platformFeeAmount = Math.floor(amount * 0.15);
    const creatorAmount = amount - platformFeeAmount;

    // Create payment intent with destination charges
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: creator.stripe_account_id,
        amount: creatorAmount,
      },
      application_fee_amount: platformFeeAmount,
      metadata: {
        type: 'tip',
        creator_id: creatorId,
        sender_id: userId,
        message: message || '',
      },
    });

    // Record tip in database
    const { data: tip, error } = await supabase
      .from('tips')
      .insert({
        from_user: userId,
        to_user: creatorId,
        amount: creatorAmount,
        platform_fee: platformFeeAmount,
        message,
        stripe_payment_intent: paymentIntent.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for creator
    await supabase
      .from('notifications')
      .insert({
        user_id: creatorId,
        type: 'tip',
        title: 'New Tip Received!',
        message: `You received a $${(creatorAmount / 100).toFixed(2)} tip${message ? ': ' + message : ''}`,
        data: { tip_id: tip.id, amount: creatorAmount },
      });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      tipId: tip.id,
    });
  } catch (error) {
    console.error('Tip processing error:', error);
    res.status(500).json({ error: 'Failed to process tip' });
  }
}