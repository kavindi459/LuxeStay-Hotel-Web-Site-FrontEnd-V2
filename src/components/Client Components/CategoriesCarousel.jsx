import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal.js';

const CategoriesCarousel = ({ categories, bgImage }) => {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal(0.08);

  if (categories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-24 relative bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">Room Types</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Choose Your Experience</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Infinite CSS carousel */}
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
  );
};

export default CategoriesCarousel;
