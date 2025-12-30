# 🧘 Vipassana Course Finder

Find Vipassana meditation courses near you with real-time data from dhamma.org.

## 🎯 Problem It Solves

Finding available Vipassana courses near your location requires checking multiple center websites individually. This app:
- **Shows all centers** within your radius (even if no courses scheduled)
- **Real-time course data** directly from dhamma.org
- **Accurate distances** calculated from your location
- **All courses in one view** - no need to visit multiple websites

## ✨ Features

### Location-Based Search
- Enter any address or use your current GPS location
- Set search radius (100-2000 km)
- See all Indian centers within your radius

### Real-Time Course Data
- Fetches live courses from dhamma.org API
- Shows availability status (Open / Wait List / Full)
- Direct links to application forms on dhamma.org

### Smart Filtering
- Filter by course type (10-Day, 20-Day, Satipatthana, etc.)
- Choose date range to focus on specific periods
- Max 100 courses per query (dhamma.org limit)

### Center-Based Display
- Each center shown with all its courses
- "No courses available" for centers without scheduled courses
- Distance, website, and schedule links for each center

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ How It Works

1. **User sets location** → Browser geolocation or manual address input
2. **Geocodes location** → Nominatim converts address to lat/lng
3. **Fetches Indian centers** → Extracts all centers from dhamma.org's location data
4. **Calculates distances** → Haversine formula using dhamma.org's position data
5. **Fetches courses** → Queries dhamma.org API for India (region_118)
6. **Filters by distance** → Only shows centers within user's radius
7. **Displays results** → Centers sorted by distance with their courses

## 🗂️ Project Structure

```
vipassana-finder/
├── app/
│   ├── api/courses/route.js    # Fetches courses & centers from dhamma.org
│   ├── globals.css             # Dhamma.org-inspired styling
│   ├── layout.js               # Root layout
│   └── page.js                 # Main app component
├── package.json
└── README.md
```

## 🌐 Data Sources

- **Courses**: `POST dhamma.org/en-US/courses/do_search`
- **Center Coordinates**: `dhamma.org/en-US/maps` (position_data)
- **Indian Centers**: Extracted from dhamma.org's search_regions data
- **User Location**: Browser Geolocation API + Nominatim reverse geocoding

## 🎨 Design

- Matches dhamma.org's official style
- Rotating Dhamma Wheel logo
- Clean, responsive layout
- Status badges for course availability

## 📝 Notes

- India-focused (filters to region_118)
- Max 100 courses per query (dhamma.org limitation)
- Distances are great-circle (air distance, not road distance)
- All data fetched in real-time (no local database)

---

Built with ❤️ for the Vipassana community 🙏
