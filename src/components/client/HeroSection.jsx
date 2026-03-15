import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarDays, Users } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/rooms?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block bg-amber-600/20 border border-amber-500/40 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
          Welcome to LuxeStay Hotel
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Experience Luxury{' '}
          <span className="text-amber-400">Like Never Before</span>
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our world-class rooms and suites designed for the ultimate in comfort and elegance.
        </p>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col items-start gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <CalendarDays size={12} /> Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col items-start gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <CalendarDays size={12} /> Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col items-start gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Users size={12} /> Guests
              </label>
              <input
                type="number"
                value={guests}
                min={1}
                max={20}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm h-[42px]"
            >
              <Search size={16} /> Search Rooms
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
