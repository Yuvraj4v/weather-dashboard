const express = require('express');
const router = express.Router();
const {
  getHistory,
  addToHistory,
  clearHistory,
  deleteHistoryItem
} = require('../controllers/historyController');

router.get('/', getHistory);
router.post('/', addToHistory);
router.delete('/', clearHistory);
router.delete('/:id', deleteHistoryItem);

module.exports = router;
