import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.jsx';
import { formatDate, formatCurrency, calculateNights } from '../../utils/formatDate.js';
import api from '../../config/api.js';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button.jsx';
import { CalendarDays, Users, CheckCircle, CreditCard, Building2, Lock, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ─── Stripe Card Form ──────────────────────────────────────────────────────────
const StripePaymentForm = ({ clientSecret, totalAmount, onPaymentSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  // Extract paymentIntentId from clientSecret (format: "pi_xxx_secret_xxx")
  const paymentIntentId = clientSecret?.split('_secret_')[0];

  // Verify payment server-side — fallback when ad blocker blocks r.stripe.com/b
  const verifyServerSide = async () => {
    try {
      const res = await api.post('/api/payment/verify', { paymentIntentId });
      if (res.data.success) {
        onPaymentSuccess(paymentIntentId);
        return true;
      }
    } catch {}
    return false;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        // Ad blocker or network issue — verify server-side before showing error
        if (
          error.type === 'api_connection_error' ||
          error.message?.toLowerCase().includes('failed to fetch') ||
          error.message?.toLowerCase().includes('network')
        ) {
          const verified = await verifyServerSide();
          if (verified) return;
        }
        toast.error(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch {
      // Stripe SDK threw — verify server-side (ad blocker scenario)
      const verified = await verifyServerSide();
      if (!verified) toast.error('Payment could not be completed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <Lock size={16} className="text-blue-700 shrink-0" />
        <p className="text-sm text-blue-700">Your payment is secured and encrypted by Stripe.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Card Details</label>
        <div className="border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-800 focus-within:border-blue-800 transition-all">
          <CardElement options={{
            style: {
              base: { fontSize: '15px', color: '#1e293b', '::placeholder': { color: '#94a3b8' } },
              invalid: { color: '#dc2626' },
            },
          }} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Test card: 4242 4242 4242 4242 · Any future date · Any CVC</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button type="submit" disabled={!stripe || paying}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors">
          {paying ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
          ) : (
            <><CreditCard size={16} /> Pay {formatCurrency(totalAmount)}</>
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Booking Summary Card (reused in multiple steps) ──────────────────────────
const BookingSummary = ({ room, category, checkIn, checkOut, guests, nights, pricePerNight, totalAmount }) => (
  <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
    <h2 className="text-lg font-bold text-gray-900 mb-5">Booking Summary</h2>
    {room.photos?.[0] && (
      <img src={room.photos[0]} alt="Room" className="w-full h-36 object-cover rounded-lg mb-4" />
    )}
    <h3 className="font-semibold text-gray-900">{category.name || 'Room'}</h3>
    <p className="text-gray-400 text-xs mb-4">Room #{room.roomID}</p>

    <div className="space-y-2.5 mb-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CalendarDays size={14} className="text-blue-800 shrink-0" />
        <span>Check-In: <span className="font-medium text-gray-900">{checkIn ? formatDate(checkIn) : '—'}</span></span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CalendarDays size={14} className="text-blue-800 shrink-0" />
        <span>Check-Out: <span className="font-medium text-gray-900">{checkOut ? formatDate(checkOut) : '—'}</span></span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users size={14} className="text-blue-800 shrink-0" />
        <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
      </div>
    </div>

    <div className="border-t border-gray-100 pt-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>${pricePerNight} × {nights} night{nights !== 1 ? 's' : ''} × {guests} guest{guests !== 1 ? 's' : ''}</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg text-blue-800 pt-2 border-t border-gray-100">
        <span>Total</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  </div>
);

// ─── Main BookingPage ─────────────────────────────────────────────────────────
const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const stateData = location.state || {};

  const checkIn = stateData.checkIn || '';
  const checkOut = stateData.checkOut || '';
  const guests = stateData.guests || 1;
  const room = stateData.room || {};
  const category = stateData.category || {};
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : stateData.nights || 0;
  const pricePerNight = category.price || 0;
  const totalAmount = nights * pricePerNight * guests;

  // step: 'form' | 'payment' | 'done'
  const [step, setStep] = useState('form');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay_at_hotel');
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const summaryProps = { room, category, checkIn, checkOut, guests, nights, pricePerNight, totalAmount };

  // ── Step 1 → Step 2: proceed to payment ────────────────────────────────────
  const handleContinue = async () => {
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return; }
    if (nights <= 0) { toast.error('Check-out must be after check-in'); return; }

    if (paymentMethod === 'online') {
      // Create Stripe payment intent
      setLoadingIntent(true);
      try {
        const res = await api.post('/api/payment/create-intent', { amount: totalAmount });
        setClientSecret(res.data.clientSecret);
        setStep('payment');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to initialize payment');
      } finally {
        setLoadingIntent(false);
      }
    } else {
      // Pay at hotel — skip payment step, create booking directly
      await createBooking({ paymentMethod: 'pay_at_hotel', paymentIntentId: '' });
    }
  };

  // ── After Stripe payment succeeds ──────────────────────────────────────────
  const handlePaymentSuccess = async (paymentIntentId) => {
    await createBooking({ paymentMethod: 'online', paymentIntentId });
  };

  // ── Create booking in backend ──────────────────────────────────────────────
  const createBooking = async ({ paymentMethod: pm, paymentIntentId: piId }) => {
    setCreatingBooking(true);
    try {
      const res = await api.post('/api/booking/createbycategory', {
        roomID: room.roomID,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        notes,
        totalAmount,
        paymentMethod: pm,
        paymentIntentId: piId,
      });
      setBookingConfirmed(res.data.data);
      setStep('done');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setCreatingBooking(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === 'done' && bookingConfirmed) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-24">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-gray-500 mb-5 text-sm leading-relaxed">
            Your booking is pending confirmation from our team. You'll receive an email once it's confirmed.
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
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className={`font-semibold capitalize ${bookingConfirmed.paymentMethod === 'online' ? 'text-emerald-600' : 'text-gray-700'}`}>
                {bookingConfirmed.paymentMethod === 'online' ? 'Paid Online' : 'Pay at Hotel'}
              </span>
            </div>
          </div>
          <button onClick={() => navigate('/my-bookings')}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition-colors">
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Review & Pay', 'Payment', 'Confirmed'].map((label, i) => {
            const stepNum = i + 1;
            const currentStep = step === 'form' ? 1 : step === 'payment' ? 2 : 3;
            const isActive = stepNum === currentStep;
            const isDone = stepNum < currentStep;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${isActive ? 'text-blue-800' : 'text-gray-400'}`}>{label}</span>
                {i < 2 && <div className="w-8 h-px bg-gray-300 mx-1" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">

            {/* ── STEP 1: Guest info + payment method selection ─────────── */}
            {step === 'form' && (
              <>
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
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                    placeholder="Any special requests or notes for your stay..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" />
                </div>

                {/* Payment method selection */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-4 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'online' ? 'border-blue-800 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="paymentMethod" value="online"
                        checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')}
                        className="mt-0.5 accent-blue-800" />
                      <div>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                          <CreditCard size={16} className="text-blue-700" />
                          Pay Online Now
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Recommended</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Secure card payment via Stripe. Your booking is instantly reserved after payment.</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'pay_at_hotel' ? 'border-blue-800 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="paymentMethod" value="pay_at_hotel"
                        checked={paymentMethod === 'pay_at_hotel'} onChange={() => setPaymentMethod('pay_at_hotel')}
                        className="mt-0.5 accent-blue-800" />
                      <div>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                          <Building2 size={16} className="text-gray-600" />
                          Pay at Hotel
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Pay when you arrive. Subject to admin confirmation before your reservation is secured.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  loading={loadingIntent || creatingBooking}
                  disabled={!checkIn || !checkOut || nights <= 0}
                  className="w-full py-3 text-base"
                >
                  {paymentMethod === 'online' ? `Continue to Payment — ${formatCurrency(totalAmount)}` : 'Confirm Booking'}
                </Button>
              </>
            )}

            {/* ── STEP 2: Stripe payment form ───────────────────────────── */}
            {step === 'payment' && clientSecret && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Enter Card Details</h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    totalAmount={totalAmount}
                    onPaymentSuccess={handlePaymentSuccess}
                    onBack={() => setStep('form')}
                  />
                </Elements>
              </div>
            )}

          </div>

          {/* Right column: always shows booking summary */}
          <div className="lg:col-span-2">
            <BookingSummary {...summaryProps} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;
