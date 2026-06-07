/**
 * Weather utility functions
 */

// Get weather condition category for background styling
export const getWeatherCategory = (weatherData) => {
  if (!weatherData) return 'default';
  const id = weatherData.weather?.[0]?.id;
  const icon = weatherData.weather?.[0]?.icon || '';
  const isNight = icon.endsWith('n');

  if (!id) return 'default';
  if (id >= 200 && id < 300) return 'stormy';
  if (id >= 300 && id < 600) return 'rainy';
  if (id >= 600 && id < 700) return 'snowy';
  if (id >= 700 && id < 800) return 'foggy';
  if (id === 800) return isNight ? 'clear-night' : 'sunny';
  if (id > 800) return 'cloudy';
  return 'default';
};

// Get gradient classes based on weather
export const getWeatherGradient = (category) => {
  const gradients = {
    sunny: 'from-amber-950 via-orange-950 to-sky-950',
    'clear-night': 'from-slate-950 via-indigo-950 to-slate-950',
    rainy: 'from-slate-950 via-blue-950 to-slate-900',
    stormy: 'from-gray-950 via-slate-900 to-purple-950',
    snowy: 'from-slate-900 via-blue-950 to-indigo-950',
    cloudy: 'from-slate-950 via-slate-900 to-blue-950',
    foggy: 'from-gray-950 via-gray-900 to-slate-900',
    default: 'from-slate-950 via-slate-900 to-indigo-950',
  };
  return gradients[category] || gradients.default;
};

// Get accent color based on weather
export const getWeatherAccent = (category) => {
  const accents = {
    sunny: '#f59e0b',
    'clear-night': '#818cf8',
    rainy: '#60a5fa',
    stormy: '#a78bfa',
    snowy: '#bae6fd',
    cloudy: '#94a3b8',
    foggy: '#9ca3af',
    default: '#60a5fa',
  };
  return accents[category] || accents.default;
};

// Get emoji icon for weather
export const getWeatherEmoji = (category) => {
  const emojis = {
    sunny: '☀️',
    'clear-night': '🌙',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
    cloudy: '☁️',
    foggy: '🌫️',
    default: '🌤️',
  };
  return emojis[category] || emojis.default;
};

// AQI level info
export const getAQIInfo = (aqi) => {
  const levels = [
    { label: 'Good', color: '#22c55e', bg: 'bg-green-500/20', text: 'Air quality is satisfactory' },
    { label: 'Fair', color: '#84cc16', bg: 'bg-lime-500/20', text: 'Acceptable air quality' },
    { label: 'Moderate', color: '#eab308', bg: 'bg-yellow-500/20', text: 'Sensitive groups may be affected' },
    { label: 'Poor', color: '#f97316', bg: 'bg-orange-500/20', text: 'Everyone may feel effects' },
    { label: 'Very Poor', color: '#ef4444', bg: 'bg-red-500/20', text: 'Health alert for everyone' },
  ];
  return levels[(aqi || 1) - 1] || levels[0];
};

// Format temperature
export const formatTemp = (temp, unit) => {
  if (temp === undefined || temp === null) return '--';
  return `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;
};

// Format time from Unix timestamp
export const formatTime = (unix, timezone = 0) => {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22); // HH:MM
};

// Format date
export const formatDate = (unix, timezone = 0) => {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(0, 11); // Day, DD Mon
};

// Get day name from Unix timestamp
export const getDayName = (unix) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(unix * 1000).getDay()];
};

// Wind direction from degrees
export const getWindDirection = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

// Beaufort wind scale description
export const getWindDescription = (speed, unit) => {
  const ms = unit === 'imperial' ? speed * 0.44704 : speed;
  if (ms < 0.5) return 'Calm';
  if (ms < 3.3) return 'Light breeze';
  if (ms < 7.9) return 'Gentle breeze';
  if (ms < 13.8) return 'Moderate breeze';
  if (ms < 24.4) return 'Strong breeze';
  return 'Near gale';
};

// Visibility in readable format
export const formatVisibility = (meters) => {
  if (!meters) return '--';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
};

// Group forecast by day
export const groupForecastByDay = (list) => {
  const groups = {};
  list?.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return Object.values(groups).slice(0, 5);
};

// OpenWeatherMap icon URL
export const getIconUrl = (icon, size = '@2x') => {
  return `https://openweathermap.org/img/wn/${icon}${size}.png`;
};
