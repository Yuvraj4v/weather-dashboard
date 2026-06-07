/**
 * WeatherContext - Global state management for the weather dashboard
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WeatherContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function WeatherProvider({ children }) {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'metric');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('searchHistory') || '[]'); }
    catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); }
    catch { return []; }
  });
  const [currentCity, setCurrentCity] = useState('');

  // ─── Apply dark mode to document ──────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ─── Fetch weather by city ────────────────────────────────────────────────
  const fetchWeatherByCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${API_BASE}/weather/current?city=${encodeURIComponent(city)}&units=${unit}`),
        axios.get(`${API_BASE}/weather/forecast?city=${encodeURIComponent(city)}&units=${unit}`),
      ]);

      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setCurrentCity(city);

      // Fetch AQI using coordinates
      const { lat, lon } = weatherRes.data.coord;
      try {
        const aqiRes = await axios.get(`${API_BASE}/weather/aqi?lat=${lat}&lon=${lon}`);
        setAqi(aqiRes.data);
      } catch { setAqi(null); }

      // Save to history
      const entry = {
        id: Date.now(),
        city: weatherRes.data.name,
        country: weatherRes.data.sys.country,
        lat, lon,
        searchedAt: new Date().toISOString(),
      };
      addToHistory(entry);

      // Try to save to backend (non-blocking)
      axios.post(`${API_BASE}/history`, entry).catch(() => {});

    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch weather. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  // ─── Fetch weather by coordinates (geolocation) ───────────────────────────
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${API_BASE}/weather/current?lat=${lat}&lon=${lon}&units=${unit}`),
        axios.get(`${API_BASE}/weather/forecast?lat=${lat}&lon=${lon}&units=${unit}`),
      ]);

      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setCurrentCity(weatherRes.data.name);

      try {
        const aqiRes = await axios.get(`${API_BASE}/weather/aqi?lat=${lat}&lon=${lon}`);
        setAqi(aqiRes.data);
      } catch { setAqi(null); }

    } catch (err) {
      setError('Failed to fetch weather for your location.');
    } finally {
      setLoading(false);
    }
  }, [unit]);

  // ─── Refetch when unit changes ─────────────────────────────────────────────
  useEffect(() => {
    if (currentCity) fetchWeatherByCity(currentCity);
    localStorage.setItem('unit', unit);
  }, [unit]);

  // ─── History management ────────────────────────────────────────────────────
  const addToHistory = (entry) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.city.toLowerCase() !== entry.city.toLowerCase());
      const updated = [entry, ...filtered].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
    axios.delete(`${API_BASE}/history`).catch(() => {});
  };

  // ─── Favorites management ──────────────────────────────────────────────────
  const toggleFavorite = (cityData) => {
    const city = cityData.name;
    const isFav = favorites.some(f => f.city.toLowerCase() === city.toLowerCase());

    if (isFav) {
      setFavorites(prev => {
        const updated = prev.filter(f => f.city.toLowerCase() !== city.toLowerCase());
        localStorage.setItem('favorites', JSON.stringify(updated));
        return updated;
      });
    } else {
      const entry = {
        id: Date.now(),
        city,
        country: cityData.sys?.country,
        lat: cityData.coord?.lat,
        lon: cityData.coord?.lon,
      };
      setFavorites(prev => {
        const updated = [entry, ...prev];
        localStorage.setItem('favorites', JSON.stringify(updated));
        return updated;
      });
      axios.post(`${API_BASE}/favorites`, entry).catch(() => {});
    }
  };

  const isFavorite = (cityName) => {
    return favorites.some(f => f.city?.toLowerCase() === cityName?.toLowerCase());
  };

  // ─── Geolocation ──────────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => setError('Unable to retrieve your location. Please search manually.')
    );
  };

  const toggleUnit = () => setUnit(u => u === 'metric' ? 'imperial' : 'metric');
  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <WeatherContext.Provider value={{
      weather, forecast, aqi, loading, error,
      unit, darkMode, history, favorites, currentCity,
      fetchWeatherByCity, fetchWeatherByCoords,
      detectLocation, toggleUnit, toggleDarkMode,
      toggleFavorite, isFavorite, clearHistory,
      setError,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
};
