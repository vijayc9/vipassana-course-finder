// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format date range
export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = start.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
  const endStr = end.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  return `${startStr} - ${endStr}`;
}

// Estimate travel time by road (rough estimate)
export function estimateTravelTime(distanceKm) {
  // Assuming average speed of 50 km/h including breaks
  const hours = distanceKm / 50;
  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  }
  const wholeHours = Math.floor(hours);
  const mins = Math.round((hours - wholeHours) * 60);
  if (mins === 0) {
    return `${wholeHours} hr`;
  }
  return `${wholeHours} hr ${mins} min`;
}

// Check if a date falls within a range
export function isDateInRange(courseStart, courseEnd, filterStart, filterEnd) {
  const cStart = new Date(courseStart);
  const cEnd = new Date(courseEnd);
  const fStart = new Date(filterStart);
  const fEnd = new Date(filterEnd);
  
  // Course should start within the filter range
  return cStart >= fStart && cStart <= fEnd;
}

// Get status badge color
export function getStatusColor(status) {
  switch (status) {
    case 'available':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'waitlist':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    case 'full':
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  }
}

// Get status icon
export function getStatusIcon(status) {
  switch (status) {
    case 'available':
      return '🟢';
    case 'waitlist':
      return '🟡';
    case 'full':
      return '🔴';
    default:
      return '⚪';
  }
}

// Get Google Maps directions URL
export function getDirectionsUrl(centerLat, centerLng, userLat, userLng) {
  return `https://www.google.com/maps/dir/${userLat},${userLng}/${centerLat},${centerLng}`;
}


