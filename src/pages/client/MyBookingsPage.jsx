import { useState } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import useBookings from '../../hooks/useBookings.js';
import { formatDate, formatCurrency, calculateNights } from '../../utils/formatDate.js';
import { CalendarDays, BedDouble, Hash, Star, MessageSquare, CheckCircle } from 'lucide-react';
import api from '../../config/api.js';
import toast from 'react-hot-toast';

/* Inline star picker */
const StarPicker = ({ rating, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="focus:outline-none"
      >
        <Star
          size={28}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      </button>
    ))}
  </div>
);

const MyBookingsPage = () => {
  const { bookings, loading, error, cancelBooking } = useBookings();
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Review state
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewedIds, setReviewedIds] = useState(new Set()); // bookingIds already reviewed this session

  const handleCancelOpen = (booking) => {
    setCancelModal({ open: true, booking });
    setReason('');
  };

  const handleCancelConfirm = async () => {
    if (!reason.trim()) return;
    setCancelling(true);
    const success = await cancelBooking(cancelModal.booking._id, reason);
    if (success) setCancelModal({ open: false, booking: null });
    setCancelling(false);
  };

  const openReviewModal = (booking) => {
    setReviewModal({ open: true, booking });
    setRating(5);
    setComment('');
  };

  const handleReviewSubmit = async () => {
    const { booking } = reviewModal;
    if (!rating) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/review/create', {
        bookingId: booking._id,
        roomId: booking.roomId?._id || booking.roomId,
        rating,
        comment: comment.trim(),
      });
      toast.success('Review submitted! Thank you.');
      setReviewedIds((prev) => new Set([...prev, booking._id]));
      setReviewModal({ open: false, booking: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 mt-10">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage your hotel reservations</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24 text-red-500">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet. Start planning your stay!</p>
            <a href="/rooms" className="inline-block bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
              Browse Rooms
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const room = booking.roomId || {};
              const category = (room.category && typeof room.category === 'object') ? room.category : {};
              const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
              const alreadyReviewed = reviewedIds.has(booking._id);

              return (
                <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Room Image */}
                    <div className="md:w-48 h-40 md:h-auto shrink-0">
                      <img
                        src={room.photos?.[0] || category.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'}
                        alt="Room"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-5 flex-1 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge status={booking.status} />
                          {booking.paymentStatus && (
                            <Badge status={booking.paymentStatus} />
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Hash size={10} /> {booking.bookingId}
                          </span>
                          <span className="text-xs text-gray-400 capitalize">
                            {booking.paymentMethod === 'online' ? '💳 Paid Online' : '🏨 Pay at Hotel'}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{category.name || 'Room'}</h3>
                        <div className="mt-2 space-y-1.5">
                          <p className="text-sm text-gray-600 flex items-center gap-1.5">
                            <CalendarDays size={14} className="text-blue-800" />
                            {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1.5">
                            <BedDouble size={14} className="text-blue-800" />
                            {nights} night{nights !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {booking.notes && (
                          <p className="text-xs text-gray-400 mt-2 italic">Notes: {booking.notes}</p>
                        )}
                        {booking.reason && booking.status === 'cancelled' && (
                          <p className="text-xs text-red-500 mt-2">Reason: {booking.reason}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <span className="text-2xl font-bold text-blue-800">{formatCurrency(booking.totalAmount)}</span>
                        <div className="mt-3 flex flex-col gap-2 items-end">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleCancelOpen(booking)}
                              className="text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            alreadyReviewed ? (
                              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle size={15} /> Reviewed
                              </span>
                            ) : (
                              <button
                                onClick={() => openReviewModal(booking)}
                                className="flex items-center gap-1.5 text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                <MessageSquare size={15} /> Write Review
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, booking: null })}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel booking{' '}
            <span className="font-bold text-blue-800">#{cancelModal.booking?.bookingId}</span>?
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Please provide a reason for cancellation..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setCancelModal({ open: false, booking: null })}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
              loading={cancelling}
              disabled={!reason.trim()}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, booking: null })}
        title="Write a Review"
      >
        {reviewModal.booking && (
          <div className="space-y-5">
            <div className="bg-amber-50 rounded-lg px-4 py-3 text-sm text-amber-800 font-medium">
              Booking #{reviewModal.booking.bookingId} —{' '}
              {(() => {
                const r = reviewModal.booking.roomId || {};
                const cat = (r.category && typeof r.category === 'object') ? r.category : {};
                return cat.name || 'Room';
              })()}
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <StarPicker rating={rating} onChange={setRating} />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this room..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setReviewModal({ open: false, booking: null })}>
                Cancel
              </Button>
              <Button
                onClick={handleReviewSubmit}
                loading={submitting}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default MyBookingsPage;
