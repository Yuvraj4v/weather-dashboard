/**
 * DailyForecast - 5-day weather forecast
 */

import { useWeather } from '../../context/WeatherContext';
import { groupForecastByDay, formatTemp, getIconUrl, getDayName } from '../../utils/weatherUtils';
import SkeletonCard from '../ui/SkeletonCard';
import { Droplets, ArrowUp, ArrowDown } from 'lucide-react';

export default function DailyForecast() {
  const { forecast, loading, unit } = useWeather();

  if (loading) return <SkeletonCard />;
  if (!forecast) return null;

  const days = groupForecastByDay(forecast.list);

  // For each day, pick the noon entry or the middle one
  const dailySummary = days.map(dayItems => {
    const noon = dayItems.find(i => {
      const h = new Date(i.dt * 1000).getHours();
      return h >= 11 && h <= 14;
    }) || dayItems[Math.floor(dayItems.length / 2)];

    const temps = dayItems.map(i => i.main.temp);
    const maxPop = Math.max(...dayItems.map(i => i.pop || 0));

    return {
      ...noon,
      tempMax: Math.max(...temps),
      tempMin: Math.min(...temps),
      pop: maxPop,
    };
  });

  return (
    <div className="animate-fade-in">
      <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-widest mb-4 ml-1">
        5-Day Forecast
      </h3>
      <div className="glass rounded-3xl overflow-hidden">
        {dailySummary.map((day, i) => {
          const isToday = i === 0;
          const dayName = isToday ? 'Today' : getDayName(day.dt);
          const date = new Date(day.dt * 1000);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div
              key={day.dt}
              className={`flex items-center gap-4 px-5 sm:px-6 py-4 transition-colors hover:bg-white/5 ${
                i !== dailySummary.length - 1 ? 'border-b border-white/5' : ''
              } ${isToday ? 'bg-white/5' : ''}`}
            >
              {/* Day name */}
              <div className="w-16 sm:w-20">
                <p className={`font-display font-semibold text-sm ${isToday ? 'text-blue-300' : 'text-white'}`}>
                  {dayName}
                </p>
                <p className="text-white/35 text-xs font-mono">{dateStr}</p>
              </div>

              {/* Icon + description */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <img
                  src={getIconUrl(day.weather[0].icon, '')}
                  alt={day.weather[0].description}
                  className="w-10 h-10 object-contain shrink-0"
                />
                <span className="text-white/50 text-sm capitalize truncate hidden sm:block">
                  {day.weather[0].description}
                </span>
              </div>

              {/* Precip chance */}
              {day.pop > 0.05 && (
                <div className="flex items-center gap-1 text-blue-400 w-12 justify-center">
                  <Droplets className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono">{Math.round(day.pop * 100)}%</span>
                </div>
              )}

              {/* Temp bar */}
              <div className="flex items-center gap-2 w-32 sm:w-40">
                <span className="text-blue-400 text-sm font-mono w-10 text-right">
                  {Math.round(day.tempMin)}°
                </span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400"
                    style={{ width: '100%' }}
                  />
                </div>
                <span className="text-orange-400 text-sm font-mono w-10">
                  {Math.round(day.tempMax)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
