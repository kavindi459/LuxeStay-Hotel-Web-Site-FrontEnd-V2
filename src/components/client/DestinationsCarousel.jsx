import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal.js';
import api from '../../config/api.js';

const DEFAULT_DESTINATIONS = [
  {
    _id: '1',
    name: 'Maldives Paradise',
    location: 'Maldives, Indian Ocean',
    description: 'Crystal clear waters, pristine white sand beaches and overwater bungalows.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    _id: '2',
    name: 'Santorini Escape',
    location: 'Santorini, Greece',
    description: 'Iconic white-washed buildings, volcanic beaches and breathtaking Aegean sunsets.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  },
  {
    _id: '3',
    name: 'Bali Retreat',
    location: 'Bali, Indonesia',
    description: 'Tropical paradise with ancient temples, terraced rice fields and vibrant culture.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  },
  {
    _id: '4',
    name: 'Paris Romance',
    location: 'Paris, France',
    description: 'The city of love — iconic landmarks, world-class cuisine and timeless elegance.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  },
  {
    _id: '5',
    name: 'Dubai Luxury',
    location: 'Dubai, UAE',
    description: 'Ultramodern skyline, golden deserts and the pinnacle of luxury hospitality.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  },
];

const DestinationsCarousel = () => {
  const navigate                    = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [active,       setActive]       = useState(0);
  const [animating,    setAnimating]    = useState(false);
  const sectionRef                  = useScrollReveal(0.1);

  useEffect(() => {
    api.get('/api/destination/get?featured=true')
      .then((res) => {
        const data = res.data.data;
        setDestinations(Array.isArray(data) && data.length > 0 ? data : DEFAULT_DESTINATIONS);
      })
      .catch(() => setDestinations(DEFAULT_DESTINATIONS));
  }, []);

  const count = destinations.length;

  const goTo = useCallback(
    (idx) => {
      if (animating) return;
      setAnimating(true);
      setActive((idx + count) % count);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating, count]
  );

  /* Auto-play every 5s */
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => goTo(active + 1), 5000);
    return () => clearInterval(timer);
  }, [active, goTo, count]);

  if (count === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">
            Explore The World
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Dream Destinations
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-400 mt-4 text-sm max-w-xl mx-auto">
            Discover breathtaking locations around the world. Our concierge team can arrange
            your perfect getaway to any of these iconic destinations.
          </p>
        </div>

        {/* Carousel */}
        <div className="reveal relative">
          {/* Main card */}
          <div className="relative h-[480px] md:h-[540px] rounded-3xl overflow-hidden shadow-2xl">

            {destinations.map((dest, i) => (
              <div
                key={dest._id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}
              >
                {/* Background image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  style={{
                    transform: i === active ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 6s ease',
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
                  <div
                    className="max-w-lg"
                    style={{
                      transform: i === active ? 'translateY(0)' : 'translateY(20px)',
                      opacity: i === active ? 1 : 0,
                      transition: 'transform 0.7s ease 0.2s, opacity 0.7s ease 0.2s',
                    }}
                  >
                    {dest.location && (
                      <p className="flex items-center gap-1.5 text-amber-400 text-sm font-semibold mb-2">
                        <MapPin size={14} /> {dest.location}
                      </p>
                    )}
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                      {dest.name}
                    </h3>
                    {dest.description && (
                      <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                        {dest.description}
                      </p>
                    )}
                    <button
                      onClick={() => navigate('/rooms')}
                      className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-amber-500/30"
                    >
                      Book This Experience <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Prev / Next arrows */}
            <button
              onClick={() => goTo(active - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(active + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slide counter badge */}
            <div className="absolute top-5 right-5 z-20 bg-black/40 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
              {active + 1} / {count}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {destinations.map((dest, i) => (
              <button
                key={dest._id}
                onClick={() => goTo(i)}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                  i === active
                    ? 'w-20 h-14 ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-950'
                    : 'w-12 h-10 opacity-50 hover:opacity-80'
                }`}
              >
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {destinations.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-6 h-2 bg-amber-500'
                    : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsCarousel;
