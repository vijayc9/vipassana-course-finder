export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const current_state = searchParams.get('current_state') || 'NewStudents';
  const userLat = searchParams.get('lat');
  const userLng = searchParams.get('lng');
  const maxDistanceKm = Number(searchParams.get('maxDistanceKm') || searchParams.get('maxDistance') || '');
  const daterange_start = searchParams.get('daterange_start');
  const daterange_end = searchParams.get('daterange_end');
  const page = searchParams.get('page') || '1';

  // Don't send gender/attendee filters by default to get ALL courses
  const genders = searchParams.get('genders') ? searchParams.get('genders').split(',').map((s) => s.trim()).filter(Boolean) : [];
  const attendee_types = searchParams.get('attendee_types') ? searchParams.get('attendee_types').split(',').map((s) => s.trim()).filter(Boolean) : [];
  const course_types = (searchParams.get('course_types') || '').split(',').map((s) => s.trim()).filter(Boolean);

  const daterange = buildDateRange(daterange_start, daterange_end);

  try {
    const positionData = await getPositionData();
    const indiaLocations = await getIndiaLocations();

    // Step 1: Get ALL Indian centers with coordinates and calculate distances
    const allCenters = indiaLocations.map((loc) => {
      const sub = (loc.subdomain || '').toLowerCase();
      const pos = positionData[sub];
      const center_coords = pos ? { lat: Number(pos.latitude), lng: Number(pos.longitude) } : null;

      let distance_km = null;
      if (center_coords && userLat && userLng) {
        distance_km = haversineKm(
          Number(userLat),
          Number(userLng),
          center_coords.lat,
          center_coords.lng
        );
      }

      // Extract center name and location from text (e.g., "Dhamma Paphulla, Bengaluru, Karnataka, India")
      const parts = (loc.text || '').split(',').map(s => s.trim());
      const name = parts[0] || 'Unknown Center';
      const city = parts[1] || '';
      const state = parts[2] || '';

      return {
        subdomain: loc.subdomain,
        locationId: loc.locationId,
        name,
        city,
        state,
        center_coords,
        distance_km,
        courses: [] // Will be populated later
      };
    });

    // Step 2: Filter centers by radius
    const centersWithinRadius = allCenters.filter((center) => {
      if (userLat && userLng && Number.isFinite(maxDistanceKm) && maxDistanceKm > 0) {
        if (center.distance_km === null) return false;
        return center.distance_km <= maxDistanceKm;
      }
      return true; // No distance filter
    });

    console.log(`[DEBUG] Found ${centersWithinRadius.length} centers within ${maxDistanceKm} km (out of ${allCenters.length} total Indian centers)`);

    // Step 3: Fetch courses for the date range (no chunking - let user control via filters)
    const regionsParam = 'region_118';
    let allCourses = [];
    
    if (daterange_start && daterange_end) {
      console.log(`[DEBUG] Fetching courses from ${daterange_start} to ${daterange_end}`);
      
      // Fetch up to 10 pages (100 courses max from dhamma.org)
      for (let p = 1; p <= 10; p++) {
        const data = await doSearch({
          current_state,
          regions: regionsParam,
          daterange,
          attendee_types,
          genders,
          course_types,
          page: p,
        });
        
        if (!data.courses || data.courses.length === 0) break;
        console.log(`[DEBUG] Page ${p}/${data.pages}: ${data.courses.length} courses (total_rows: ${data.total_rows})`);
        allCourses = allCourses.concat(data.courses);
        if (p >= data.pages) break;
      }
      
      console.log(`[DEBUG] Fetched ${allCourses.length} total courses`);
    }

    // Step 4: Filter courses to India only
    const indiaCourses = allCourses.filter((course) => {
      const country = (course.location?.country || '').toLowerCase();
      return country === 'india' || country === 'in';
    });

    // Step 5: Match courses to centers
    centersWithinRadius.forEach((center) => {
      center.courses = indiaCourses.filter((course) => {
        const courseSub = (course.location?.sub_domain || '').toLowerCase();
        return courseSub === center.subdomain.toLowerCase();
      });
    });

    // Sort centers by distance
    centersWithinRadius.sort((a, b) => {
      if (a.distance_km === null) return 1;
      if (b.distance_km === null) return -1;
      return a.distance_km - b.distance_km;
    });

    console.log(`[DEBUG] Returning ${centersWithinRadius.length} centers with courses`);

    return Response.json({
      success: true,
      centers: centersWithinRadius,
      totalCenters: centersWithinRadius.length,
      totalCourses: indiaCourses.length,
      limitReached: allCourses.length >= 100,
      fetchedAt: new Date().toISOString(),
      source: 'dhamma.org',
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return Response.json({
      success: false,
      error: error.message,
      centers: [],
    }, { status: 500 });
  }
}

function buildDateRange(start, end) {
  const now = new Date();
  const defaultStart = toYmd(now);
  const later = new Date(now);
  later.setFullYear(later.getFullYear() + 1);
  const defaultEnd = toYmd(later);
  return `${start || defaultStart} - ${end || defaultEnd}`;
}

function toYmd(d) {
  return d.toISOString().slice(0, 10);
}

function splitDateRange(start, end, daysPerChunk) {
  const chunks = [];
  let current = new Date(start);
  const endDate = new Date(end);
  
  while (current < endDate) {
    const chunkEnd = new Date(current);
    chunkEnd.setDate(chunkEnd.getDate() + daysPerChunk - 1); // -1 because start day counts
    
    if (chunkEnd >= endDate) {
      chunks.push({ start: toYmd(current), end: toYmd(endDate) });
      break;
    } else {
      chunks.push({ start: toYmd(current), end: toYmd(chunkEnd) });
    }
    
    // Next chunk starts the day after this chunk ends (contiguous)
    current = new Date(chunkEnd);
    current.setDate(current.getDate() + 1);
  }
  
  return chunks;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function absolutize(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://www.dhamma.org${url.startsWith('/') ? '' : '/'}${url}`;
}

function normalizeStatus(course) {
  const statuses = Array.isArray(course.status) ? course.status : [];
  const joined = statuses.map((s) => s?.status).filter(Boolean).join(' ').toLowerCase();
  if (joined.includes('wait')) return 'waitlist';
  if (joined.includes('open')) return 'available';
  if (joined.includes('closed') || joined.includes('full')) return 'full';
  if (joined.includes('in progress')) return 'in_progress';
  return 'unknown';
}

async function doSearch(params) {
  const url = 'https://www.dhamma.org/en-US/courses/do_search';

  const body = new URLSearchParams();
  body.set('current_state', params.current_state);
  // Send regions as array format (regions[])
  body.append('regions[]', params.regions);
  body.set('daterange', params.daterange);
  body.set('course_type_constraint', '');
  body.set('page', String(params.page || 1));
  body.set('sort_column', 'dates');
  body.set('sort_direction', 'asc');
  body.set('date_format', 'MMM DD YYYY');

  for (const g of params.genders || []) body.append('genders[]', g);
  for (const a of params.attendee_types || []) body.append('attendee_types[]', a);
  for (const ct of params.course_types || []) body.append('course_types[]', ct);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`dhamma.org failed: ${res.status}`);
  }

  const json = await res.json();

  const normalizedCourses = (json.courses || []).map((c) => {
    const location = c.location || {};
    return {
      id: String(c.id),
      course_start_date: c.course_start_date,
      course_end_date: c.course_end_date,
      localized_start_date: c.localized_start_date,
      localized_end_date: c.localized_end_date,
      course_type: c.course_type,
      course_instruction_languages: c.course_instruction_languages,
      comments: c.comments,
      status_raw: c.status,
      availability: normalizeStatus(c),
      can_apply_flag: Boolean(c.can_apply_flag),
      apply_url: absolutize(c.trans_apply_link_url || c.apply_link_url),
      app_page_url: absolutize(c.app_page_url),
      location: {
        id: location.id,
        sub_domain: location.sub_domain,
        dhamma_name: location.dhamma_name,
        city: location.city,
        state: location.state,
        country: location.country,
        city_province_country: location.city_province_country,
        header_image_path: absolutize(location.header_image_path),
        schedule_url: absolutize(location.schedule_url),
        website_url: location.website_url ? absolutize(location.website_url) : null,
        map_url: absolutize(location.map_url),
      },
    };
  });

  return {
    courses: normalizedCourses,
    page: json.page,
    pages: json.pages,
    total_rows: json.total_rows,
  };
}

