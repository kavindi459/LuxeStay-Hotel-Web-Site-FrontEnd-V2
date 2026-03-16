import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useAuthStore } from '../../store/authStore.jsx';
import { formatCurrency, calculateNights } from '../../utils/formatDate.js';
import api from '../../config/api.js';
import toast from 'react-hot-toast';
import { Users, CalendarDays, ChevronLeft, ChevronRight, Star, Send, CalendarX } from 'lucide-react';

/* Clickable star picker */
const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="focus:outline-none transition-transform hover:scale-110"
      >
        <Star
          size={28}
          className={star <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      </button>
    ))}
    <span className="ml-2 text-sm font-medium text-gray-600">
      {value === 0 ? 'Select rating' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
    </span>
  </div>
);

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || '');
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || '');
  const [guests, setGuests] = useState(1);
  const today = new Date().toISOString().split('T')[0];

  // Date availability check
  const [dateAvailability, setDateAvailability] = useState(null); // null | 'checking' | 'available' | 'unavailable'
  const checkAvailTimer = useRef(null);

  // Review state
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [eligibleBooking, setEligibleBooking] = useState(null); // confirmed booking with no review yet
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const [roomRes, reviewRes] = await Promise.all([
          api.get(`/api/room/getById/${roomId}`),
          api.get(`/api/review/room/${roomId}`),
        ]);
        const roomData = roomRes.data.data;
        // Populate category if not populated
        if (typeof roomData.category === 'string') {
          try {
            const catRes = await api.get(`/api/category/get`);
            const cats = catRes.data.data || [];
            roomData.category = cats.find((c) => c._id === roomData.category) || {};
          } catch {}
        }
        const fetchedReviews = reviewRes.data.data || [];
        setRoom(roomData);
        setReviews(fetchedReviews);
        setReviewStats(reviewRes.data.stats || { averageRating: 0, totalReviews: 0 });

        // If logged in, check if user has a confirmed booking for this room with no review yet
        if (isAuthenticated) {
          try {
            const myBookingsRes = await api.get('/api/booking/mybookings');
            const myBookings = myBookingsRes.data.data || [];
            const confirmed = myBookings.filter(
              (b) =>
                (b.roomId?._id === roomId || b.roomId === roomId) &&
                b.status === 'confirmed'
            );
            // Find booking not yet reviewed
            const reviewedBookingIds = new Set(fetchedReviews.map((r) => r.bookingId?._id || r.bookingId));
            const unreviewedBooking = confirmed.find((b) => !reviewedBookingIds.has(b._id));
            if (unreviewedBooking) {
              setEligibleBooking(unreviewedBooking);
            } else if (confirmed.length > 0) {
              setAlreadyReviewed(true);
            }
          } catch {}
        }
      } catch {
        toast.error('Room not found');
        navigate('/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, isAuthenticated]);

  // Check availability whenever checkIn or checkOut changes
  useEffect(() => {
    if (!checkIn || !checkOut || !room) { setDateAvailability(null); return; }
    setDateAvailability('checking');
    clearTimeout(checkAvailTimer.current);
    checkAvailTimer.current = setTimeout(async () => {
      try {
        const res = await api.get(`/api/room/available?checkIn=${checkIn}&checkOut=${checkOut}`);
        const availableIds = new Set((res.data.data || []).map((r) => r._id));
        setDateAvailability(availableIds.has(room._id) ? 'available' : 'unavailable');
      } catch {
        setDateAvailability(null);
      }
    }, 600);
    return () => clearTimeout(checkAvailTimer.current);
  }, [checkIn, checkOut, room]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!eligibleBooking) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/api/review/create', {
        bookingId: eligibleBooking._id,
        roomId,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      const newReview = res.data.data;
      setReviews((prev) => [newReview, ...prev]);
      setReviewStats((prev) => {
        const total = prev.totalReviews + 1;
        const avg = ((prev.averageRating * prev.totalReviews) + reviewForm.rating) / total;
        return { totalReviews: total, averageRating: Math.round(avg * 10) / 10 };
      });
      setEligibleBooking(null);
      setAlreadyReviewed(true);
      setReviewForm({ rating: 0, comment: '' });
      toast.success('Review submitted! Thank you.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!room) return null;

  const category = typeof room.category === 'object' ? room.category : {};
  const images = room.photos?.length > 0 ? room.photos : [category.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'];
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalPrice = nights * (category.price || 0) * guests;

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please log in to make a booking');
      navigate('/auth/login', { state: { from: `/rooms/${roomId}` } });
      return;
    }
    navigate(`/booking/${roomId}`, {
      state: { checkIn, checkOut, guests, room, category, nights, totalPrice },
    });
  };

  return (
    <div className="bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 mt-10">
        {/* Back */}
        <button onClick={() => navigate('/rooms')} className="flex items-center gap-1 text-blue-800 hover:text-blue-900 text-sm font-medium mb-6">
          <ChevronLeft size={16} /> Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[16/9]">
                <img
                  src={images[activeImage]}
                  alt="Room"
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-blue-800' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{category.name || 'Room'}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge status={room.availability ? 'available' : 'occupied'} />
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Users size={14} /> Up to {room.maxGuests} guests
                    </span>
                    {reviewStats.totalReviews > 0 && (
                      <div className="flex items-center gap-1">
                        <StarRating rating={reviewStats.averageRating} size="sm" />
                        <span className="text-xs text-gray-500">({reviewStats.totalReviews})</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-800">${category.price || 0}</span>
                  <span className="text-gray-400 text-sm">/night</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-5">{room.description || category.description}</p>

              {category.features?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Amenities & Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.features.map((f) => (
                      <span key={f} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Guest Reviews</h2>
                {reviewStats.totalReviews > 0 && (
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <StarRating rating={reviewStats.averageRating} size="sm" />
                    <span className="font-bold text-blue-800">{reviewStats.averageRating}</span>
                    <span className="text-gray-400 text-xs">({reviewStats.totalReviews} reviews)</span>
                  </div>
                )}
              </div>

              {/* Write a Review — shown only when user has eligible confirmed booking */}
              {eligibleBooking && (
                <form onSubmit={handleSubmitReview} className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-1">Write a Review</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Sharing your experience for booking{' '}
                    <span className="font-mono font-semibold text-blue-800">#{eligibleBooking.bookingId}</span>
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <StarPicker
                      value={reviewForm.rating}
                      onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Comment <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your experience — what did you love about your stay?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview || reviewForm.rating === 0}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    <Send size={15} />
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Already reviewed notice */}
              {alreadyReviewed && (
                <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <Star size={15} className="fill-green-600 text-green-600" />
                  You have already reviewed this room. Thank you for your feedback!
                </div>
              )}

              {/* Login prompt for guests */}
              {!isAuthenticated && (
                <div className="mb-6 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <a href="/auth/login" className="text-blue-800 font-semibold hover:underline">Log in</a> after a confirmed stay to leave a review.
                </div>
              )}

              {/* Review List */}
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={r.userId?.profilePic || `https://ui-avatars.com/api/?name=${r.userId?.firstName || 'G'}&background=1e40af&color=fff`}
                          alt={r.userId?.firstName}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 text-sm">
                              {r.userId?.firstName} {r.userId?.lastName}
                            </p>
                            <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <StarRating rating={r.rating} size="sm" />
                          {r.comment && <p className="text-gray-600 text-sm mt-1 leading-relaxed">{r.comment}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Book This Room</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    <CalendarDays size={12} className="inline mr-1" />Check-In
                  </label>
                  <input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    <CalendarDays size={12} className="inline mr-1" />Check-Out
                  </label>
                  <input type="date" value={checkOut} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    <Users size={12} className="inline mr-1" />Guests
                    <span className="text-gray-400 font-normal normal-case ml-1">(max {room.maxGuests})</span>
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-800">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      className="px-3 py-2.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold select-none"
                    >−</button>
                    <span className="flex-1 text-center text-sm font-semibold text-gray-900 py-2.5">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(room.maxGuests, g + 1))}
                      disabled={guests >= room.maxGuests}
                      className="px-3 py-2.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold select-none"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Date availability status */}
              {dateAvailability === 'checking' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2.5">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  Checking availability...
                </div>
              )}
              {dateAvailability === 'available' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                  Available for selected dates
                </div>
              )}
              {dateAvailability === 'unavailable' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <CalendarX size={15} className="shrink-0" />
                  Already booked for selected dates
                </div>
              )}

              {nights > 0 && dateAvailability !== 'unavailable' && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${category.price || 0} × {nights} night{nights !== 1 ? 's' : ''} × {guests} guest{guests !== 1 ? 's' : ''}</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-blue-800">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={!room.availability || dateAvailability === 'unavailable' || dateAvailability === 'checking'}
                className="w-full mt-5 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
              >
                {!room.availability
                  ? 'Room Not Available'
                  : dateAvailability === 'unavailable'
                    ? 'Not Available for These Dates'
                    : !checkIn || !checkOut
                      ? 'Select Dates to Book'
                      : 'Book Now'}
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  You'll need to log in to complete your booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RoomDetailPage;
