const mongoose = require('mongoose');

const favoriteCitySchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FavoriteCity', favoriteCitySchema);
