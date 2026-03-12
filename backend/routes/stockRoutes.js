const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockById,
  getStockBySymbol,
  createStock,
  updateStock,
  updateStockPrice,
  deleteStock,
  getMarketStats
} = require('../controllers/stockController');

// GET /api/stocks/stats - Market stats
router.get('/stats', getMarketStats);

// GET /api/stocks/symbol/:symbol - Get by symbol
router.get('/symbol/:symbol', getStockBySymbol);

// GET /api/stocks - Get all stocks
// POST /api/stocks - Create stock
router.route('/')
  .get(getAllStocks)
  .post(createStock);

// GET /api/stocks/:id - Get single stock
// PUT /api/stocks/:id - Update stock
// DELETE /api/stocks/:id - Delete stock
router.route('/:id')
  .get(getStockById)
  .put(updateStock)
  .delete(deleteStock);

// PATCH /api/stocks/:id/price - Update price only
router.patch('/:id/price', updateStockPrice);

module.exports = router;
