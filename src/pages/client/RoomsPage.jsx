import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../../components/client/RoomCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import api from '../../config/api.js';
import { SlidersHorizontal, X } from 'lucide-react';

const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [heroImage, setHeroImage] = useState(null);

  const [filters, setFilters] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
    category: '',
    maxPrice: '',
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get('/api/bgimage/settings').then((res) => {
      const sections = res.data.data || {};
      if (sections.rooms) setHeroImage(sections.rooms);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/api/category/get?limit=100').then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (f = filters) => {
    setLoading(true);
    setError(null);
    try {
      if (f.checkIn && f.checkOut) {
        // Fetch ALL rooms + available rooms in parallel, then merge
        const availParams = new URLSearchParams({ checkIn: f.checkIn, checkOut: f.checkOut });
        if (f.guests) availParams.set('guests', f.guests);
        if (f.category) availParams.set('category', f.category);

        const [allRes, availRes] = await Promise.all([
          api.get('/api/room/get'),
          api.get(`/api/room/available?${availParams.toString()}`),
        ]);

        const availableIds = new Set((availRes.data.data || []).map((r) => r._id));
        let data = (allRes.data.data || [])
          .filter((r) => r.availability === true) // skip admin-disabled rooms
          .map((r) => ({ ...r, unavailableForDates: !availableIds.has(r._id) }));

        if (f.maxPrice) data = data.filter((r) => (r.category?.price || 0) <= Number(f.maxPrice));
        if (f.category) data = data.filter((r) => r.category?._id === f.category || r.category === f.category);

        // Sort: available first, then unavailable
        data.sort((a, b) => (a.unavailableForDates ? 1 : 0) - (b.unavailableForDates ? 1 : 0));
        setRooms(data);
      } else {
        // No dates — show only available rooms
        const res = await api.get('/api/room/get');
        let data = (res.data.data || []).filter((r) => r.availability === true);
        if (f.maxPrice) data = data.filter((r) => (r.category?.price || 0) <= Number(f.maxPrice));
        if (f.category) data = data.filter((r) => r.category?._id === f.category || r.category === f.category);
        setRooms(data);
      }
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    fetchRooms(filters);
    setFiltersOpen(false);
  };

  const handleResetFilters = () => {
    const reset = { checkIn: '', checkOut: '', guests: '', category: '', maxPrice: '' };
    setFilters(reset);
    fetchRooms(reset);
  };

  return (
    <div className="bg-gray-50">

      {/* Hero Banner */}
      <div className="relative py-28 text-white text-center overflow-hidden bg-gray-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroImage }')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Featured Accommodations
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Rooms</h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto leading-relaxed">
            Choose Your Experience — discover our curated collection of room types designed for comfort and elegance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Filter Bar */}
        <div className="bg-white relative rounded-xl shadow-lg border border-gray-100 p-5 mb-8 -mt-20 z-50">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold text-gray-600 uppercase">Check-In</label>
              <input type="date" name="checkIn" value={filters.checkIn} min={today} onChange={handleFilterChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold text-gray-600 uppercase">Check-Out</label>
              <input type="date" name="checkOut" value={filters.checkOut} min={filters.checkIn || today} onChange={handleFilterChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
            <div className="flex flex-col gap-1 min-w-[100px]">
              <label className="text-xs font-semibold text-gray-600 uppercase">Guests</label>
              <input type="number" name="guests" value={filters.guests} min={1} placeholder="1" onChange={handleFilterChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold text-gray-600 uppercase">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <label className="text-xs font-semibold text-gray-600 uppercase">Max Price/Night</label>
              <input type="number" name="maxPrice" value={filters.maxPrice} placeholder="Any" min={0} onChange={handleFilterChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
            <div className="flex gap-2 items-end">
              <button onClick={handleApplyFilters}
                className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                Search
              </button>
              <button onClick={handleResetFilters}
                className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rooms Found</h3>
            <p className="text-gray-500">Try adjusting your filters to find available rooms.</p>
            <button onClick={handleResetFilters} className="mt-4 text-blue-800 hover:underline font-medium text-sm">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
              {filters.checkIn && filters.checkOut && (() => {
                const avail = rooms.filter(r => !r.unavailableForDates).length;
                const unavail = rooms.filter(r => r.unavailableForDates).length;
                return unavail > 0
                  ? <span> — <span className="text-green-600 font-medium">{avail} available</span>, <span className="text-red-500 font-medium">{unavail} unavailable</span> for selected dates</span>
                  : null;
              })()}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} unavailableForDates={room.unavailableForDates} searchDates={{ checkIn: filters.checkIn, checkOut: filters.checkOut }} />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default RoomsPage;
