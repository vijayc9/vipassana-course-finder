// Geocoding and distance calculation utilities

const geocodeCache = new Map();

/**
 * Geocode a location string to coordinates using Nominatim
 * Cached to avoid repeated API calls
 */
export async function geocodeLocation(locationString) {
  if (!locationString) return null;
  
  const cacheKey = locationString.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&q=${encodeURIComponent(locationString)}&countrycodes=in&limit=1`,
      { headers: { 'User-Agent': 'VipassanaCourseFinder/1.0' } }
    );
    
    if (!response.ok) {
      console.error('Geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  return null;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Indian state to dhamma.org region mapping
 */
const stateToRegion = {
  // North India - region_107
  'Delhi': 'region_107',
  'Haryana': 'region_107',
  'Punjab': 'region_107',
  'Himachal Pradesh': 'region_107',
  'Jammu and Kashmir': 'region_107',
  'Uttarakhand': 'region_107',
  'Uttar Pradesh': 'region_107',
  'Rajasthan': 'region_107',
  
  // South India - region_108
  'Karnataka': 'region_108',
  'Tamil Nadu': 'region_108',
  'Kerala': 'region_108',
  'Andhra Pradesh': 'region_108',
  'Telangana': 'region_108',
  'Puducherry': 'region_108',
  
  // West India - region_109
  'Maharashtra': 'region_109',
  'Gujarat': 'region_109',
  'Goa': 'region_109',
  'Madhya Pradesh': 'region_109',
  'Chhattisgarh': 'region_109',
  
  // East India - region_110
  'West Bengal': 'region_110',
  'Bihar': 'region_110',
  'Jharkhand': 'region_110',
  'Odisha': 'region_110',
  'Assam': 'region_110',
  'Sikkim': 'region_110',
  'Arunachal Pradesh': 'region_110',
  'Nagaland': 'region_110',
  'Manipur': 'region_110',
  'Mizoram': 'region_110',
  'Tripura': 'region_110',
  'Meghalaya': 'region_110',
};

/**
 * Determine which dhamma.org regions to search based on user location and radius
 */
export function determineSearchRegions(userLat, userLng, radiusKm) {
  if (!userLat || !userLng) {
    // Default to all India regions
    return ['region_107', 'region_108', 'region_109', 'region_110'];
  }

  // Approximate state centers for quick region determination
  const stateCenters = {
    'Delhi': { lat: 28.6139, lng: 77.2090, region: 'region_107' },
    'Karnataka': { lat: 15.3173, lng: 75.7139, region: 'region_108' },
    'Maharashtra': { lat: 19.7515, lng: 75.7139, region: 'region_109' },
    'West Bengal': { lat: 22.9868, lng: 87.8550, region: 'region_110' },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569, region: 'region_108' },
    'Gujarat': { lat: 22.2587, lng: 71.1924, region: 'region_109' },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, region: 'region_107' },
    'Rajasthan': { lat: 27.0238, lng: 74.2179, region: 'region_107' },
    'Bihar': { lat: 25.0961, lng: 85.3131, region: 'region_110' },
    'Madhya Pradesh': { lat: 22.9734, lng: 78.6569, region: 'region_109' },
    'Andhra Pradesh': { lat: 15.9129, lng: 79.7400, region: 'region_108' },
    'Telangana': { lat: 18.1124, lng: 79.0193, region: 'region_108' },
    'Kerala': { lat: 10.8505, lng: 76.2711, region: 'region_108' },
    'Odisha': { lat: 20.9517, lng: 85.0985, region: 'region_110' },
    'Haryana': { lat: 29.0588, lng: 76.0856, region: 'region_107' },
    'Punjab': { lat: 31.1471, lng: 75.3412, region: 'region_107' },
  };

  const regionsInRange = new Set();
  
  // Check which state centers are within (radius + buffer) of user location
  const buffer = 200; // km buffer to account for state size
  for (const [state, coords] of Object.entries(stateCenters)) {
    const dist = calculateDistance(userLat, userLng, coords.lat, coords.lng);
    if (dist !== null && dist <= radiusKm + buffer) {
      regionsInRange.add(coords.region);
    }
  }

  // If no regions found (shouldn't happen), return all
  if (regionsInRange.size === 0) {
    return ['region_107', 'region_108', 'region_109', 'region_110'];
  }

  return Array.from(regionsInRange);
}

