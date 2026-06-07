/**
 * Sidebar - Favorites & History drawer
 */

import { X, Heart, Clock, MapPin, Trash2, Star } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useState } from 'react';

export default function Sidebar({ isOpen, onClose }) {
  const { history, favorites, fetchWeatherByCity, clearHistory, toggleFavorite, isFavorite } = useWeather();
  const [tab, setTab] = useState('favorites');

  const handleCityClick = (city) => {
    fetchWeatherByCity(city);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-80 z-40 glass border-l border-white/10 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="font-display font-bold text-white text-lg">My Weather</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-4 gap-2">
            {[
              { key: 'favorites', label: 'Favorites', icon: Heart },
              { key: 'history', label: 'Recent', icon: Clock },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-display font-medium transition-all duration-200 ${
                  tab === key
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tab === 'favorites' && (
              <>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No favorites yet</p>
                    <p className="text-white/25 text-xs mt-1">Search a city and tap ★ to save it</p>
                  </div>
                ) : (
                  favorites.map(fav => (
                    <div
                      key={fav.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex-1" onClick={() => handleCityClick(fav.city)}>
                        <p className="text-white font-display font-medium text-sm">{fav.city}</p>
                        <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {fav.country || 'Unknown'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFavorite({ name: fav.city, sys: { country: fav.country }, coord: { lat: fav.lat, lon: fav.lon } })}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </>
            )}

            {tab === 'history' && (
              <>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No recent searches</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white/40 text-xs uppercase tracking-wider font-mono">Recent</p>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear all
                      </button>
                    </div>
                    {history.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleCityClick(item.city)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left"
                      >
                        <Clock className="w-4 h-4 text-white/30 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-display font-medium text-sm truncate">{item.city}</p>
                          <p className="text-white/35 text-xs">{item.country}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
