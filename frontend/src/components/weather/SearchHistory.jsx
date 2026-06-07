/**
 * SearchHistory - Recent searches displayed inline
 */

import { Clock, X, Trash2 } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export default function SearchHistory() {
  const { history, fetchWeatherByCity, clearHistory } = useWeather();

  if (!history || history.length === 0) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4 ml-1">
        <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-widest">
          Recent Searches
        </h3>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map(item => (
          <button
            key={item.id}
            onClick={() => fetchWeatherByCity(item.city)}
            className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
          >
            <Clock className="w-3.5 h-3.5 text-white/30 group-hover:text-blue-400 transition-colors" />
            <span className="font-body">{item.city}</span>
            {item.country && <span className="text-white/30 text-xs">{item.country}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
