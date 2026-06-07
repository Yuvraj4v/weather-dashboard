/**
 * App.jsx - Root application component
 */

import { WeatherProvider, useWeather } from './context/WeatherContext';
import Navbar from './components/layout/Navbar';
import SearchBar from './components/weather/SearchBar';
import CurrentWeather from './components/weather/CurrentWeather';
import WeatherDetails from './components/weather/WeatherDetails';
import HourlyForecast from './components/weather/HourlyForecast';
import DailyForecast from './components/weather/DailyForecast';
import AirQuality from './components/weather/AirQuality';
import SearchHistory from './components/weather/SearchHistory';
import WelcomeScreen from './components/weather/WelcomeScreen';
import Sidebar from './components/layout/Sidebar';
import { getWeatherCategory, getWeatherGradient } from './utils/weatherUtils';
import { useEffect, useState } from 'react';

function Dashboard() {
  const { weather, loading, darkMode } = useWeather();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = getWeatherCategory(weather);
  const gradient = getWeatherGradient(category);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000 font-body`}>
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-blue-500 top-[-10%] right-[10%]" style={{ animationDelay: '0s' }} />
        <div className="orb w-80 h-80 bg-purple-600 bottom-[10%] left-[-5%]" style={{ animationDelay: '3s' }} />
        <div className="orb w-64 h-64 bg-cyan-500 top-[50%] right-[-5%]" style={{ animationDelay: '5s' }} />
      </div>

      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar (favorites + history) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Search */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Weather content or welcome screen */}
        {!weather && !loading ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* Top row: Current + AQI */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CurrentWeather />
              </div>
              <div className="xl:col-span-1">
                <AirQuality />
              </div>
            </div>

            {/* Weather Details Grid */}
            <WeatherDetails />

            {/* Hourly Forecast */}
            <HourlyForecast />

            {/* 5-Day Forecast */}
            <DailyForecast />

            {/* Search History */}
            <SearchHistory />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
}
