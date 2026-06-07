/**
 * HourlyForecast - Horizontal scrolling hourly forecast
 */

import { useWeather } from '../../context/WeatherContext';
import { getIconUrl, formatTemp } from '../../utils/weatherUtils';
import SkeletonCard from '../ui/SkeletonCard';

export default function HourlyForecast() {
  const { forecast, loading, unit } = useWeather();

  if (loading) return <SkeletonCard wide />;
  if (!forecast) return null;

  // Take next 24 hours (8 entries at 3h intervals)
  const hourly = forecast.list.slice(0, 8);

  const getHour = (dt) => {
    const d = new Date(dt * 1000);
    const h = d.getHours();
    return h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
  };

  const temps = hourly.map(h => h.main.temp);
  const maxT = Math.max(...temps);
  const minT = Math.min(...temps);
  const range = maxT - minT || 1;

  return (
    <div className="animate-fade-in">
      <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-widest mb-4 ml-1">
        24-Hour Forecast
      </h3>
      <div className="glass rounded-3xl p-4 sm:p-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {hourly.map((item, i) => {
            const barHeight = ((item.main.temp - minT) / range) * 40 + 20;
            const isNow = i === 0;
            return (
              <div
                key={item.dt}
                className={`flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-2xl transition-all duration-200 ${
                  isNow ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-white/5'
                }`}
              >
                <p className={`text-xs font-mono font-medium ${isNow ? 'text-blue-300' : 'text-white/40'}`}>
                  {isNow ? 'Now' : getHour(item.dt)}
                </p>
                <img
                  src={getIconUrl(item.weather[0].icon, '')}
                  alt={item.weather[0].description}
                  className="w-10 h-10 object-contain"
                />
                {/* Temp bar */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-1 rounded-full bg-gradient-to-b from-orange-400 to-blue-400 opacity-60"
                    style={{ height: `${barHeight}px` }}
                  />
                </div>
                <p className={`text-sm font-display font-bold ${isNow ? 'text-white' : 'text-white/80'}`}>
                  {formatTemp(item.main.temp, unit)}
                </p>
                {item.pop > 0.1 && (
                  <p className="text-xs text-blue-400 font-mono">
                    {Math.round(item.pop * 100)}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
