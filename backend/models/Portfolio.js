const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  symbol: String,
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  avgBuyPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  totalInvested: {
    type: Number,
    default: 0
  }
});

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Portfolio name is required'],
    default: 'My Portfolio'
  },
  cash: {
    type: Number,
    default: 100000,
    min: [0, 'Cash cannot be negative']
  },
  holdings: [holdingSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
