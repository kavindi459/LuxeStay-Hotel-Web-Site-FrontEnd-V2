import { useState, useEffect, useCallback } from 'react';
import api from '../config/api.js';
import toast from 'react-hot-toast';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/booking/mybookings');
      setBookings(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (bookingId, reason) => {
    try {
      await api.patch(`/api/booking/${bookingId}/cancel`, { reason });
      toast.success('Booking cancelled successfully');
      await fetchBookings();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
      return false;
    }
  };

  return { bookings, loading, error, cancelBooking, refetch: fetchBookings };
};

export default useBookings;
