/**
 * Search History Controller
 */

const SearchHistory = require('../models/SearchHistory');

exports.getHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find()
      .sort({ searchedAt: -1 })
      .limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const { city, country, lat, lon } = req.body;
    if (!city) return res.status(400).json({ error: 'City is required' });

    // Upsert - update timestamp if exists, else create
    const entry = await SearchHistory.findOneAndUpdate(
      { city: city.toLowerCase() },
      { city, country, lat, lon, searchedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save history' });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await SearchHistory.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

exports.deleteHistoryItem = async (req, res) => {
  try {
    await SearchHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
