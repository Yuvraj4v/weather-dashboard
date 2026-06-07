/**
 * WelcomeScreen - Shown when no city has been searched yet
 */

import { MapPin, Search, Wind, Thermometer, Droplets } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const QUICK_CITIES = ['London', 'Tokyo', 'New York', 'Dubai', 'Paris', 'Sydney', 'Mumbai', 'Toronto'];

export default function WelcomeScreen() {
  const { fetchWeatherByCity, detectLocation } = useWeather();

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center animate-fade-in">
      {/* Decorative icon cluster */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="w-32 h-32 glass rounded-full flex items-center justify-center text-6xl animate-float">
          🌤️
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 glass rounded-full flex items-center justify-center text-2xl animate-float" style={{ animationDelay: '2s' }}>🌧️</div>
        <div className="absolute -bottom-2 -left-2 w-10 h-10 glass rounded-full flex items-center justify-center text-2xl animate-float" style={{ animationDelay: '4s' }}>❄️</div>
      </div>

      {/* Headline */}
      <h2 className="font-display font-bold text-white text-3xl sm:text-5xl mb-3 leading-tight">
        Your World's Weather,<br />
        <span className="gradient-text">Beautifully Displayed</span>
      </h2>
      <p className="text-white/40 text-base sm:text-lg max-w-md mb-10 font-body">
        Search any city to get real-time weather, 5-day forecasts, air quality, and more.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {[
          { icon: Thermometer, label: 'Real-time temp', color: 'text-orange-400' },
          { icon: Wind, label: 'Wind & pressure', color: 'text-cyan-400' },
          { icon: Droplets, label: 'Humidity & AQI', color: 'text-blue-400' },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="glass flex items-center gap-2 px-4 py-2 rounded-full">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-white/60 text-sm font-body">{label}</span>
          </div>
        ))}
      </div>

      {/* Detect location CTA */}
      <button
        onClick={detectLocation}
        className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-display font-semibold rounded-2xl transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95 mb-8"
      >
        <MapPin className="w-4 h-4" />
        Use My Location
      </button>

      {/* Quick cities */}
      <div>
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-4">Or try a city</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {QUICK_CITIES.map(city => (
            <button
              key={city}
              onClick={() => fetchWeatherByCity(city)}
              className="glass px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 font-body"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
