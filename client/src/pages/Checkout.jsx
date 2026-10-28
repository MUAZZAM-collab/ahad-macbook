import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { cartItems, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '742 Evergreen Terrace',
    city: user?.address?.city || 'San Francisco',
    state: user?.address?.state || 'CA',
    postalCode: user?.address?.zipCode || '94107',
    country: 'United States',
    phone: user?.phone || '+1 (415) 555-0199',
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Apple Pay (Simulated)');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');

  if (cartItems.length === 0 && !orderConfirmed) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
        <h2 className="text-xl font-bold">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-500">
          Add a MacBook to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 rounded-full bg-apple-blue text-white text-xs font-semibold"
        >
          Explore MacBooks
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toastError('Please sign in or create an account to complete checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          chip: item.chip,
          ram: item.ram,
          storage: item.storage,
          condition: item.condition,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: 0,
        totalPrice: total,
      };

      const res = await api.post('/orders', orderPayload);
      const newOrder = res.data.data;
      setOrderConfirmed(newOrder);
      clearCart();
      success(`Order placed successfully! Order #${newOrder.orderNumber}`);
    } catch (err) {
      toastError(err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmed Success Screen
  if (orderConfirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Payment & Order Authorized
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Thank you for your purchase!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Your MacBook has been reserved and queued for insured FedEx Express delivery.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-md text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-xs text-zinc-400 block">Order Number</span>
              <span className="text-lg font-mono font-bold text-zinc-900 dark:text-white">
                {orderConfirmed.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-apple-blue">
                {orderConfirmed.orderStatus}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Tracking Number (FedEx Express)</span>
              <span className="font-mono font-semibold text-apple-blue">
                {orderConfirmed.trackingNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Shipping To</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 text-right">
                {orderConfirmed.shippingAddress.fullName}, {orderConfirmed.shippingAddress.street},{' '}
                {orderConfirmed.shippingAddress.city}, {orderConfirmed.shippingAddress.state}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-sm font-bold">
              <span>Total Paid</span>
              <span>${orderConfirmed.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
          Secure Checkout
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complete your order with simulated Apple Pay or credit card authorization.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping & Payment details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-apple-blue" />
              <span>1. Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-apple-blue" />
              <span>2. Simulated Payment Gateway</span>
            </h3>

            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Apple Pay / Stripe Simulated Card
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-semibold text-[10px]">
                Test Mode Ready
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="col-span-3">
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Expiration</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-mono"
                />
              </div>
              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">CVC</label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-md space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Items list */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-64 overflow-y-auto space-y-2">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-3 pt-2 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Qty: {item.quantity} • {item.chip} • {item.ram}
                    </p>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  ${tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insured 2-Day Air Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-base font-extrabold text-zinc-900 dark:text-white">
                <span>Total Due</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-bold shadow-apple-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authorizing Payment...' : `Authorize & Pay $${total.toLocaleString()}`}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit Encrypted Simulated Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
