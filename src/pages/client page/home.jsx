import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/client/HeroSection.jsx';
import FeaturesSection from '../../components/client/FeaturesSection.jsx';
import RoomCard from '../../components/client/RoomCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import api from '../../config/api.js';
import { ArrowRight, Sparkles } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal.js';
import DestinationsCarousel from '../../components/client/DestinationsCarousel.jsx';
import ReviewsCarousel from '../../components/client/ReviewsCarousel.jsx';

/* Default fallback bg images */
const DEFAULTS = {
  homeHero:       'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800',
  homeRooms:      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
  homeCategories: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
  homeCta:        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
};

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [rooms,      setRooms]      = useState([]);
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [bgSettings, setBgSettings] = useState(DEFAULTS);

  const bg = (key) => bgSettings[key] || DEFAULTS[key];

  /* Scroll-reveal refs */
  const roomsRef      = useScrollReveal(0.08);
  const categoriesRef = useScrollReveal(0.08);
  const ctaRef        = useScrollReveal(0.2);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, roomsRes, reviewsRes, bgRes] = await Promise.all([
          api.get('/api/category/get?featured=true&limit=100'),
          api.get('/api/room/get'),
          api.get('/api/review/featured?limit=6'),
          api.get('/api/bgimage/settings'),
        ]);
        setCategories(catsRes.data.data || []);
        setRooms(     (roomsRes.data.data  || []).slice(0, 3));
        setReviews(    reviewsRes.data.data || []);
        if (bgRes.data.data) setBgSettings((prev) => ({ ...prev, ...bgRes.data.data }));
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero */}
      <HeroSection bgImage={bg('homeHero')} />

      {/* Features */}
      <FeaturesSection />

      {/* ── Featured Rooms ── */}
      <section
        ref={roomsRef}
        className="py-24 relative bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url('${bg('homeRooms')}')` }}
      >
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14 reveal">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Sparkles size={14} /> Our Rooms
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Accommodations</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No rooms available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, i) => (
                <div key={room._id} className={`reveal stagger-${i + 1}`}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 reveal">
            <button
              onClick={() => navigate('/rooms')}
              className="btn-gradient inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg"
            >
              View All Rooms <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Categories Carousel ── */}
      {categories.length > 0 && (
        <section
          ref={categoriesRef}
          className="py-24 relative bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url('${bg('homeCategories')}')` }}
        >
          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 reveal">
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">Room Types</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Choose Your Experience</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
            </div>

            {/* Infinite CSS carousel — overflow hidden clips the track */}
            <div className="overflow-hidden">
              <div className="carousel-track gap-6">
                {[...categories, ...categories].map((cat, idx) => (
                  <div
                    key={`${cat._id}-${idx}`}
                    onClick={() => navigate(`/rooms?category=${cat._id}`)}
                    className="flex-none w-72 mx-3 card-hover bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="img-zoom w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold opacity-20">{cat.name[0]}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                        <p className="text-amber-400 font-bold text-lg">
                          ${cat.price}
                          <span className="text-gray-300 text-sm font-normal">/night</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-500 text-sm line-clamp-2">{cat.description}</p>
                      {cat.features?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {cat.features.slice(0, 3).map((f) => (
                            <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Guest Reviews 3D Carousel ── */}
      <ReviewsCarousel reviews={reviews} />

      {/* ── CTA Banner ── */}
      <section
        ref={ctaRef}
        className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url('${bg('homeCta')}')` }}
      >
        {/* Warm dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Amber glow blobs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <div className="reveal">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Exclusive Offer
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to Experience{' '}
              <span className="shimmer-text">Luxury?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Book your stay today and enjoy exclusive benefits, personalized service, and
              unforgettable memories.
            </p>
            <button
              onClick={() => navigate('/rooms')}
              className="btn-amber-glow pulse-gold bg-amber-600 hover:bg-amber-500 text-white font-bold px-12 py-4 rounded-xl text-lg shadow-xl"
            >
              Book Your Stay
            </button>
          </div>
        </div>
      </section>

      {/* ── Destinations Carousel ── */}
      <DestinationsCarousel />
    </>
  );
};

export default Home;
