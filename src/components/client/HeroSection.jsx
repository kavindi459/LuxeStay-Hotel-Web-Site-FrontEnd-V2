import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarDays, Users, ChevronDown } from 'lucide-react';

const DEFAULT_HERO = '';

const HeroSection = ({ bgImage }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn]   = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests]     = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn)  params.set('checkIn',  checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests)   params.set('guests',   guests);
    navigate(`/rooms?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Ken-Burns background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns"
        style={{
          backgroundImage: `url('${bgImage }')`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Floating decorative orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        {/* Welcome badge */}
        <div className="animate-fade-in inline-block bg-amber-600/20 border border-amber-500/40 text-amber-400 text-sm px-5 py-2 rounded-full mb-6 font-medium tracking-wide">
          ✦ Welcome to CINNAMON LAKE Hotel ✦
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-200 text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Experience Luxury{' '}
          <span className="shimmer-text">Like Never Before</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up delay-400 text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our world-class rooms and suites designed for the ultimate in
          comfort and elegance.
        </p>

        {/* Search Bar */}
        <div className="animate-fade-up delay-600 bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-5 md:p-6">
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-shadow"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-shadow"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-shadow"
              />
            </div>

            <button
              onClick={handleSearch}
              className="btn-gradient flex items-center justify-center gap-2 text-white font-bold py-2.5 px-6 rounded-lg text-sm h-[42px]"
            >
              <Search size={16} /> Search Rooms
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up delay-800 flex flex-wrap justify-center gap-8 mt-10">
          {[
            { value: '500+', label: 'Happy Guests' },
            { value: '50+',  label: 'Luxury Rooms' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-amber-400">{value}</p>
              <p className="text-gray-300 text-xs uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-8 left-1/2 animate-bounce-arrow text-white/60 flex flex-col items-center gap-1">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
};

export default HeroSection;
