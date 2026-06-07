/**
 * SearchBar - City search with suggestions
 */

import { Search, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useWeather } from '../../context/WeatherContext';

export default function SearchBar() {
  const { fetchWeatherByCity, error, setError } = useWeather();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [showSug, setShowSug] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSugLoading(true);
      try {
        const { data } = await axios.get(`/api/weather/geocode?q=${encodeURIComponent(query)}`);
        setSuggestions(data.slice(0, 5));
        setShowSug(true);
      } catch { setSuggestions([]); }
      finally { setSugLoading(false); }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSearch = (cityName) => {
    if (!cityName.trim()) return;
    fetchWeatherByCity(cityName);
    setQuery(cityName);
    setShowSug(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch(query);
    if (e.key === 'Escape') { setShowSug(false); inputRef.current?.blur(); }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSug(false);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Input */}
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            {sugLoading
              ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              : <Search className="w-5 h-5 text-white/40" />
            }
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setError(null); }}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSug(true)}
            placeholder="Search city, state or country..."
            className="w-full glass rounded-2xl py-4 pl-12 pr-32 text-white placeholder-white/30 font-body text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all duration-200"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {query && (
              <button
                onClick={handleClear}
                className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => handleSearch(query)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-display font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm font-body animate-fade-in">
            {error}
          </div>
        )}

        {/* Autocomplete dropdown */}
        {showSug && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50 border border-white/10 animate-scale-in">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSearch(s.name)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-none"
              >
                <Search className="w-4 h-4 text-white/30 shrink-0" />
                <div>
                  <span className="text-white font-body text-sm">{s.name}</span>
                  {(s.state || s.country) && (
                    <span className="text-white/40 text-xs ml-1.5">{[s.state, s.country].filter(Boolean).join(', ')}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
