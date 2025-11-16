'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { MarketplaceService, CartItem } from '@/lib/marketplace/service';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ cartItems, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create order first
      const userId = 'demo-user'; // In production, get from auth context
      const order = await MarketplaceService.createOrder(userId, 'stripe');

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.fullName,
          email: formData.email,
          address: formData.address,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Process payment
      const result = await MarketplaceService.processStripePayment(
        order.id,
        paymentMethod.id
      );

      if (result.requiresAction) {
        // Handle 3D Secure or other authentication
        const { error: confirmError } = await stripe.confirmCardPayment(
          result.paymentIntent.client_secret
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      if (result.success) {
        onSuccess(order.id);
      } else {
        throw new Error(result.error || 'Payment failed');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      onError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span>{item.product.title} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Billing Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          value={formData.address.line1}
          onChange={(e) => setFormData({ 
            ...formData, 
            address: { ...formData.address, line1: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="City"
            value={formData.address.city}
            onChange={(e) => setFormData({ 
              ...formData, 
              address: { ...formData.address, city: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={formData.address.state}
            onChange={(e) => setFormData({ 
              ...formData, 
              address: { ...formData.address, state: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={formData.address.postal_code}
            onChange={(e) => setFormData({ 
              ...formData, 
              address: { ...formData.address, postal_code: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Payment Information</h3>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          processing
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Complete Purchase - $${total.toFixed(2)}`
        )}
      </button>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-1">
          <span>🔒</span>
          <span>Secure payment powered by Stripe</span>
        </div>
        <p className="mt-1">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>
    </form>
  );
}

interface CheckoutProps {
  cartItems: CartItem[];
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

export default function Checkout({ cartItems, onSuccess, onError }: CheckoutProps) {
  if (!cartItems.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🛒</div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase securely</p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm 
          cartItems={cartItems}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
}