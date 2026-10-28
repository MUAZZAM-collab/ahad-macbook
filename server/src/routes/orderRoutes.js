const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/stats/summary', protect, admin, getAdminStats);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
