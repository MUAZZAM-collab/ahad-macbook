import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    total,
    itemsCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-apple-lg flex flex-col border-l border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-apple-blue" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Your Bag ({itemsCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Value Prop Banner */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-5 py-2.5 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800">
            <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>
              <strong>Free Insured Express Shipping</strong> on all MacBooks
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-800 dark:text-zinc-200 text-base">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore our certified MacBook Pro and MacBook Air lineup with official warranty.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore MacBooks
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white dark:bg-zinc-900 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                          {item.chip}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                          {item.ram} / {item.storage}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-apple-blue font-medium">
                          {item.condition}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900">
                        <button
                          onClick={() =>
                            updateQuantity(item.product, item.quantity - 1)
                          }
                          className="p-1 hover:text-rose-500 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product, item.quantity + 1)
                          }
                          className="p-1 hover:text-apple-blue transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    ${tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-apple-blue hover:bg-apple-blue-hover text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulated Secure Apple Pay & Card Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
