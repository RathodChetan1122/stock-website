const express = require('express');
const router = express.Router();
const {
  getAllPortfolios,
  getPortfolio,
  createPortfolio,
  buyStock,
  sellStock,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');

// GET /api/portfolio - Get all
// POST /api/portfolio - Create
router.route('/')
  .get(getAllPortfolios)
  .post(createPortfolio);

// GET /api/portfolio/:id - Get single
// PUT /api/portfolio/:id - Update
// DELETE /api/portfolio/:id - Delete
router.route('/:id')
  .get(getPortfolio)
  .put(updatePortfolio)
  .delete(deletePortfolio);

// POST /api/portfolio/:id/buy - Buy stock
router.post('/:id/buy', buyStock);

// POST /api/portfolio/:id/sell - Sell stock
router.post('/:id/sell', sellStock);

module.exports = router;
