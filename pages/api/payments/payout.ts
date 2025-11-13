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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { creatorId, amount } = req.body;

    // Validate payout request
    if (amount < 2000) { // $20 minimum payout
      return res.status(400).json({ error: 'Minimum payout is $20.00' });
    }

    // Get creator's account info
    const { data: creator } = await supabase
      .from('amenity_profiles')
      .select('stripe_account_id, total_earnings, pending_earnings, total_payouts')
      .eq('id', creatorId)
      .single();

    if (!creator?.stripe_account_id) {
      return res.status(400).json({ error: 'Creator account not set up' });
    }

    if (creator.pending_earnings < amount) {
      return res.status(400).json({ error: 'Insufficient pending earnings' });
    }

    // Create transfer to creator's account
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: creator.stripe_account_id,
      metadata: {
        creator_id: creatorId,
        type: 'payout',
      },
    });

    // Record payout in database
    const { data: payout } = await supabase
      .from('payouts')
      .insert({
        creator_id: creatorId,
        amount,
        stripe_transfer_id: transfer.id,
        status: 'completed',
        requested_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Update creator's earnings
    await supabase
      .from('amenity_profiles')
      .update({
        pending_earnings: creator.pending_earnings - amount,
        total_payouts: (creator.total_payouts || 0) + amount,
      })
      .eq('id', creatorId);

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: creatorId,
        type: 'payout',
        title: 'Payout Processed',
        message: `Your $${(amount / 100).toFixed(2)} payout has been processed`,
        data: { payout_id: payout.id, amount },
      });

    res.status(200).json({
      payoutId: payout.id,
      transferId: transfer.id,
      amount,
      status: 'completed',
    });
  } catch (error) {
    console.error('Payout processing error:', error);
    res.status(500).json({ error: 'Failed to process payout' });
  }
}