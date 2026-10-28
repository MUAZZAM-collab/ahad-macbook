const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
        chip: { type: String },
        ram: { type: String },
        storage: { type: String },
        condition: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United States' },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card / Apple Pay (Simulated)',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String, default: 'COMPLETED' },
      updateTime: { type: String },
      emailAddress: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    deliveredAt: {
      type: Date,
    },
    trackingNumber: {
      type: String,
      default: function () {
        return 'FEDEX-AMB-' + Math.floor(100000 + Math.random() * 900000);
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
