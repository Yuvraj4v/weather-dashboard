const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getForecast,
  getAirQuality,
  geocodeCity
} = require('../controllers/weatherController');

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/aqi', getAirQuality);
router.get('/geocode', geocodeCity);

module.exports = router;
