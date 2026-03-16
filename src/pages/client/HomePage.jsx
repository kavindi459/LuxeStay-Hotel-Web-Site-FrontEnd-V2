import { useState, useEffect } from 'react';
import api from '../../config/api.js';

import HeroSection          from '../../components/client/HeroSection.jsx';
import FeaturesSection      from '../../components/client/FeaturesSection.jsx';
import FeaturedRoomsSection from '../../components/client/FeaturedRoomsSection.jsx';
import CategoriesCarousel   from '../../components/client/CategoriesCarousel.jsx';
import ReviewsCarousel      from '../../components/client/ReviewsCarousel.jsx';
import CtaBanner            from '../../components/client/CtaBanner.jsx';
import DestinationsCarousel from '../../components/client/DestinationsCarousel.jsx';

const DEFAULTS = {
  homeHero:  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800',
  homeRooms: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
  homeCta:   'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
};

const Home = () => {
  const [categories,  setCategories]  = useState([]);
  const [rooms,       setRooms]       = useState([]);
  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [bgSettings,  setBgSettings]  = useState(DEFAULTS);

  const bg = (key) => bgSettings[key] || DEFAULTS[key];

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
        setRooms((roomsRes.data.data || []).slice(0, 3));
        setReviews(reviewsRes.data.data || []);
        if (bgRes.data.data) setBgSettings((prev) => ({ ...prev, ...bgRes.data.data }));
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <>
      <HeroSection bgImage={bg('homeHero')} />

      <FeaturesSection />

      <FeaturedRoomsSection
        rooms={rooms}
        loading={loading}
        bgImage={bg('homeRooms')}
      />

      <CategoriesCarousel
        categories={categories}
        bgImage={bg('homeRooms')}
      />

      <ReviewsCarousel reviews={reviews} />

      <CtaBanner bgImage={bg('homeCta')} />

      <DestinationsCarousel />
    </>
  );
};

export default Home;
