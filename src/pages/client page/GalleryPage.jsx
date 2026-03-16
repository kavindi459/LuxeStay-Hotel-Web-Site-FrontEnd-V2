import { useState, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner.jsx';
import api from '../../config/api.js';
import { X } from 'lucide-react';

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/api/gallery/get?featured=true'),
      api.get('/api/bgimage/settings'),
    ]).then(([galleryRes, bgRes]) => {
      const featured = galleryRes.data.data || [];
      setItems(featured);
      const bg = bgRes.data.data || {};
      if (bg.gallery) setHeroImage(bg.gallery);
      else if (featured.length > 0) setHeroImage(featured[0].image);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50">

      {/* Hero */}
      <div className="relative py-16 text-center text-white overflow-hidden bg-gray-800">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
            backgroundImage: `url('${heroImage }')`,
          }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Our Gallery</p>
          <h1 className="text-4xl md:text-5xl font-bold">Hotel Moments</h1>
          <p className="text-gray-200 mt-3 max-w-xl mx-auto">
            A glimpse into the luxury and elegance that awaits you at CINNAMON LAKE Hotel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold text-gray-900">No Gallery Items Yet</h3>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-shadow"
                onClick={() => setLightbox(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm">{item.name}</p>
                    {item.description && (
                      <p className="text-gray-300 text-xs mt-0.5 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.name} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center mt-3">
              <p className="text-white font-semibold">{lightbox.name}</p>
              {lightbox.description && <p className="text-gray-400 text-sm mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;
