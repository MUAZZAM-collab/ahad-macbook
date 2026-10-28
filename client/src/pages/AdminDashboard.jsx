import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Wrench,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  X,
  Filter,
  Save,
  Truck,
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'repairs' | 'orders'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    repairsCount: 0,
    activeRepairsCount: 0,
  });

  const [products, setProducts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    modelFamily: 'MacBook Pro',
    chip: 'M3 Pro',
    screenSize: '14-inch',
    ram: '18GB',
    storage: '512GB',
    color: 'Space Black',
    condition: 'New',
    price: 1999,
    originalPrice: 2199,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'],
    description: '',
    featured: false,
  });

  // Repair Edit Modal State
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [repairForm, setRepairForm] = useState({
    currentStageIndex: 0,
    status: 'Received & Diagnosed',
    technicianNotes: '',
    estimatedCost: 0,
    finalCost: 0,
    quoteStatus: 'Pending',
    assignedTechnician: '',
    priority: 'Standard',
  });

  // Order Edit State
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderStatusUpdate, setOrderStatusUpdate] = useState('Processing');
  const [orderTrackingUpdate, setOrderTrackingUpdate] = useState('');

  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, repairsRes, ordersRes] = await Promise.all([
        api.get('/orders/stats/summary'),
        api.get('/products'),
        api.get('/repairs'),
        api.get('/orders'),
      ]);

      setStats(statsRes.data.data);
      setProducts(prodRes.data.data || []);
      setRepairs(repairsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
      toastError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  // PRODUCT CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      modelFamily: 'MacBook Pro',
      chip: 'M3 Pro',
      screenSize: '14-inch',
      ram: '18GB',
      storage: '512GB',
      color: 'Space Black',
      condition: 'New',
      price: 1999,
      originalPrice: 2199,
      stock: 5,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'],
      description: 'Certified Apple Silicon MacBook in pristine condition.',
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      modelFamily: prod.modelFamily,
      chip: prod.chip,
      screenSize: prod.screenSize,
      ram: prod.ram,
      storage: prod.storage,
      color: prod.color || 'Space Gray',
      condition: prod.condition,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      stock: prod.stock,
      images: prod.images || [],
      description: prod.description || '',
      featured: Boolean(prod.featured),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update
        const res = await api.put(`/products/${editingProduct._id}`, productForm);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? res.data.data : p))
        );
        success('Product updated successfully!');
      } else {
        // Create
        const res = await api.post('/products', productForm);
        setProducts((prev) => [res.data.data, ...prev]);
        success('New MacBook listed successfully!');
      }
      setIsProductModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      toastError(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      success('Product removed from catalog.');
      loadAllAdminData();
    } catch (err) {
      toastError(err.message || 'Failed to delete product');
    }
  };

  // REPAIR TICKET MANAGEMENT
  const handleOpenEditRepair = (ticket) => {
    setEditingRepair(ticket);
    setRepairForm({
      currentStageIndex: ticket.currentStageIndex ?? 0,
      status: ticket.status,
      technicianNotes: ticket.technicianNotes || '',
      estimatedCost: ticket.estimatedCost || 0,
      finalCost: ticket.finalCost || ticket.estimatedCost || 0,
      quoteStatus: ticket.quoteStatus || 'Pending',
      assignedTechnician: ticket.assignedTechnician || '',
      priority: ticket.priority || 'Standard',
    });
    setIsRepairModalOpen(true);
  };

  const handleSaveRepair = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/repairs/${editingRepair._id}`, repairForm);
      setRepairs((prev) =>
        prev.map((r) => (r._id === editingRepair._id ? res.data.data : r))
      );
      success(`Repair Ticket ${editingRepair.ticketId} updated!`);
      setIsRepairModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      toastError(err.message || 'Failed to update repair ticket');
    }
  };

  // ORDER STATUS UPDATE
  const handleSaveOrderStatus = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        orderStatus: orderStatusUpdate,
        trackingNumber: orderTrackingUpdate,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.data : o))
      );
      setEditingOrder(null);
      success('Order fulfillment status updated!');
      loadAllAdminData();
    } catch (err) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Staff Portal
            </span>
            <span className="text-xs text-zinc-500">Apple Silicon Lab & Sales Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Ahad MacBook Management Console
          </h1>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-2xl">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'MacBooks' },
            { id: 'repairs', label: 'Repairs' },
            { id: 'orders', label: 'Orders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Gross Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-3">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Simulated transactions
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Customer Purchases</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-apple-blue">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-3">
                {stats.ordersCount}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Total completed orders
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Active Repair Queue</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-3">
                {stats.activeRepairsCount}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Devices in lab diagnostics
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Catalog Models</span>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Laptop className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-3">
                {stats.productsCount}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                MacBook configurations
              </span>
            </div>
          </div>

          {/* Quick Action Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-apple-blue" />
                  <span>Recent Repair Submissions</span>
                </h3>
                <button
                  onClick={() => setActiveTab('repairs')}
                  className="text-xs text-apple-blue font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {repairs.slice(0, 3).map((r) => (
                  <div key={r._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {r.ticketId}
                      </span>
                      <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                        {r.macbookModel}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-apple-blue">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  <span>Recent Orders</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-apple-blue font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.slice(0, 3).map((o) => (
                  <div key={o._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {o.orderNumber}
                      </span>
                      <p className="text-[11px] text-zinc-400">
                        {o.shippingAddress?.fullName} • ${o.totalPrice}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                      {o.orderStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                MacBook Inventory Management
              </h2>
              <p className="text-xs text-zinc-500">
                Add new Apple configurations, update pricing, stock units, and condition ratings.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold shadow-apple-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New MacBook</span>
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-apple-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">MacBook Model</th>
                    <th className="py-3 px-4 font-semibold">Chip & Memory</th>
                    <th className="py-3 px-4 font-semibold">Condition</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {prod.modelFamily} • {prod.screenSize}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {prod.chip}
                        </span>
                        <div className="text-[10px] text-zinc-400">
                          {prod.ram} / {prod.storage}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {prod.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                        ${prod.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            prod.stock > 0 ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-apple-blue hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPAIR TICKET MANAGEMENT */}
      {activeTab === 'repairs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Diagnostic & Repair Ticket Management
            </h2>
            <p className="text-xs text-zinc-500">
              Advance 5-stage repair statuses, enter diagnostic bench notes, and issue customer repair quotes.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-apple-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Repair ID</th>
                    <th className="py-3 px-4 font-semibold">Client & Device</th>
                    <th className="py-3 px-4 font-semibold">Issue Category</th>
                    <th className="py-3 px-4 font-semibold">Current Stage</th>
                    <th className="py-3 px-4 font-semibold">Cost Quote</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {repairs.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-apple-blue bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                          {ticket.ticketId}
                        </span>
                        <div className="text-[10px] text-zinc-400 mt-1">
                          {ticket.priority}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {ticket.customerName}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {ticket.macbookModel}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {ticket.issueCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                          {ticket.status}
                        </span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">
                          Stage {ticket.currentStageIndex + 1} of 5
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          ${ticket.finalCost || ticket.estimatedCost}
                        </span>
                        <div className="text-[10px] text-zinc-400">
                          Quote: {ticket.quoteStatus || 'Pending'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEditRepair(ticket)}
                          className="px-3 py-1.5 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          Manage Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Customer Orders & Fulfillment
            </h2>
            <p className="text-xs text-zinc-500">
              Track customer purchases, update FedEx tracking numbers, and advance shipping statuses.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-apple-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order #</th>
                    <th className="py-3 px-4 font-semibold">Recipient</th>
                    <th className="py-3 px-4 font-semibold">Items</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Tracking #</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {ord.shippingAddress?.fullName}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {ord.orderItems?.length} items
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                        ${ord.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                        {ord.trackingNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-100 dark:bg-blue-950 text-apple-blue'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingOrder(ord);
                            setOrderStatusUpdate(ord.orderStatus);
                            setOrderTrackingUpdate(ord.trackingNumber);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors"
                        >
                          Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-apple-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                {editingProduct ? 'Edit MacBook Details' : 'Add New MacBook to Catalog'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder='e.g. MacBook Pro 16" M3 Max (36GB / 1TB)'
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Model Family</label>
                  <select
                    value={productForm.modelFamily}
                    onChange={(e) => setProductForm({ ...productForm, modelFamily: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  >
                    <option value="MacBook Pro">MacBook Pro</option>
                    <option value="MacBook Air">MacBook Air</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Chip</label>
                  <select
                    value={productForm.chip}
                    onChange={(e) => setProductForm({ ...productForm, chip: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  >
                    {['M1', 'M1 Pro', 'M1 Max', 'M2', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Screen Size</label>
                  <select
                    value={productForm.screenSize}
                    onChange={(e) => setProductForm({ ...productForm, screenSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  >
                    <option value="13-inch">13-inch</option>
                    <option value="14-inch">14-inch</option>
                    <option value="15-inch">15-inch</option>
                    <option value="16-inch">16-inch</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Condition</label>
                  <select
                    value={productForm.condition}
                    onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  >
                    <option value="New">New</option>
                    <option value="Open Box">Open Box</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">RAM</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18GB"
                    value={productForm.ram}
                    onChange={(e) => setProductForm({ ...productForm, ram: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Storage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 512GB"
                    value={productForm.storage}
                    onChange={(e) => setProductForm({ ...productForm, storage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={productForm.images[0] || ''}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-xs font-semibold">
                  Feature on Homepage Showcase
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE REPAIR TICKET */}
      {isRepairModalOpen && editingRepair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsRepairModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-apple-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-apple-blue">
                  Technician Stage Control
                </span>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Ticket #{editingRepair.ticketId} • {editingRepair.customerName}
                </h3>
              </div>
              <button onClick={() => setIsRepairModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSaveRepair} className="space-y-4 text-xs">
              {/* Stage Progress Selector */}
              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">
                  Advance 5-Stage Repair Process
                </label>
                <select
                  value={repairForm.currentStageIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    const stages = [
                      'Received & Diagnosed',
                      'Quote Sent',
                      'Repair in Progress',
                      'Quality Testing',
                      'Ready for Pickup/Shipped',
                    ];
                    setRepairForm({
                      ...repairForm,
                      currentStageIndex: idx,
                      status: stages[idx],
                    });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-semibold text-apple-blue"
                >
                  <option value={0}>Stage 1: Received & Diagnosed</option>
                  <option value={1}>Stage 2: Quote Sent</option>
                  <option value={2}>Stage 3: Repair in Progress</option>
                  <option value={3}>Stage 4: Quality Testing</option>
                  <option value={4}>Stage 5: Ready for Pickup/Shipped</option>
                </select>
              </div>

              {/* Technician Diagnostic Notes */}
              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">
                  Technician Diagnostic Notes (Visible on Customer Tracker)
                </label>
                <textarea
                  rows={3}
                  value={repairForm.technicianNotes}
                  onChange={(e) =>
                    setRepairForm({ ...repairForm, technicianNotes: e.target.value })
                  }
                  placeholder="e.g. Ultrasonic bath complete. New display panel calibrated with Apple diagnostic tool pass."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">
                    Customer Cost Quote ($)
                  </label>
                  <input
                    type="number"
                    value={repairForm.finalCost}
                    onChange={(e) =>
                      setRepairForm({ ...repairForm, finalCost: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1">
                    Quote Approval Status
                  </label>
                  <select
                    value={repairForm.quoteStatus}
                    onChange={(e) =>
                      setRepairForm({ ...repairForm, quoteStatus: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1">
                  Assigned Lead Technician
                </label>
                <input
                  type="text"
                  value={repairForm.assignedTechnician}
                  onChange={(e) =>
                    setRepairForm({ ...repairForm, assignedTechnician: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRepairModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-bold shadow-sm"
                >
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER STATUS UPDATE */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingOrder(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-apple-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Update Order #{editingOrder.orderNumber}
              </h3>
              <button onClick={() => setEditingOrder(null)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div>
              <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">
                Fulfillment Status
              </label>
              <select
                value={orderStatusUpdate}
                onChange={(e) => setOrderStatusUpdate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">
                Carrier Tracking Number
              </label>
              <input
                type="text"
                value={orderTrackingUpdate}
                onChange={(e) => setOrderTrackingUpdate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveOrderStatus(editingOrder._id)}
                className="px-4 py-1.5 rounded-xl bg-apple-blue text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
