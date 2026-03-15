import { useState, useEffect, useCallback } from 'react';
import api from '../config/api.js';

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsRes, categoriesRes] = await Promise.all([
        api.get('/api/room/get'),
        api.get('/api/category/get?limit=100'),
      ]);
      setRooms(roomsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { rooms, categories, loading, error, refetch: fetchData };
};

export default useRooms;
