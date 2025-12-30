'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// India flag component
const IndiaFlag = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" className="inline-block rounded-sm shadow-sm">
    <rect width="20" height="4.67" fill="#FF9933" />
    <rect y="4.67" width="20" height="4.66" fill="#FFFFFF" />
    <rect y="9.33" width="20" height="4.67" fill="#138808" />
    <circle cx="10" cy="7" r="1.5" fill="#000080" />
  </svg>
);

// Dhamma Wheel - using the exact official dhamma.org animated wheel
const DhammaWheel = () => (
  <div className="mx-4">
    <img 
      src="https://www.dhamma.org/assets/aniwheel-a87352d07ff79e922e5afbc8775f603b.gif" 
      alt="Dhamma Wheel"
      className="h-20 md:h-24 object-contain"
    />
  </div>
);

// Course types for Old Students from dhamma.org
const OLD_STUDENT_COURSE_TYPES = [
  // Short
  { id: '5', text: '1-Day', group: 'Short' },
  { id: '19', text: '2-Day', group: 'Short' },
  { id: '9', text: '3-Day', group: 'Short' },
  { id: '25', text: '4 hour Meditation', group: 'Short' },
  // Long
  { id: '66', text: '14 Day Gratitude Course', group: 'Long' },
  { id: '4', text: '20-Day', group: 'Long' },
  { id: '11', text: '30-Day', group: 'Long' },
  { id: '12', text: '45-Day', group: 'Long' },
  { id: '23', text: '60-Day', group: 'Long' },
  { id: '6', text: 'Special 10-Day', group: 'Long' },
  // Other
  { id: '3', text: '10-Day', group: 'Other' },
  { id: '28', text: '10-Day for Old Students', group: 'Other' },
  { id: '31', text: '9-Day', group: 'Other' },
  { id: '32', text: 'Group Sitting', group: 'Other' },
  { id: '24', text: 'Old Student Program', group: 'Other' },
  { id: '22', text: 'Old Student Self Course', group: 'Other' },
  { id: '15', text: 'Open House', group: 'Other' },
  { id: '10', text: 'Satipatthana Sutta', group: 'Other' },
  { id: '7', text: 'Service Period', group: 'Other' },
  { id: '33', text: 'Virtual Group Sitting', group: 'Other' },
  // Child/Teen (from dhamma.org official IDs)
  { id: '30', text: '7-day Vipassana course for teens', group: 'Child/Teen' },
  { id: '13', text: 'Children', group: 'Child/Teen' },
  { id: '14', text: 'Children / Teens', group: 'Child/Teen' },
  { id: '8', text: 'Teen', group: 'Child/Teen' },
  // Executive (from dhamma.org official ID)
  { id: '1', text: 'Executive Course', group: 'Executive' },
];

