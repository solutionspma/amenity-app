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

interface EventRequest {
  eventId: string;
  userId: string;
  ticketType: 'general' | 'vip' | 'premium';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventId, userId, ticketType }: EventRequest = req.body;

    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select(`
        *,
        creator:amenity_profiles(stripe_account_id, display_name)
      `)
      .eq('id', eventId)
      .single();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.creator.stripe_account_id) {
      return res.status(400).json({ error: 'Event creator has not set up payments' });
    }

    // Get ticket price based on type
    const ticketPrices = {
      general: event.ticket_price_general,
      vip: event.ticket_price_vip,
      premium: event.ticket_price_premium,
    };

    const ticketPrice = ticketPrices[ticketType];
    if (!ticketPrice) {
      return res.status(400).json({ error: 'Invalid ticket type' });
    }

    // Check ticket availability
    const { count: soldTickets } = await supabase
      .from('event_tickets')
      .select('*', { count: 'exact' })
      .eq('event_id', eventId)
      .eq('ticket_type', ticketType);

    const maxTickets = {
      general: event.max_tickets_general,
      vip: event.max_tickets_vip,
      premium: event.max_tickets_premium,
    };

    if ((soldTickets || 0) >= maxTickets[ticketType]) {
      return res.status(400).json({ error: 'Tickets sold out for this type' });
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

    // Platform fee for events is 10%
    const platformFeeAmount = Math.floor(ticketPrice * 0.10);
    const creatorAmount = ticketPrice - platformFeeAmount;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticketPrice,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: event.creator.stripe_account_id,
        amount: creatorAmount,
      },
      application_fee_amount: platformFeeAmount,
      metadata: {
        type: 'event_ticket',
        event_id: eventId,
        user_id: userId,
        ticket_type: ticketType,
      },
    });

    // Reserve ticket (will be confirmed on successful payment)
    const { data: ticket } = await supabase
      .from('event_tickets')
      .insert({
        event_id: eventId,
        user_id: userId,
        ticket_type: ticketType,
        price_paid: creatorAmount,
        platform_fee: platformFeeAmount,
        stripe_payment_intent: paymentIntent.id,
        status: 'reserved',
      })
      .select()
      .single();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      ticketId: ticket.id,
      eventTitle: event.title,
      ticketType,
      price: ticketPrice,
    });
  } catch (error) {
    console.error('Event ticket processing error:', error);
    res.status(500).json({ error: 'Failed to process ticket purchase' });
  }
}