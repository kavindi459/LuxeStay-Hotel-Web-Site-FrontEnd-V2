import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/client/Navbar.jsx';
import Footer from '../../components/client/Footer.jsx';
import { useAuthStore } from '../../store/authStore.jsx';
import { formatDate, formatCurrency, calculateNights } from '../../utils/formatDate.js';
import api from '../../config/api.js';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button.jsx';
import { CalendarDays, Users, CheckCircle } from 'lucide-react';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const stateData = location.state || {};

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const checkIn = stateData.checkIn || '';
  const checkOut = stateData.checkOut || '';
  const guests = stateData.guests || 1;
  const room = stateData.room || {};
  const category = stateData.category || {};
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : stateData.nights || 0;
  const pricePerNight = category.price || 0;
  const totalAmount = nights * pricePerNight;

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-5">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-5">
              Your booking has been submitted successfully and is pending confirmation.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-bold text-blue-800">{bookingConfirmed.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-In</span>
                <span className="font-medium">{formatDate(bookingConfirmed.checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-Out</span>
                <span className="font-medium">{formatDate(bookingConfirmed.checkOutDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-blue-800">{formatCurrency(bookingConfirmed.totalAmount)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-lg"
            >
              View My Bookings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/booking/createbycategory', {
        roomID: room.roomID,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        status: 'pending',
        notes,
        totalAmount,
      });
      setBookingConfirmed(res.data.data);
      toast.success('Booking created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Guest Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Guest Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">First Name</label>
                  <input value={user?.firstName || ''} readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Last Name</label>
                  <input value={user?.lastName || ''} readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                  <input value={user?.email || ''} readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                  <input value={user?.phone || ''} readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Guests</label>
                  <input value={guests} readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Special Requests</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any special requests or notes for your stay..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Booking Summary</h2>

              {room.photos?.[0] && (
                <img src={room.photos[0]} alt="Room" className="w-full h-36 object-cover rounded-lg mb-4" />
              )}

              <h3 className="font-semibold text-gray-900">{category.name || 'Room'}</h3>
              <p className="text-gray-400 text-xs mb-4">Room ID: {room.roomID}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={14} className="text-blue-800" />
                  <span>Check-In: <span className="font-medium text-gray-900">{checkIn ? formatDate(checkIn) : 'Not set'}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={14} className="text-blue-800" />
                  <span>Check-Out: <span className="font-medium text-gray-900">{checkOut ? formatDate(checkOut) : 'Not set'}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} className="text-blue-800" />
                  <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${pricePerNight} × {nights} nights</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-blue-800 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                loading={loading}
                disabled={!checkIn || !checkOut || nights <= 0}
                className="w-full mt-5 py-3 text-base"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
