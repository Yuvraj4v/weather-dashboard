# 🌤️ Nimbus — Weather Dashboard

A **production-ready, full-stack Weather Dashboard** built with React (Vite) + Tailwind CSS on the frontend and Node.js + Express + MongoDB on the backend. Features a premium glassmorphism UI, real-time weather data, AQI, 5-day forecasts, and more.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)

---

## ✨ Features

### 🌡️ Weather
- Real-time current weather conditions
- 5-day daily forecast
- 24-hour hourly forecast
- Temperature (°C / °F toggle)
- Feels like, humidity, pressure, visibility
- Wind speed & direction
- Sunrise & sunset times
- Dynamic weather backgrounds

### 🌍 Geolocation
- Auto-detect user location with one click
- City search with autocomplete suggestions

### 💨 Air Quality
- AQI index with visual indicators
- PM2.5, PM10, O₃, NO₂, CO, SO₂ levels

### ❤️ User Experience
- Favorite cities system
- Search history (local + MongoDB)
- Dark/light mode toggle
- Glassmorphism UI design
- Smooth animations & transitions
- Skeleton loading states
- Responsive (mobile + desktop)

---

## 📁 Project Structure

```
weather-dashboard/
├── backend/
│   ├── controllers/
│   │   ├── weatherController.js    # OpenWeatherMap API calls
│   │   ├── historyController.js    # Search history CRUD
│   │   └── favoritesController.js  # Favorites CRUD
│   ├── models/
│   │   ├── SearchHistory.js        # MongoDB schema
│   │   └── FavoriteCity.js         # MongoDB schema
│   ├── routes/
│   │   ├── weather.js
│   │   ├── history.js
│   │   └── favorites.js
│   ├── server.js                   # Express app entry point
│   ├── .env                        # Your environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── weather/
    │   │   │   ├── SearchBar.jsx
    │   │   │   ├── CurrentWeather.jsx
    │   │   │   ├── WeatherDetails.jsx
    │   │   │   ├── HourlyForecast.jsx
    │   │   │   ├── DailyForecast.jsx
    │   │   │   ├── AirQuality.jsx
    │   │   │   ├── SearchHistory.jsx
    │   │   │   └── WelcomeScreen.jsx
    │   │   └── ui/
    │   │       └── SkeletonCard.jsx
    │   ├── context/
    │   │   └── WeatherContext.jsx   # Global state
    │   ├── utils/
    │   │   └── weatherUtils.js      # Helper functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- MongoDB 7+ ([download](https://mongodb.com/try/download/community)) — optional (app works without it)
- OpenWeatherMap API key ([get free key](https://openweathermap.org/api))

---

### Step 1 — Clone the project

```bash
git clone <your-repo-url>
cd weather-dashboard
```

### Step 2 — Backend setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
nano .env   # or open in your editor
```

**Edit `.env`:**
```env
OPENWEATHER_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/weather_dashboard
PORT=5000
NODE_ENV=development
```

### Step 3 — Frontend setup

```bash
cd ../frontend
npm install
```

### Step 4 — Get your OpenWeatherMap API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Create a free account
3. Go to **API Keys** tab → copy your default key
4. Paste it in `backend/.env` as `OPENWEATHER_API_KEY`

> ⚠️ New API keys take **10 minutes to 2 hours** to activate. If you get 401 errors, wait and retry.

### Step 5 — Setup MongoDB (optional)

**Option A: Local MongoDB**
```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (free cloud)**
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string → paste in `.env` as `MONGODB_URI`

> 📝 The app works without MongoDB — favorites and history fall back to localStorage.

---

## ▶️ Running the App

### Terminal 1 — Start Backend
```bash
cd backend
npm run dev       # with hot-reload (nodemon)
# OR
npm start         # production mode
```
Backend runs at: `http://localhost:5000`

### Terminal 2 — Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

Open your browser at **http://localhost:5173** 🎉

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/current?city=London` | Current weather |
| GET | `/api/weather/current?lat=51.5&lon=-0.1` | Weather by coords |
| GET | `/api/weather/forecast?city=London` | 5-day forecast |
| GET | `/api/weather/aqi?lat=51.5&lon=-0.1` | Air quality |
| GET | `/api/weather/geocode?q=Lon` | City autocomplete |
| GET | `/api/history` | Search history |
| POST | `/api/history` | Add search |
| DELETE | `/api/history` | Clear all |
| GET | `/api/favorites` | Get favorites |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:id` | Remove favorite |

---

## 🚢 Deployment

### Deploy Backend to Railway / Render

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

**Render:**
1. Connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in dashboard

### Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel
vercel

# Update vite.config.js proxy to point to your deployed backend URL
```

Or connect GitHub to Vercel dashboard for automatic deploys.

### Update Frontend API URL for Production

In `frontend/vite.config.js`, the proxy works for local dev. For production, set:
```js
// frontend/src/context/WeatherContext.jsx
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

And in your Vercel project settings, add:
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🎨 Customization

### Add more cities to the welcome screen
In `WelcomeScreen.jsx`, edit the `QUICK_CITIES` array.

### Change color theme
The weather-based gradients are in `weatherUtils.js` → `getWeatherGradient()`.

### Add more weather detail cards
In `WeatherDetails.jsx`, add objects to the `details` array.

---

## 🏆 What Makes This Stand Out

- **Premium glassmorphism UI** with animated gradient backgrounds
- **Dynamic theming** — background changes based on weather condition
- **Autocomplete search** with debounced API calls
- **AQI visualization** with pollutant breakdown
- **Floating animated weather icons**
- **Skeleton loaders** for every data state
- **Offline-friendly** localStorage fallback for favorites/history
- **Rate limiting, CORS, Helmet** security on backend
- **Clean architecture** — context, utils, components separated

---

## 📄 License
MIT — free to use, modify, and distribute.

Built with ❤️ using React, Express, and OpenWeatherMap API.
