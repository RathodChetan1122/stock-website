const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

// GET all portfolios
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('holdings.stock');
    res.status(200).json({ success: true, count: portfolios.length, data: portfolios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('holdings.stock');
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    // Calculate current values
    let totalCurrentValue = 0;
    let totalInvested = 0;
    const holdingsWithStats = portfolio.holdings.map(h => {
      const currentVal = h.stock.currentPrice * h.quantity;
      const invested = h.avgBuyPrice * h.quantity;
      totalCurrentValue += currentVal;
      totalInvested += invested;
      return {
        ...h.toObject(),
        currentValue: currentVal,
        profitLoss: currentVal - invested,
        profitLossPercent: ((currentVal - invested) / invested * 100).toFixed(2)
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...portfolio.toObject(),
        holdings: holdingsWithStats,
        totalCurrentValue,
        totalInvested,
        totalProfitLoss: totalCurrentValue - totalInvested,
        totalProfitLossPercent: totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(2) : 0,
        totalPortfolioValue: totalCurrentValue + portfolio.cash
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create portfolio
exports.createPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.create(req.body);
    res.status(201).json({ success: true, message: 'Portfolio created', data: portfolio });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST buy stock
exports.buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    const totalCost = stock.currentPrice * quantity;
    if (portfolio.cash < totalCost) {
      return res.status(400).json({ success: false, message: `Insufficient funds. Need $${totalCost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}` });
    }

    // Update or add holding
    const existingHolding = portfolio.holdings.find(h => h.stock.toString() === stockId);
    if (existingHolding) {
      const totalShares = existingHolding.quantity + quantity;
      const totalInvested = existingHolding.avgBuyPrice * existingHolding.quantity + totalCost;
      existingHolding.avgBuyPrice = totalInvested / totalShares;
      existingHolding.quantity = totalShares;
      existingHolding.totalInvested = totalInvested;
    } else {
      portfolio.holdings.push({
        stock: stockId,
        symbol: stock.symbol,
        quantity,
        avgBuyPrice: stock.currentPrice,
        totalInvested: totalCost
      });
    }

    portfolio.cash -= totalCost;
    await portfolio.save();

    // Record transaction
    await Transaction.create({
      portfolio: portfolio._id,
      stock: stock._id,
      symbol: stock.symbol,
      companyName: stock.name,
      type: 'BUY',
      quantity,
      price: stock.currentPrice,
      total: totalCost,
      status: 'COMPLETED'
    });

    res.status(200).json({ success: true, message: `Bought ${quantity} shares of ${stock.symbol}`, data: portfolio });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST sell stock
exports.sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    const holdingIndex = portfolio.holdings.findIndex(h => h.stock.toString() === stockId);
    if (holdingIndex === -1) {
      return res.status(400).json({ success: false, message: 'You do not own this stock' });
    }

    const holding = portfolio.holdings[holdingIndex];
    if (holding.quantity < quantity) {
      return res.status(400).json({ success: false, message: `You only have ${holding.quantity} shares` });
    }

    const totalRevenue = stock.currentPrice * quantity;
    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }
    portfolio.cash += totalRevenue;
    await portfolio.save();

    await Transaction.create({
      portfolio: portfolio._id,
      stock: stock._id,
      symbol: stock.symbol,
      companyName: stock.name,
      type: 'SELL',
      quantity,
      price: stock.currentPrice,
      total: totalRevenue,
      status: 'COMPLETED'
    });

    res.status(200).json({ success: true, message: `Sold ${quantity} shares of ${stock.symbol}`, data: portfolio });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update portfolio
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.status(200).json({ success: true, message: 'Portfolio updated', data: portfolio });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE portfolio
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.status(200).json({ success: true, message: 'Portfolio deleted', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
