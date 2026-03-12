const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Symbol cannot exceed 10 characters']
  },
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  sector: {
    type: String,
    required: [true, 'Sector is required'],
    enum: ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Materials', 'Utilities', 'Real Estate', 'Communication']
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  previousClose: {
    type: Number,
    default: 0
  },
  openPrice: {
    type: Number,
    default: 0
  },
  highPrice: {
    type: Number,
    default: 0
  },
  lowPrice: {
    type: Number,
    default: 0
  },
  volume: {
    type: Number,
    default: 0
  },
  marketCap: {
    type: Number,
    default: 0
  },
  peRatio: {
    type: Number,
    default: 0
  },
  dividendYield: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  logoColor: {
    type: String,
    default: '#00d4ff'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual: price change
stockSchema.virtual('priceChange').get(function() {
  return parseFloat((this.currentPrice - this.previousClose).toFixed(2));
});

// Virtual: percent change
stockSchema.virtual('percentChange').get(function() {
  if (!this.previousClose) return 0;
  return parseFloat(((this.currentPrice - this.previousClose) / this.previousClose * 100).toFixed(2));
});

module.exports = mongoose.model('Stock', stockSchema);
