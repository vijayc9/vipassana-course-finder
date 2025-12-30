// API route for geocoding center locations on the server side
// This avoids CORS issues and allows caching

const geocodeCache = new Map();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return Response.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  const cacheKey = query.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return Response.json({ 
      success: true, 
      ...geocodeCache.get(cacheKey),
      cached: true 
    });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`,
      {
        headers: {
          'User-Agent': 'VipassanaCourseFinder/1.0 (Educational Project)',
        },
        // Add delay to respect Nominatim's rate limit
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      };
      
      geocodeCache.set(cacheKey, result);
      
      return Response.json({
        success: true,
        ...result,
        cached: false,
      });
    } else {
      return Response.json({
        success: false,
        error: 'Location not found',
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Geocoding failed',
    }, { status: 500 });
  }
}

