/**
 * WeatherDetails - Grid of detailed weather metrics
 */

import { Droplets, Wind, Eye, Gauge, Thermometer, Compass, Activity, Cloud } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { formatVisibility, getWindDirection, getWindDescription } from '../../utils/weatherUtils';
import SkeletonCard from '../ui/SkeletonCard';

export default function WeatherDetails() {
  const { weather, loading, unit } = useWeather();

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} small />)}
      </div>
    );
  }

  if (!weather) return null;

  const details = [
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${Math.round(weather.main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}`,
      sub: weather.main.feels_like < weather.main.temp ? 'Colder than actual' : 'Warmer than actual',
      color: 'text-orange-400',
      bg: 'from-orange-500/10 to-transparent',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      sub: weather.main.humidity > 70 ? 'High — feels muggy' : weather.main.humidity < 30 ? 'Low — feels dry' : 'Comfortable',
      color: 'text-blue-400',
      bg: 'from-blue-500/10 to-transparent',
      bar: weather.main.humidity,
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      sub: weather.main.pressure > 1013 ? 'High pressure' : 'Low pressure',
      color: 'text-purple-400',
      bg: 'from-purple-500/10 to-transparent',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(weather.visibility),
      sub: weather.visibility >= 10000 ? 'Excellent' : weather.visibility >= 5000 ? 'Good' : 'Reduced',
      color: 'text-cyan-400',
      bg: 'from-cyan-500/10 to-transparent',
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${Math.round(weather.wind.speed)} ${unit === 'metric' ? 'm/s' : 'mph'}`,
      sub: getWindDescription(weather.wind.speed, unit),
      color: 'text-teal-400',
      bg: 'from-teal-500/10 to-transparent',
    },
    {
      icon: Compass,
      label: 'Wind Direction',
      value: getWindDirection(weather.wind.deg),
      sub: `${weather.wind.deg}° bearing`,
      color: 'text-indigo-400',
      bg: 'from-indigo-500/10 to-transparent',
    },
    {
      icon: Cloud,
      label: 'Cloud Cover',
      value: `${weather.clouds?.all || 0}%`,
      sub: weather.clouds?.all > 70 ? 'Overcast' : weather.clouds?.all > 30 ? 'Partly cloudy' : 'Mostly clear',
      color: 'text-slate-400',
      bg: 'from-slate-500/10 to-transparent',
      bar: weather.clouds?.all,
    },
    {
      icon: Activity,
      label: 'Ground Level',
      value: `${weather.main.grnd_level || weather.main.pressure} hPa`,
      sub: 'Ground pressure',
      color: 'text-green-400',
      bg: 'from-green-500/10 to-transparent',
    },
  ];

  return (
    <div className="animate-fade-in">
      <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-widest mb-4 ml-1">
        Weather Details
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {details.map(({ icon: Icon, label, value, sub, color, bg, bar }, i) => (
          <div
            key={label}
            className={`glass rounded-2xl p-4 hover-lift bg-gradient-to-br ${bg} animate-slide-up`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="text-white/40 text-xs font-mono uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-white font-display font-bold text-xl mb-1">{value}</p>
            <p className="text-white/35 text-xs">{sub}</p>

            {/* Progress bar for percentage values */}
            {bar !== undefined && (
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${color === 'text-blue-400' ? 'from-blue-500 to-blue-400' : 'from-slate-500 to-slate-400'} transition-all duration-1000`}
                  style={{ width: `${Math.min(bar, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
