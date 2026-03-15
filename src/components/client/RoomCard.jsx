import { useNavigate } from 'react-router-dom';
import { Users, Star } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const category = room.category || {};
  const image = room.photos?.[0] || category.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
  const pricePerNight = category.price || 0;
  const description = room.description || category.description || '';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={category.name || 'Room'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge status={room.availability ? 'available' : 'occupied'} />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg">{category.name || 'Room'}</h3>
          <div className="text-right">
            <span className="text-blue-800 font-bold text-lg">${pricePerNight}</span>
            <span className="text-gray-400 text-xs">/night</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <Users size={14} />
          <span>Up to {room.maxGuests} guests</span>
        </div>

        {description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {description}
          </p>
        )}

        {category.features && category.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {category.features.slice(0, 3).map((f) => (
              <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="mt-auto w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
