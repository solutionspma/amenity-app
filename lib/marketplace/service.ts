import { supabase } from '@/lib/supabase/client';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  seller_id: string;
  seller_name: string;
  category: string;
  image_url?: string;
  digital_file_url?: string;
  inventory_count?: number;
  is_digital: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: 'stripe' | 'paypal' | 'apple_pay';
  payment_intent_id?: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: Product;
}

export class MarketplaceService {
  // Product Management
  static async getProducts(category?: string, search?: string) {
    let query = supabase
      .from('marketplace_products')
      .select(`
        *,
        seller:seller_id(id, username, profile_image_url)
      `)
      .eq('is_active', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  }

  static async getProduct(id: string) {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select(`
        *,
        seller:seller_id(id, username, profile_image_url, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  }

  static async createProduct(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('marketplace_products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  // Cart Management
  static async getCart(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:product_id(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      product: item.product
    })) as CartItem[];
  }

  static async addToCart(userId: string, productId: string, quantity: number = 1) {
    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          product_id: productId,
          quantity: quantity
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  static async updateCartItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeFromCart(userId: string, productId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return true;
  }

  static async clearCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  // Order Management
  static async createOrder(userId: string, paymentMethod: string): Promise<Order> {
    // Get cart items
    const cartItems = await this.getCart(userId);
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        payment_method: paymentMethod
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product.price
    }));

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select(`
        *,
        product:product_id(*)
      `);

    if (itemsError) throw itemsError;

    // Clear cart
    await this.clearCart(userId);

    return {
      ...order,
      items: items as OrderItem[]
    } as Order;
  }

  static async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:product_id(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }

  static async getOrder(orderId: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:product_id(*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data as Order;
  }

  static async updateOrderStatus(orderId: string, status: Order['status'], paymentIntentId?: string) {
    const updateData: any = { status };
    if (paymentIntentId) {
      updateData.payment_intent_id = paymentIntentId;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }

  // Payment Processing
  static async processStripePayment(orderId: string, paymentMethodId: string) {
    try {
      const response = await fetch('/api/payments/process-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentMethodId
        }),
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Analytics & Insights
  static async getSellerAnalytics(sellerId: string) {
    const { data: orders, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        unit_price,
        product:product_id(seller_id),
        order:order_id(status, created_at)
      `)
      .eq('product.seller_id', sellerId)
      .eq('order.status', 'completed');

    if (error) throw error;

    const totalRevenue = orders.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);

    const totalSales = orders.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return {
      totalRevenue,
      totalSales,
      orderCount: orders.length
    };
  }

  static async getPopularProducts(limit: number = 10) {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        product_id,
        product:product_id(title, price, seller_id),
        quantity
      `)
      .order('quantity', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Group by product and sum quantities
    const productSales = data.reduce((acc: any, item) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          product: item.product,
          totalSold: 0
        };
      }
      acc[item.product_id].totalSold += item.quantity;
      return acc;
    }, {});

    return Object.values(productSales)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, limit);
  }

  // Digital Product Delivery
  static async getDigitalProduct(orderId: string, productId: string, userId: string) {
    // Verify the user owns this product
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(product_id, product:product_id(is_digital, digital_file_url))
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .single();

    if (error) throw error;

    const orderItem = order.items.find((item: any) => item.product_id === productId);
    if (!orderItem || !orderItem.product.is_digital) {
      throw new Error('Product not found or not digital');
    }

    return {
      downloadUrl: orderItem.product.digital_file_url,
      productId: productId,
      orderId: orderId
    };
  }
}