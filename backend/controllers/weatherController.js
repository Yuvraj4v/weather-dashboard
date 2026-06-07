/**
 * Weather Controller
 * Handles all OpenWeatherMap API interactions
 */

const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';
const AQI_URL = 'http://api.openweathermap.org/data/2.5/air_pollution';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Helper to build API URLs
const buildUrl = (endpoint, params) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('appid', API_KEY);
  url.searchParams.append('units', params.units || 'metric');
  Object.entries(params).forEach(([k, v]) => {
    if (k !== 'units') url.searchParams.append(k, v);
  });
  return url.toString();
};

// ─── Current Weather ─────────────────────────────────────────────────────────
exports.getCurrentWeather = async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;
    let url;

    if (lat && lon) {
      url = buildUrl('weather', { lat, lon, units });
    } else if (city) {
      url = buildUrl('weather', { q: city, units });
    } else {
      return res.status(400).json({ error: 'City name or coordinates required' });
    }

    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found. Please check the city name.' });
    }
    res.status(500).json({ error: 'Failed to fetch weather data', message: err.message });
  }
};

// ─── 5-Day Forecast ──────────────────────────────────────────────────────────
exports.getForecast = async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;
    let url;

    if (lat && lon) {
      url = buildUrl('forecast', { lat, lon, units });
    } else if (city) {
      url = buildUrl('forecast', { q: city, units });
    } else {
      return res.status(400).json({ error: 'City name or coordinates required' });
    }

    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found.' });
    }
    res.status(500).json({ error: 'Failed to fetch forecast data', message: err.message });
  }
};

// ─── Air Quality Index ────────────────────────────────────────────────────────
exports.getAirQuality = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Coordinates required for AQI' });
    }

    const url = `${AQI_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch AQI data', message: err.message });
  }
};

// ─── Geocoding (city search suggestions) ────────────────────────────────────
exports.geocodeCity = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });

    const url = `${GEO_URL}/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${API_KEY}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', message: err.message });
  }
};
