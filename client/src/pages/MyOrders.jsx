import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, CheckCircle2, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
          Account Purchase History
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          My MacBook Orders
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          View your purchase records, simulated invoices, and FedEx tracking numbers.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-40 rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You haven't purchased any MacBooks yet. Check out our certified inventory!
          </p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 rounded-full bg-apple-blue text-white text-xs font-semibold"
          >
            Explore MacBooks
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 dark:bg-blue-950 text-apple-blue'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-zinc-400 block">Total Paid</span>
                  <span className="text-base font-bold text-zinc-900 dark:text-white">
                    ${order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-2">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 pt-2 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {item.chip} • {item.ram} • {item.storage} • {item.condition}
                      </p>
                    </div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Qty {item.quantity} × ${item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery info footer */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-apple-blue" />
                  <span>
                    Tracking: <strong className="font-mono text-zinc-700 dark:text-zinc-300">{order.trackingNumber}</strong>
                  </span>
                </div>
                <span>
                  Delivering to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
