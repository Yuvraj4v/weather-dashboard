/**
 * AirQuality - AQI display card
 */

import { Wind, Activity } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { getAQIInfo } from '../../utils/weatherUtils';
import SkeletonCard from '../ui/SkeletonCard';

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', safe: 12 },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', safe: 54 },
  { key: 'o3', label: 'O₃', unit: 'μg/m³', safe: 100 },
  { key: 'no2', label: 'NO₂', unit: 'μg/m³', safe: 53 },
  { key: 'co', label: 'CO', unit: 'μg/m³', safe: 4400 },
  { key: 'so2', label: 'SO₂', unit: 'μg/m³', safe: 75 },
];

export default function AirQuality() {
  const { aqi, loading } = useWeather();

  if (loading) return <SkeletonCard tall />;

  if (!aqi || !aqi.list?.[0]) {
    return (
      <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center min-h-48 text-center">
        <Activity className="w-10 h-10 text-white/20 mb-3" />
                 <p className="text-white/40 text-sm font-body">AQI data unavailable</p>
        <p className="text-white/25 text-xs mt-1">Search a city to view air quality</p>
      </div>
    );
  }

  const { aqi: level, components } = aqi.list[0];
  const info = getAQIInfo(level);

  return (
    <div className="glass rounded-3xl p-6 hover-lift animate-fade-in h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Wind className="w-4 h-4 text-white/50" />
        <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-widest">
          Air Quality
        </h3>
      </div>

      {/* AQI Level indicator */}
      <div className={`${info.bg} rounded-2xl p-4 mb-5`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-bold text-white text-2xl">AQI {level}</span>
          <span className="font-display font-semibold text-sm px-3 py-1 rounded-full bg-white/10" style={{ color: info.color }}>
            {info.label}
          </span>
        </div>
        <p className="text-white/50 text-xs">{info.text}</p>

        {/* AQI visual bar */}
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${(level / 5) * 100}%`,
              backgroundColor: info.color,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/25 text-xs font-mono">Good</span>
          <span className="text-white/25 text-xs font-mono">Very Poor</span>
        </div>
      </div>

      {/* Pollutant details */}
      <div className="grid grid-cols-2 gap-2">
        {POLLUTANTS.map(({ key, label, unit, safe }) => {
          const val = components?.[key];
          if (val === undefined) return null;
          const pct = Math.min((val / safe) * 100, 100);
          const isHigh = val > safe;

          return (
            <div key={key} className="bg-white/5 rounded-xl p-2.5">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-white/40 text-xs font-mono">{label}</span>
                <span className={`text-xs font-mono font-medium ${isHigh ? 'text-orange-400' : 'text-white/70'}`}>
                  {val.toFixed(1)}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isHigh ? '#f97316' : '#22c55e',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
