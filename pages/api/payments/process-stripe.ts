import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { MarketplaceService } from '@/lib/marketplace/service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethodId } = await request.json();

    if (!orderId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get order details
    const order = await MarketplaceService.getOrder(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Order is not pending payment' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.NEXTAUTH_URL}/marketplace/order-success?order_id=${orderId}`,
      metadata: {
        order_id: orderId,
        user_id: order.user_id,
      },
      description: `Amenity Marketplace Order #${orderId}`,
    });

    // Update order status based on payment result
    if (paymentIntent.status === 'succeeded') {
      await MarketplaceService.updateOrderStatus(
        orderId, 
        'completed', 
        paymentIntent.id
      );

      // Process digital product delivery
      for (const item of order.items) {
        if (item.product.is_digital) {
          await processDigitalDelivery(order.user_id, orderId, item.product_id);
        }
      }

      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
        order: {
          id: orderId,
          status: 'completed'
        }
      });
    } else if (paymentIntent.status === 'requires_action') {
      return NextResponse.json({
        requiresAction: true,
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status,
        }
      });
    } else {
      await MarketplaceService.updateOrderStatus(orderId, 'failed');
      
      return NextResponse.json({
        success: false,
        error: 'Payment failed',
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        }
      });
    }

  } catch (error: any) {
    console.error('Stripe payment error:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment processing failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function processDigitalDelivery(userId: string, orderId: string, productId: string) {
  // In a real implementation, you might:
  // 1. Generate secure download links
  // 2. Send email with download instructions
  // 3. Create access tokens with expiration
  // 4. Log delivery for tracking
  
  console.log(`Processing digital delivery for user ${userId}, order ${orderId}, product ${productId}`);
  
  // For now, we'll just log it
  // You could integrate with email service, file storage service, etc.
}