let _posCache = null;
let _posCacheAt = 0;

async function getPositionData() {
  // Cache for 12 hours (dhamma center coords rarely change)
  const TTL_MS = 12 * 60 * 60 * 1000;
  const now = Date.now();
  if (_posCache && now - _posCacheAt < TTL_MS) return _posCache;

  const html = await fetch('https://www.dhamma.org/en-US/maps', { cache: 'no-store' }).then((r) => r.text());
  const marker = 'position_data =';
  const idx = html.indexOf(marker);
  if (idx === -1) throw new Error('Could not find position_data on dhamma.org maps page');

  // Extract JSON object literal up to the first semicolon
  const start = html.indexOf('{', idx);
  const end = html.indexOf('};', start);
  if (start === -1 || end === -1) throw new Error('Could not parse position_data JSON on dhamma.org maps page');

  const raw = html.slice(start, end + 1);
  // The embedded structure is JS object literals, not strict JSON (unquoted keys).
  // Convert to JSON by quoting keys.
  const jsonish = raw.replace(/([\{,])\s*(\w+)\s*:/g, '$1"$2":');
  const parsed = JSON.parse(jsonish);

  _posCache = parsed;
  _posCacheAt = now;
  return parsed;
}

let _indiaLocCache = null;
let _indiaLocCacheAt = 0;

async function getIndiaLocations() {
  // Cache for 12 hours
  const TTL_MS = 12 * 60 * 60 * 1000;
  const now = Date.now();
  if (_indiaLocCache && now - _indiaLocCacheAt < TTL_MS) return _indiaLocCache;

  const html = await fetch('https://www.dhamma.org/en-US/courses/search?current_state=NewStudents&regions=region_118', {
    cache: 'no-store',
  }).then((r) => r.text());

  const marker = 'viewModel.search_regions(';
  const idx = html.indexOf(marker);
  if (idx === -1) throw new Error('Could not find search_regions in dhamma.org course search page');

  const arrStart = html.indexOf('[', idx);
  if (arrStart === -1) throw new Error('Could not find search_regions array start');

  // Extract the JS array literal by bracket matching (robust against newlines)
  let i = arrStart;
  let depth = 0;
  let inString = false;
  let strChar = '';
  let escape = false;

  for (; i < html.length; i++) {
    const ch = html[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === '\\\\') {
        escape = true;
      } else if (ch === strChar) {
        inString = false;
        strChar = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      strChar = ch;
      continue;
    }
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        i++; // include closing bracket
        break;
      }
    }
  }

  const jsArray = html.slice(arrStart, i);
  if (!jsArray.startsWith('[') || !jsArray.endsWith(']')) {
    throw new Error('Failed to extract search_regions array');
  }

  // The embedded structure is JS object literals, not strict JSON (unquoted keys).
  // Convert minimal subset to JSON by quoting keys.
  const jsonish = jsArray.replace(/([\{,])\s*(\w+)\s*:/g, '$1"$2":');
  const parsed = JSON.parse(jsonish);

  const locationsGroup = parsed.find((g) => g && g.text === 'locations');
  if (!locationsGroup || !Array.isArray(locationsGroup.children)) {
    throw new Error('search_regions did not include locations group');
  }

  const indiaLocations = locationsGroup.children
    .filter((c) => c && typeof c.text === 'string' && c.text.includes('India'))
    .map((c) => {
      const locationId = Array.isArray(c.id) && c.id[0] === 'location' ? c.id[1] : null;
      const subdomain = Array.isArray(c.texts) ? c.texts[4] : null; // known from dhamma dropdown data
      return { locationId, subdomain, text: c.text };
    })
    .filter((x) => Number.isFinite(Number(x.locationId)) && x.subdomain);

  _indiaLocCache = indiaLocations;
  _indiaLocCacheAt = now;
  return indiaLocations;
}
