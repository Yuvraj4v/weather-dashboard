/**
 * Favorite Cities Controller
 */

const FavoriteCity = require('../models/FavoriteCity');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await FavoriteCity.find().sort({ addedAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { city, country, lat, lon } = req.body;
    if (!city) return res.status(400).json({ error: 'City is required' });

    const existing = await FavoriteCity.findOne({ city: city.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'City already in favorites' });

    const favorite = new FavoriteCity({ city, country, lat, lon });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await FavoriteCity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
