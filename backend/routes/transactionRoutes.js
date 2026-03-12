const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.route('/')
  .get(getAllTransactions);

router.route('/:id')
  .get(getTransaction)
  .delete(deleteTransaction);

module.exports = router;
