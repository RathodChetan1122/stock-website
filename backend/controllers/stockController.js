const Stock = require('../models/Stock');

// GET all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const { sector, search, sort = 'symbol' } = req.query;
    
    let query = {};
    if (sector) query.sector = sector;
    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const stocks = await Stock.find(query).sort(sort);
    
    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single stock
exports.getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET stock by symbol
exports.getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create new stock
exports.createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: stock
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Stock symbol already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update stock
exports.updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: stock
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH update stock price (simulate live price update)
exports.updateStockPrice = async (req, res) => {
  try {
    const { currentPrice } = req.body;
    if (!currentPrice) {
      return res.status(400).json({ success: false, message: 'currentPrice is required' });
    }

    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    stock.previousClose = stock.currentPrice;
    stock.currentPrice = currentPrice;
    await stock.save();

    res.status(200).json({
      success: true,
      message: 'Price updated',
      data: stock
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE stock
exports.deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Stock deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET market stats
exports.getMarketStats = async (req, res) => {
  try {
    const stocks = await Stock.find();
    const gainers = stocks.filter(s => s.priceChange > 0).sort((a, b) => b.percentChange - a.percentChange).slice(0, 5);
    const losers = stocks.filter(s => s.priceChange < 0).sort((a, b) => a.percentChange - b.percentChange).slice(0, 5);
    const totalMarketCap = stocks.reduce((sum, s) => sum + (s.marketCap || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalStocks: stocks.length,
        gainers,
        losers,
        totalMarketCap
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
