const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    modelFamily: {
      type: String,
      required: [true, 'Please select MacBook family'],
      enum: ['MacBook Pro', 'MacBook Air'],
    },
    chip: {
      type: String,
      required: [true, 'Please select Apple Silicon chip'],
      enum: [
        'M1',
        'M1 Pro',
        'M1 Max',
        'M2',
        'M2 Pro',
        'M2 Max',
        'M3',
        'M3 Pro',
        'M3 Max',
      ],
    },
    screenSize: {
      type: String,
      required: [true, 'Please select screen size'],
      enum: ['13-inch', '14-inch', '15-inch', '16-inch'],
    },
    ram: {
      type: String,
      required: [true, 'Please select RAM size'],
    },
    storage: {
      type: String,
      required: [true, 'Please select storage capacity'],
    },
    color: {
      type: String,
      default: 'Space Gray',
    },
    condition: {
      type: String,
      required: [true, 'Please specify condition'],
      enum: ['New', 'Open Box', 'Refurbished'],
      default: 'Refurbished',
    },
    price: {
      type: Number,
      required: [true, 'Please specify price'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, 'Please enter stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    specs: {
      processorDetails: { type: String, default: '' },
      display: { type: String, default: 'Liquid Retina XDR display' },
      batteryHealth: { type: String, default: '100% / Normal' },
      ports: [{ type: String }],
      weight: { type: String, default: '3.5 lbs' },
      cycleCount: { type: Number, default: 15 },
      warranty: { type: String, default: '1-Year Ahad Certified Warranty' },
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 14,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
