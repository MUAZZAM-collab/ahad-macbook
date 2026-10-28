const DataStore = require('../services/dataStore');

// Helper to generate unique ORD-XXXXX code
const generateOrderNumber = async () => {
  let isUnique = false;
  let code = '';
  while (!isUnique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    code = `ORD-${randomNum}`;
    const existing = await DataStore.orders.findByOrderNumber(code);
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address',
      });
    }

    const orderNumber = await generateOrderNumber();

    // Deduct stock for ordered products
    for (const item of orderItems) {
      const prod = await DataStore.products.findById(item.product);
      if (prod && prod.stock > 0) {
        await DataStore.products.findByIdAndUpdate(item.product, {
          stock: Math.max(0, prod.stock - (item.quantity || 1)),
        });
      }
    }

    const simulatedPaymentId = 'SIM_PAY_' + Math.floor(10000000 + Math.random() * 90000000);

    const order = await DataStore.orders.create({
      orderNumber,
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card / Apple Pay (Simulated)',
      paymentResult: {
        id: simulatedPaymentId,
        status: 'COMPLETED',
        updateTime: new Date().toISOString(),
        emailAddress: req.user.email,
      },
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Processing',
      trackingNumber: 'FEDEX-AMB-' + Math.floor(100000 + Math.random() * 900000),
    });

    res.status(201).json({
      success: true,
      data: order,
      message: `Order placed successfully! Order #${orderNumber}`,
    });
  } catch (error) {
    console.error('[Create Order Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await DataStore.orders.find({ user: req.user._id });
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await DataStore.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: must be admin or order owner
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const orders = await DataStore.orders.find(query);
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order fulfillment status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await DataStore.orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updates = { orderStatus };
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (orderStatus === 'Delivered') updates.deliveredAt = new Date();

    const updated = await DataStore.orders.findByIdAndUpdate(req.params.id, updates);

    res.json({
      success: true,
      data: updated,
      message: `Order status updated to ${orderStatus}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get overall admin stats
// @route   GET /api/orders/stats/summary
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const orders = await DataStore.orders.find({});
    const products = await DataStore.products.find({});
    const repairs = await DataStore.repairTickets.find({});

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const activeRepairs = repairs.filter(
      (r) => r.status !== 'Ready for Pickup/Shipped' && r.status !== 'Completed'
    ).length;

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        ordersCount: orders.length,
        productsCount: products.length,
        repairsCount: repairs.length,
        activeRepairsCount: activeRepairs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
};
