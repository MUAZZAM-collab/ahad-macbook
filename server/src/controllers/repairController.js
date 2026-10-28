const DataStore = require('../services/dataStore');

// Define standard 5-stage tracking lifecycle
const TRACKING_STAGES = [
  {
    stageIndex: 0,
    stage: 'Received & Diagnosed',
    title: 'Checked in & Diagnostic Evaluation',
    description: 'Device logged into Ahad repair facility. Technician inspecting logic board, display, and components.',
  },
  {
    stageIndex: 1,
    stage: 'Quote Sent',
    title: 'Customer Quote Issued',
    description: 'Diagnostic report complete. Official itemized repair quote generated for customer review and approval.',
  },
  {
    stageIndex: 2,
    stage: 'Repair in Progress',
    title: 'Hardware Service Underway',
    description: 'Certified technician carrying out component replacement, micro-soldering, or parts assembly.',
  },
  {
    stageIndex: 3,
    stage: 'Quality Testing',
    title: 'Benchmarking & Diagnostics',
    description: 'Passing Apple Hardware Diagnostics, display calibration, thermal tests, and power cycles.',
  },
  {
    stageIndex: 4,
    stage: 'Ready for Pickup/Shipped',
    title: 'Ready for Collection / En Route',
    description: 'Device certified ready. Customer notified for in-store pickup or package dispatched with tracking.',
  },
];

