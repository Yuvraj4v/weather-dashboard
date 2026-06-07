/**
 * Navbar - Top navigation bar
 */

import { Sun, Moon, Menu, MapPin, Thermometer, RefreshCw } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export default function Navbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode, unit, toggleUnit, detectLocation, loading, weather } = useWeather();

  return (
    <nav className="relative z-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center neon-border">
              <span className="text-lg">🌤️</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-white tracking-tight">
                Nimbus
              </h1>
              <p className="text-xs text-white/40 hidden sm:block font-mono tracking-wider uppercase">
                Weather Dashboard
              </p>
            </div>
          </div>

          {/* Center — current city if available */}
          {weather && (
            <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-sm font-display font-medium text-white">
                {weather.name}, {weather.sys?.country}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Geolocation */}
            <button
              onClick={detectLocation}
              disabled={loading}
              title="Detect my location"
              className="glass w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>

            {/* Unit toggle */}
            <button
              onClick={toggleUnit}
              title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
              className="glass h-9 px-3 rounded-xl flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Thermometer className="w-4 h-4" />
              <span className="text-sm font-mono font-medium">
                °{unit === 'metric' ? 'C' : 'F'}
              </span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              title="Toggle dark/light mode"
              className="glass w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Menu (Favorites/History sidebar) */}
            <button
              onClick={onMenuClick}
              title="Open favorites and history"
              className="glass w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
