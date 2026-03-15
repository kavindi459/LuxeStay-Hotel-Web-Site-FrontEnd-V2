import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/client/Navbar.jsx';
import Footer from '../../components/client/Footer.jsx';
import HeroSection from '../../components/client/HeroSection.jsx';
import FeaturesSection from '../../components/client/FeaturesSection.jsx';
import TestimonialsSection from '../../components/client/TestimonialsSection.jsx';
import RoomCard from '../../components/client/RoomCard.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import api from '../../config/api.js';
import { ArrowRight, Quote } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, roomsRes, reviewsRes] = await Promise.all([
          api.get('/api/category/get?limit=100'),
          api.get('/api/room/get'),
          api.get('/api/review/featured?limit=6'),
        ]);
        setCategories((catsRes.data.data || []).slice(0, 3));
        setRooms((roomsRes.data.data || []).slice(0, 3));
        setReviews(reviewsRes.data.data || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Features */}
      <FeaturesSection />

      {/* Featured Rooms */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Rooms</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Accommodations</h2>
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
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/rooms')}
              className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View All Rooms <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Room Types</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Experience</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => navigate(`/rooms?category=${cat._id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold opacity-20">{cat.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                      <p className="text-amber-400 font-bold text-lg">${cat.price}<span className="text-gray-300 text-sm font-normal">/night</span></p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-sm line-clamp-2">{cat.description}</p>
                    {cat.features?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {cat.features.slice(0, 3).map((f) => (
                          <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What Our Guests Say — real reviews */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Guest Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Guests Say</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          {reviews.length === 0 ? (
            /* Fallback to static testimonials when no real reviews yet */
            <TestimonialsSection />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => {
                const user = review.userId || {};
                const categoryName = review.roomId?.category?.name || 'Hotel Room';
                const avatarUrl = user.profilePic ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || 'G') + ' ' + (user.lastName || ''))}&background=1e40af&color=fff&size=64`;

                return (
                  <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                    {/* Quote icon */}
                    <Quote size={28} className="text-amber-400 shrink-0" />

                    {/* Stars */}
                    <StarRating rating={review.rating} size="md" />

                    {/* Comment */}
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">
                      {review.comment
                        ? `"${review.comment}"`
                        : <span className="italic text-gray-400">No comment provided.</span>
                      }
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt={user.firstName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-amber-600 font-medium">{categoryName}</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Luxury?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Book your stay today and enjoy exclusive benefits, personalized service, and unforgettable memories.
          </p>
          <button
            onClick={() => navigate('/rooms')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            Book Your Stay
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
