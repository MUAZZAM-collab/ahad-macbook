const mongoose = require('mongoose');

const repairTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      required: [true, 'Please enter customer name'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Please enter customer email'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Please enter customer phone number'],
    },
    macbookModel: {
      type: String,
      required: [true, 'Please specify MacBook model'],
    },
    serialNumber: {
      type: String,
      default: '',
    },
    issueCategory: {
      type: String,
      required: [true, 'Please select issue category'],
      enum: [
        'Screen Replacement',
        'Battery Service',
        'Logic Board Repair',
        'Keyboard & Trackpad',
        'Water Damage',
        'Other',
      ],
    },
    issueDescription: {
      type: String,
      required: [true, 'Please describe the problem in detail'],
    },
    deliveryMethod: {
      type: String,
      enum: ['Drop-off in Store', 'Mail-in Service', 'On-site Pickup'],
      default: 'Drop-off in Store',
    },
    status: {
      type: String,
      enum: [
        'Received & Diagnosed',
        'Quote Sent',
        'Repair in Progress',
        'Quality Testing',
        'Ready for Pickup/Shipped',
        'Completed',
        'Cancelled',
      ],
      default: 'Received & Diagnosed',
    },
    currentStageIndex: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
    timeline: [
      {
        stageIndex: Number,
        stage: String,
        title: String,
        description: String,
        timestamp: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false },
      },
    ],
    estimatedCost: {
      type: Number,
      default: 0,
    },
    finalCost: {
      type: Number,
      default: 0,
    },
    quoteStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Declined'],
      default: 'Pending',
    },
    technicianNotes: {
      type: String,
      default: 'Initial inspection underway by certified Apple technician.',
    },
    assignedTechnician: {
      type: String,
      default: 'Ahad Tech Lab Team',
    },
    priority: {
      type: String,
      enum: ['Standard', 'Rush / Express'],
      default: 'Standard',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RepairTicket', repairTicketSchema);