export default function Home() {
  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Filter states
  const [maxDistance, setMaxDistance] = useState(500);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState([]); // Empty = all types
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Data state
  const [centers, setCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCenters, setTotalCenters] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  // Date range (today to 1 month later by default)
  const today = new Date().toISOString().split('T')[0];
  const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(oneMonthLater);

  // Get current location using browser geolocation
  const getCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const name = data.display_name || 'Your Location';

          setUserLocation({ lat: latitude, lng: longitude });
          setLocationInput(name);
          setLocationError('');
        } catch {
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationInput(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError('Unable to get your location. Please enter manually.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Geocode user-entered address
  const geocodeAddress = useCallback(async () => {
    if (!locationInput.trim()) {
      setLocationError('Please enter a location');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput + ', India')}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setUserLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
        setLocationInput(data[0].display_name);
        setLocationError('');
      } else {
        setLocationError('Location not found. Please try a different address.');
      }
    } catch (err) {
      setLocationError('Error searching location. Please try again.');
    }
    setIsGettingLocation(false);
  }, [locationInput]);



  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    if (!userLocation) {
      setError('Please set your location first');
      return;
    }

    setIsLoading(true);
    setError('');

    const params = new URLSearchParams({
      current_state: 'OldStudents', // Always use OldStudents
      lat: String(userLocation.lat),
      lng: String(userLocation.lng),
      maxDistanceKm: String(maxDistance),
      daterange_start: startDate,
      daterange_end: endDate,
      page: '1',
      sort_column: 'dates',
      sort_direction: 'asc',
    });

    // Add course types if any selected
    if (selectedCourseTypes.length > 0) {
      params.set('course_types', selectedCourseTypes.join(','));
    }

    try {
      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();

      if (data.success) {
        setCenters(data.centers || []);
        setTotalCenters(data.totalCenters || 0);
        setTotalCourses(data.totalCourses || 0);
      } else {
        setError(data.error || 'Failed to fetch centers');
        setCenters([]);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setCenters([]);
    }
    setIsLoading(false);
  }, [userLocation, startDate, endDate, maxDistance, selectedCourseTypes]);

  // Toggle course type selection
  const toggleCourseType = (id) => {
    setSelectedCourseTypes((prev) =>
      prev.includes(id) ? prev.filter((ct) => ct !== id) : [...prev, id]
    );
  };

  // Process centers for display (already sorted by distance from API)
  const processedCenters = useMemo(() => {
    return centers;
  }, [centers]);

  // Count total courses across all centers
  const totalCoursesInCenters = useMemo(() => {
    return centers.reduce((sum, center) => sum + center.courses.length, 0);
  }, [centers]);

  // Get status badge styling
  const getStatusBadge = (availability, statusRaw) => {
    const statusText = statusRaw?.map(s => s?.status).filter(Boolean).join(', ') || availability;

    switch (availability) {
      case 'available':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: statusText || 'Open' };
      case 'waitlist':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: statusText || 'Wait List' };
      case 'full':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Course Full' };
      case 'in_progress':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', label: 'In Progress' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', label: statusText || 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - matching dhamma.org official style */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Main header row - exactly like dhamma.org */}
          <div className="flex items-center justify-center">
            {/* Left side - Vipassana */}
            <div className="text-right">
              <h1 className="text-3xl md:text-4xl font-serif text-[#1e4d8c] italic">Vipassana</h1>
              <p className="text-sm text-[#666] mt-1">as Taught by S.N. Goenka</p>
            </div>
            
            {/* Center - Dhamma Wheel */}
            <DhammaWheel />
            
            {/* Right side - Meditation */}
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-serif text-[#1e4d8c] italic">Meditation</h1>
              <p className="text-sm text-[#666] mt-1">in the Tradition of Sayagyi U Ba Khin</p>
            </div>
          </div>
          
          {/* App subtitle */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-[#1e4d8c] font-medium text-lg">Course Finder • India</p>
            <p className="text-gray-500 text-sm mt-1">Search Vipassana courses near your location</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Section Title */}
        <div className="bg-gradient-to-r from-[#fffbe6] to-[#fff9e0] rounded-t-lg border border-gray-200 border-b-0 px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <h2 className="text-2xl font-serif text-[#1e4d8c]">Find Courses Near You</h2>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-[#fffbe6] rounded-b-lg border border-gray-200 border-t-0 p-6 mb-6">
          {/* Location Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Location
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && geocodeAddress()}
                placeholder="Enter your city or address..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e4d8c] focus:border-[#1e4d8c] bg-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={geocodeAddress}
                  disabled={isGettingLocation}
                  className="px-6 py-2.5 bg-[#4a90c2] text-white rounded-lg hover:bg-[#3a7db0] disabled:opacity-50 font-medium whitespace-nowrap transition-colors"
                >
                  Set Location
                </button>
                <button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="px-6 py-2.5 bg-[#e8a83e] text-white rounded-lg hover:bg-[#d4962e] disabled:opacity-50 font-medium whitespace-nowrap transition-colors"
                >
                  {isGettingLocation ? '⏳' : '📍'} Use Current
                </button>
              </div>
            </div>
            {locationError && (
              <p className="mt-2 text-sm text-red-600">{locationError}</p>
            )}
          </div>

          {/* Search Radius - right below location */}
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Search Radius: <span className="font-bold text-[#1e4d8c] text-lg">{maxDistance} km</span>
              <span className="text-gray-500 font-normal ml-2">from your location</span>
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-[#1e4d8c] h-2 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100 km</span>
              <span>2000 km</span>
            </div>
          </div>

          {/* Main Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e4d8c] focus:border-[#1e4d8c] bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e4d8c] focus:border-[#1e4d8c] bg-white"
              />
            </div>

            {/* Filter Settings Button */}
            <div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#1e4d8c] hover:text-[#1e4d8c] transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-medium">
                  {selectedCourseTypes.length === 0 ? 'Select Course Type' : `${selectedCourseTypes.length} course type(s) selected`}
                </span>
                <span className="text-gray-400">▼</span>
              </button>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setShowFilterModal(false)}
                />
                
                {/* Modal */}
                <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[85vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Select Course Types</h3>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {/* Course Types List */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <p className="text-sm text-gray-600 mb-4">Select course types to filter (leave empty for all types)</p>
                    {['Short', 'Long', 'Other', 'Child/Teen', 'Executive'].map((group) => {
                      const groupCourses = OLD_STUDENT_COURSE_TYPES.filter((ct) => ct.group === group);
                      
                      return (
                        <div key={group} className="mb-4">
                          <div className="px-3 py-2 bg-[#fffbe6] text-xs font-bold text-gray-700 uppercase tracking-wide rounded-t">
                            {group}
                          </div>
                          <div className="border border-gray-200 rounded-b">
                            {groupCourses.map((ct) => (
                              <label
                                key={ct.id}
                                className="flex items-center px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 border-gray-100"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCourseTypes.includes(ct.id)}
                                  onChange={() => toggleCourseType(ct.id)}
                                  className="w-4 h-4 text-[#1e4d8c] border-gray-300 rounded focus:ring-[#1e4d8c]"
                                />
                                <span className="ml-3 text-sm text-gray-700">{ct.text}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t-2 border-gray-300 bg-[#fffbe6] flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedCourseTypes([])}
                      className="px-5 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-400 rounded hover:bg-white transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="px-8 py-2.5 bg-[#4a90c2] text-white rounded font-semibold hover:bg-[#3a7db0] transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Search Button Row */}
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={fetchCourses}
              disabled={isLoading || !userLocation}
              className="px-12 py-3 bg-[#4a90c2] text-white rounded-lg hover:bg-[#3a7db0] disabled:opacity-50 font-semibold text-lg transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span> Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>

          {!userLocation && !isLoading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-[#1e4d8c] text-center">
              Please set your location to search for courses near you
            </div>
          )}
        </div>

        {/* Results Count */}
        {userLocation && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{processedCenters.length}</span> center{processedCenters.length !== 1 ? 's' : ''} within {maxDistance} km
              {totalCoursesInCenters > 0 && (
                <span className="text-[#1e4d8c] ml-2">
                  ({totalCoursesInCenters} course{totalCoursesInCenters !== 1 ? 's' : ''} available)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#1e4d8c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching courses from dhamma.org...</p>
            <p className="text-sm text-gray-500 mt-2">Calculating distances to centers...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && userLocation && processedCenters.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No centers found</h3>
            <p className="text-gray-600">Try increasing the search radius to find more centers.</p>
          </div>
        )}

        {/* Center Cards with Courses */}
        {!isLoading && processedCenters.length > 0 && (
          <div className="space-y-6">
            {processedCenters.map((center) => {
              const centerWebsiteUrl = `https://${center.subdomain}.dhamma.org`;
              const centerScheduleUrl = `https://www.dhamma.org/en-US/schedules/sch${center.subdomain}`;
              
              return (
                <div
                  key={center.subdomain}
                  className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden"
                >
                  {/* Center Header */}
                  <div className="bg-gradient-to-r from-[#1e4d8c] to-[#2a6bb7] text-white p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{center.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white/90">📍 {center.city}, {center.state}, India</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {center.distance_km !== null && (
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="text-2xl font-bold">{Math.round(center.distance_km)}</span>
                            <span className="text-sm ml-1">km away</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <a href={centerScheduleUrl} target="_blank" rel="noopener noreferrer" 
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded text-sm transition-colors">
                            📅 Schedule
                          </a>
                          <a href={centerWebsiteUrl} target="_blank" rel="noopener noreferrer" 
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded text-sm transition-colors">
                            🏠 Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Courses List */}
                  <div className="p-5">
                    {center.courses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-4xl mb-2">📅</p>
                        <p className="font-medium">No courses available</p>
                        <p className="text-sm">in the selected date range</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {center.courses.map((course) => {
                          const status = getStatusBadge(course.availability, course.status_raw);
                          const loc = course.location || {};
                          
                          return (
                            <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#1e4d8c] transition-colors">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <a
                                      href={course.app_page_url || course.apply_url || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-block px-4 py-1.5 rounded font-semibold text-white text-sm transition-colors ${course.can_apply_flag
                                        ? 'bg-[#4a90c2] hover:bg-[#3a7db0]'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                      Apply{!course.can_apply_flag && '*'}
                                    </a>
                                    <span className="font-bold text-[#1e4d8c]">
                                      {course.localized_start_date} - {course.localized_end_date}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}>
                                      {status.label}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
                                    <span className="font-medium text-[#1e4d8c]">{course.course_type}</span>
                                    {course.course_instruction_languages?.length > 0 && (
                                      <>
                                        <span>•</span>
                                        <span>{course.course_instruction_languages.join(' / ')}</span>
                                      </>
                                    )}
                                  </div>
                                  {course.comments && (
                                    <p className="text-xs text-gray-500 italic mt-2"
                                      dangerouslySetInnerHTML={{
                                        __html: `<strong>Comments:</strong> ${course.comments.replace(/<a /g, '<a class="text-blue-600 hover:underline" target="_blank" ')}`
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>
            Data fetched in real-time from{' '}
            <a href="https://www.dhamma.org" target="_blank" rel="noopener noreferrer" className="text-[#1e4d8c] hover:underline">
              dhamma.org
            </a>
          </p>
          <p className="mt-1">Always verify availability on the official website before planning your course.</p>
        </footer>
      </div>
    </div>
  );
}
