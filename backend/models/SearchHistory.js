const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
