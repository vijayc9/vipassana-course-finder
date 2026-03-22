# Vipassana Course Finder

Find Vipassana courses near you in India with real-time data from dhamma.org.

**Live app:** [vipassana-course-finder.vercel.app](https://vipassana-course-finder.vercel.app/)
<!--
![Vipassana Course Finder — course search UI](img/Screenshot%202026-03-22%20at%208.07.28%E2%80%AFAM.png)
-->

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

## 🏗️ How It Works

1. **User sets location** → Browser geolocation or manual address input (geocoded via Nominatim)
2. **Fetches Indian centers + coordinates** → From dhamma.org (`/en-US/maps` position data + search location data)
3. **Calculates distances** → Haversine formula
4. **Fetches courses** → `POST /en-US/courses/do_search` (India: `region_118`)
5. **Filters + displays** → Centers within radius, sorted by distance, with their courses


## 📝 Notes

- India-focused
- Max 100 courses per query (dhamma.org API limit)
- Distances are air distance, not road distance
- All data fetched real-time (no database)

---

Built for the Vipassana community 🙏
