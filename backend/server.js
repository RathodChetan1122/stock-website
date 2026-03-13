// StockWebsite Backend v2 - Auth Added
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI ||
  'mongodb+srv://chetanrathod1257_db_user:WcCGr6ekUPofVgEZ@stockapp.e9s7zbs.mongodb.net/stockapp?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StockWebsite v2 running', auth: true });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server on port ' + PORT));

module.exports = app;