// Helper to generate unique AMB-XXXX code
const generateTicketId = async () => {
  let isUnique = false;
  let code = '';
  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    code = `AMB-${randomNum}`;
    const existing = await DataStore.repairTickets.findByTicketId(code);
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

// Baseline pricing matrix for Instant Estimate Calculator
const ESTIMATE_MATRIX = {
  'MacBook Air 13" (M1)': {
    'Screen Replacement': 279,
    'Battery Service': 129,
    'Logic Board Repair': 249,
    'Keyboard & Trackpad': 159,
    'Water Damage': 299,
    Other: 99,
  },
  'MacBook Air 13" (M2)': {
    'Screen Replacement': 329,
    'Battery Service': 139,
    'Logic Board Repair': 299,
    'Keyboard & Trackpad': 179,
    'Water Damage': 349,
    Other: 119,
  },
  'MacBook Air 15" (M2/M3)': {
    'Screen Replacement': 389,
    'Battery Service': 149,
    'Logic Board Repair': 329,
    'Keyboard & Trackpad': 189,
    'Water Damage': 369,
    Other: 129,
  },
  'MacBook Pro 13" (M1/M2)': {
    'Screen Replacement': 299,
    'Battery Service': 139,
    'Logic Board Repair': 289,
    'Keyboard & Trackpad': 169,
    'Water Damage': 329,
    Other: 109,
  },
  'MacBook Pro 14" (M1/M2/M3 Pro & Max)': {
    'Screen Replacement': 489,
    'Battery Service': 179,
    'Logic Board Repair': 389,
    'Keyboard & Trackpad': 219,
    'Water Damage': 429,
    Other: 149,
  },
  'MacBook Pro 16" (M1/M2/M3 Pro & Max)': {
    'Screen Replacement': 589,
    'Battery Service': 199,
    'Logic Board Repair': 449,
    'Keyboard & Trackpad': 249,
    'Water Damage': 489,
    Other: 169,
  },
  'Other / Intel Legacy MacBook': {
    'Screen Replacement': 249,
    'Battery Service': 119,
    'Logic Board Repair': 229,
    'Keyboard & Trackpad': 149,
    'Water Damage': 269,
    Other: 89,
  },
};

// @desc    Create a new repair booking
// @route   POST /api/repairs
// @access  Public / Optional Auth
const createRepairTicket = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      macbookModel,
      serialNumber,
      issueCategory,
      issueDescription,
      deliveryMethod,
      priority,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !macbookModel ||
      !issueCategory ||
      !issueDescription
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required booking details',
      });
    }

    const ticketId = await generateTicketId();

    // Estimate baseline calculation
    let estimatedCost = 0;
    const modelKey = Object.keys(ESTIMATE_MATRIX).find((k) =>
      macbookModel.toLowerCase().includes(k.toLowerCase())
    );
    if (modelKey && ESTIMATE_MATRIX[modelKey][issueCategory]) {
      estimatedCost = ESTIMATE_MATRIX[modelKey][issueCategory];
    } else {
      estimatedCost = 199; // default initial baseline
    }

    // Build timeline with initial stage active
    const now = new Date();
    const timeline = TRACKING_STAGES.map((stage, idx) => ({
      stageIndex: idx,
      stage: stage.stage,
      title: stage.title,
      description: stage.description,
      timestamp: idx === 0 ? now : null,
      completed: idx === 0,
    }));

    const ticket = await DataStore.repairTickets.create({
      ticketId,
      user: req.user ? req.user._id : null,
      customerName,
      customerEmail,
      customerPhone,
      macbookModel,
      serialNumber: serialNumber || '',
      issueCategory,
      issueDescription,
      deliveryMethod: deliveryMethod || 'Drop-off in Store',
      priority: priority || 'Standard',
      status: 'Received & Diagnosed',
      currentStageIndex: 0,
      timeline,
      estimatedCost,
      finalCost: estimatedCost,
      quoteStatus: 'Pending',
      technicianNotes: 'Ticket created. Device queued for initial diagnostic review.',
      assignedTechnician: 'Ahad Certified Mac Technicians',
    });

    res.status(201).json({
      success: true,
      data: ticket,
      message: `Repair booking registered successfully with Repair ID ${ticketId}`,
    });
  } catch (error) {
    console.error('[Create Repair Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get repair status by Ticket ID (e.g. AMB-9482)
// @route   GET /api/repairs/track/:ticketId
// @access  Public
const getRepairByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await DataStore.repairTickets.findByTicketId(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `No repair record found for Repair ID "${ticketId.toUpperCase()}". Please check your ID and try again.`,
      });
    }

    res.json({
      success: true,
      data: ticket,
      stagesDefinition: TRACKING_STAGES,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get instant estimate calculator baseline
// @route   GET /api/repairs/estimate-matrix
// @access  Public
const getEstimateMatrix = async (req, res) => {
  try {
    res.json({
      success: true,
      data: ESTIMATE_MATRIX,
      models: Object.keys(ESTIMATE_MATRIX),
      categories: [
        'Screen Replacement',
        'Battery Service',
        'Logic Board Repair',
        'Keyboard & Trackpad',
        'Water Damage',
        'Other',
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all repair tickets (Admin only)
// @route   GET /api/repairs
// @access  Private/Admin
const getAllRepairTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const tickets = await DataStore.repairTickets.find(query);

    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
      stagesDefinition: TRACKING_STAGES,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update repair ticket stage, notes, or quote (Admin only)
// @route   PUT /api/repairs/:id
// @access  Private/Admin
const updateRepairTicket = async (req, res) => {
  try {
    const ticket = await DataStore.repairTickets.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Repair ticket not found',
      });
    }

    const {
      status,
      currentStageIndex,
      technicianNotes,
      estimatedCost,
      finalCost,
      quoteStatus,
      assignedTechnician,
      priority,
    } = req.body;

    const updates = {};
    if (technicianNotes !== undefined) updates.technicianNotes = technicianNotes;
    if (estimatedCost !== undefined) updates.estimatedCost = Number(estimatedCost);
    if (finalCost !== undefined) updates.finalCost = Number(finalCost);
    if (quoteStatus !== undefined) updates.quoteStatus = quoteStatus;
    if (assignedTechnician !== undefined) updates.assignedTechnician = assignedTechnician;
    if (priority !== undefined) updates.priority = priority;

    // Stage progression update
    if (currentStageIndex !== undefined || status !== undefined) {
      let targetIndex = currentStageIndex;
      if (targetIndex === undefined && status) {
        targetIndex = TRACKING_STAGES.findIndex((s) => s.stage === status);
        if (targetIndex === -1) targetIndex = ticket.currentStageIndex;
      }

      if (targetIndex >= 0 && targetIndex < TRACKING_STAGES.length) {
        updates.currentStageIndex = targetIndex;
        updates.status = TRACKING_STAGES[targetIndex].stage;

        // Update timeline status
        const updatedTimeline = (ticket.timeline || []).map((step, idx) => {
          if (idx <= targetIndex) {
            return {
              ...step,
              completed: true,
              timestamp: step.timestamp || new Date(),
            };
          } else {
            return {
              ...step,
              completed: false,
              timestamp: null,
            };
          }
        });
        updates.timeline = updatedTimeline;
      }
    }

    const updatedTicket = await DataStore.repairTickets.findByIdAndUpdate(
      req.params.id,
      updates
    );

    res.json({
      success: true,
      data: updatedTicket,
      message: 'Repair ticket updated successfully',
    });
  } catch (error) {
    console.error('[Update Repair Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Customer approves or declines quote
// @route   POST /api/repairs/track/:ticketId/quote
// @access  Public
const updateQuoteApproval = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { action } = req.body; // 'approve' or 'decline'

    const ticket = await DataStore.repairTickets.findByTicketId(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const newQuoteStatus = action === 'approve' ? 'Approved' : 'Declined';
    const notesAddition = ` Customer ${action === 'approve' ? 'approved' : 'declined'} quote on ${new Date().toLocaleDateString()}.`;

    // If approved and currently at Quote Sent stage, advance to Repair in Progress!
    let nextStageIndex = ticket.currentStageIndex;
    let nextStatus = ticket.status;

    if (action === 'approve' && ticket.currentStageIndex === 1) {
      nextStageIndex = 2; // Repair in Progress
      nextStatus = 'Repair in Progress';
    }

    const updated = await DataStore.repairTickets.findByIdAndUpdate(ticket._id, {
      quoteStatus: newQuoteStatus,
      currentStageIndex: nextStageIndex,
      status: nextStatus,
      technicianNotes: (ticket.technicianNotes || '') + notesAddition,
    });

    res.json({
      success: true,
      data: updated,
      message: `Quote ${newQuoteStatus.toLowerCase()} successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRepairTicket,
  getRepairByTicketId,
  getEstimateMatrix,
  getAllRepairTickets,
  updateRepairTicket,
  updateQuoteApproval,
};
