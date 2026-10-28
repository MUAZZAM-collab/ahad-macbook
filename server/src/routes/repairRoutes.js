const express = require('express');
const router = express.Router();
const {
  createRepairTicket,
  getRepairByTicketId,
  getEstimateMatrix,
  getAllRepairTickets,
  updateRepairTicket,
  updateQuoteApproval,
} = require('../controllers/repairController');
const { protect, admin, optionalAuth } = require('../middleware/auth');

router.get('/estimate-matrix', getEstimateMatrix);
router.post('/', optionalAuth, createRepairTicket);
router.get('/track/:ticketId', getRepairByTicketId);
router.post('/track/:ticketId/quote', updateQuoteApproval);
router.get('/', protect, admin, getAllRepairTickets);
router.put('/:id', protect, admin, updateRepairTicket);

module.exports = router;
