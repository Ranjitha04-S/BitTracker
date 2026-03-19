# ₿ BitTrack — Bitcoin Utility Dashboard

**BitTrack** is a user-centric Bitcoin utility application that provides essential tools to support Bitcoin users in managing their assets and transactions efficiently.

🔗 **Live Demo:** [bittracker-dashboard.netlify.app](https://bittracker-dashboard.netlify.app)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat&logo=netlify)

---

![BitTrack Preview](https://github.com/user-attachments/assets/99ceb572-18bb-457a-b3ae-f87259c6a2d4)

---

## ✨ Features

- 📊 **Live Dashboard** — Real-time BTC price, market cap, 24h volume, highs & lows with 30-second auto-refresh
- 📈 **Price Tracker** — Historical price charts with timeframe selector + custom price alert triggers (above/below) saved to localStorage
- 🧮 **Tax Calculator** — Capital gains estimator supporting 6 countries — US, UK, Germany, Australia, Canada & India
- 📍 **ATM Finder** — Locate nearest Bitcoin ATMs with interactive Leaflet map + list view, distance-sorted using Haversine formula
- 🌙 **Dark Mode** — System-aware dark/light theme with localStorage persistence

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Charts | Chart.js + react-chartjs-2 |
| Maps | Leaflet + react-leaflet |
| Icons | Lucide React |

### APIs Integrated

| API | Purpose |
|---|---|
| [CoinGecko](https://www.coingecko.com/en/api) | Live Bitcoin price + historical chart data |
| [CoinMap](https://coinmap.org/api/) | Bitcoin ATM location data |

> API responses are cached for 60 seconds to respect rate limits. Fallback mock data is used automatically when the API is unreachable.

---

## 📁 Project Structure

```
BitTracker/
├── public/
│   └── _redirects              # Netlify SPA routing fix
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Top nav with dark mode toggle
│   │   ├── Sidebar.tsx         # Side nav with live BTC price card
│   │   ├── Footer.tsx
│   │   ├── PriceChart.tsx      # Chart.js line chart
│   │   └── StatCard.tsx        # Reusable metric card
│   ├── pages/
│   │   ├── Dashboard.tsx       # Market overview + quick access
│   │   ├── PriceTracker.tsx    # Price chart + alert system
│   │   ├── TaxCalculator.tsx   # Tax estimation by country
│   │   └── AtmFinder.tsx       # Map + list ATM locator
│   ├── services/
│   │   ├── cryptoService.ts    # CoinGecko API + caching layer
│   │   └── atmService.ts       # ATM data fetching
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/Ranjitha04-S/BitTrack---Bitcoins-dashboard.git
cd BitTrack---Bitcoins-dashboard
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🧮 Tax Calculator — Supported Regions

| Country | Short Term | Long Term |
|---|---|---|
| 🇺🇸 United States | 37% | 20% |
| 🇬🇧 United Kingdom | 20% | 20% |
| 🇩🇪 Germany | 25% | 0% |
| 🇦🇺 Australia | 45% | 22.5% |
| 🇨🇦 Canada | 50% | 25% |
| 🇮🇳 India | 30% | 30% |


---

> ⚠️ **Disclaimer:** Tax estimations are for informational purposes only. Always consult a certified financial advisor for accurate tax advice.
