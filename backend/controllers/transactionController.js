const Transaction = require('../models/Transaction');

// GET all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const { type, portfolioId, limit = 50 } = req.query;
    let query = {};
    if (type) query.type = type.toUpperCase();
    if (portfolioId) query.portfolio = portfolioId;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('stock', 'symbol name currentPrice');

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('stock portfolio');
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE transaction (cancel)
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.status(200).json({ success: true, message: 'Transaction deleted', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
