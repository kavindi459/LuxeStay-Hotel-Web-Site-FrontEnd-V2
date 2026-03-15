import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/client/Navbar.jsx';
import Footer from '../../components/client/Footer.jsx';
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

  const [filters, setFilters] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
    category: '',
    maxPrice: '',
  });

  const today = new Date().toISOString().split('T')[0];

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
      let url = '/api/room/get';
      const params = new URLSearchParams();
      if (f.checkIn && f.checkOut) {
        url = '/api/room/available';
        params.set('checkIn', f.checkIn);
        params.set('checkOut', f.checkOut);
        if (f.guests) params.set('guests', f.guests);
        if (f.category) params.set('category', f.category);
      }
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      const res = await api.get(fullUrl);
      let data = res.data.data || [];
      if (f.maxPrice) {
        data = data.filter((r) => (r.category?.price || 0) <= Number(f.maxPrice));
      }
      if (f.category && url === '/api/room/get') {
        data = data.filter((r) => r.category?._id === f.category || r.category === f.category);
      }
      setRooms(data);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-white text-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Discover</p>
          <h1 className="text-4xl md:text-5xl font-bold">Our Rooms & Suites</h1>
          <p className="text-blue-200 mt-3 max-w-xl mx-auto">
            Find the perfect room for your stay, from cozy standards to luxurious suites.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
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
            <p className="text-gray-500 text-sm mb-6">{rooms.length} room{rooms.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RoomsPage;
