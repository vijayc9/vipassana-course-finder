# 🧘 Vipassana Course Finder

Find Vipassana meditation courses near you in India with real-time data from dhamma.org.

## 🎯 Why This App?

**The Problem:**  
You want to attend a Vipassana course near Bangalore (or any city). You have to:
- Visit 10+ individual center websites to check their schedules
- Manually calculate which centers are closest to you
- Keep checking back for new course openings
- Miss courses at nearby centers you didn't know existed

**The Solution:**  
This app shows **all Vipassana centers within your chosen radius** with their available courses in one place. Set your location, pick a radius, and instantly see what's available near you - sorted by distance.

## ✨ Features

- 🗺️ **Location-based search** - Use your current location or enter any address
- 📍 **Distance filtering** - See only centers within 100-2000 km radius
- 📅 **Real-time courses** - Live data directly from dhamma.org API
- 🎯 **All centers shown** - Even centers with no scheduled courses (so you know they exist)
- 🔗 **Direct apply links** - One click to dhamma.org application forms
- 🏷️ **Course type filters** - Filter by 10-Day, 20-Day, Satipatthana, etc.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🏗️ How It Works

1. Enter your location → App geocodes to lat/lng
2. Fetches all 139 Indian Vipassana centers from dhamma.org
3. Calculates distance to each center
4. Shows centers within your radius
5. Fetches courses for your date range
6. Displays centers with their available courses

## 📊 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Data Source**: dhamma.org API (real-time)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Distance**: Haversine formula

## 📝 Notes

- India-focused (currently supports 139 Indian centers)
- Max 100 courses per query (dhamma.org API limit)
- Distances are air distance, not road distance
- All data fetched real-time (no database)

---

Built for the Vipassana community 🙏
