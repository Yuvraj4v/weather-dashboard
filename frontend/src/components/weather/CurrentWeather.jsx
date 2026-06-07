/**
 * CurrentWeather - Hero card showing current conditions
 */

import { Heart, MapPin, Droplets, Wind, Eye, ArrowUp, ArrowDown, Sunrise, Sunset } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { formatTemp, formatTime, getIconUrl, getWindDirection } from '../../utils/weatherUtils';
import SkeletonCard from '../ui/SkeletonCard';

export default function CurrentWeather() {
  const { weather, loading, unit, toggleFavorite, isFavorite } = useWeather();

  if (loading) return <SkeletonCard tall />;
  if (!weather) return null;

  const fav = isFavorite(weather.name);
  const icon = weather.weather?.[0]?.icon;
  const desc = weather.weather?.[0]?.description;
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset = formatTime(weather.sys.sunset, weather.timezone);

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 neon-border hover-lift animate-fade-in">
      <div className="flex flex-col h-full">

        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-blue-400" />
              <h2 className="font-display font-bold text-white text-xl sm:text-2xl">
                {weather.name}
                <span className="text-white/50 font-normal text-base ml-2">{weather.sys?.country}</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm font-body capitalize ml-6">{desc}</p>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(weather)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              fav
                ? 'bg-red-500/25 text-red-400 hover:bg-red-500/35'
                : 'bg-white/10 text-white/40 hover:text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${fav ? 'fill-red-400' : ''}`} />
          </button>
        </div>

        {/* Main temp + icon */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-display font-bold text-white leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 7rem)' }}>
              {Math.round(weather.main.temp)}°
              <span className="text-3xl text-white/50">{unit === 'metric' ? 'C' : 'F'}</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-white/50 text-sm flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5 text-orange-400" />
                {formatTemp(weather.main.temp_max, unit)}
              </span>
              <span className="text-white/50 text-sm flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
                {formatTemp(weather.main.temp_min, unit)}
              </span>
              <span className="text-white/40 text-sm">
                Feels {formatTemp(weather.main.feels_like, unit)}
              </span>
            </div>
          </div>

          {/* Weather icon */}
          {icon && (
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 relative">
                <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-2xl" />
                <img
                  src={getIconUrl(icon)}
                  alt={desc}
                  className="w-full h-full object-contain drop-shadow-2xl animate-float"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-auto pt-4 border-t border-white/10">
          <StatBadge icon={Droplets} label="Humidity" value={`${weather.main.humidity}%`} color="text-blue-400" />
          <StatBadge
            icon={Wind}
            label="Wind"
            value={`${Math.round(weather.wind.speed)} ${unit === 'metric' ? 'm/s' : 'mph'} ${getWindDirection(weather.wind.deg)}`}
            color="text-cyan-400"
          />
          <StatBadge icon={Sunrise} label="Sunrise" value={sunrise} color="text-amber-400" />
          <StatBadge icon={Sunset} label="Sunset" value={sunset} color="text-orange-400" />
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 rounded-2xl p-3 text-center">
      <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
      <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-white text-sm font-display font-semibold">{value}</p>
    </div>
  );
}
