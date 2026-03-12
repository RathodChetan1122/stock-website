const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load .env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const stockRoutes = require('./routes/stockRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB — fallback URI hardcoded for Render deployment
const MONGO_URI = process.env.MONGODB_URI || 
  'mongodb+srv://chetanrathod1257_db_user:WcCGr6ekUPofVgEZ@stockapp.e9s7zbs.mongodb.net/stockapp?retryWrites=true&w=majority';

console.log('Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// API Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'StockApp API is running',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});

module.exports = app;