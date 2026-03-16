import { useNavigate } from 'react-router-dom';
import { Users, CalendarX } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const RoomCard = ({ room, unavailableForDates = false, searchDates = {} }) => {
  const navigate  = useNavigate();
  const category  = room.category || {};
  const image     = room.photos?.[0] || category.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
  const pricePerNight = category.price || 0;
  const description   = room.description || category.description || '';

  const handleViewDetails = () => {
    navigate(`/rooms/${room._id}`, {
      state: searchDates.checkIn ? { checkIn: searchDates.checkIn, checkOut: searchDates.checkOut } : undefined,
    });
  };

  return (
    <div className={`card-hover bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group relative ${unavailableForDates ? 'opacity-70' : ''}`}>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={category.name || 'Room'}
          className={`img-zoom w-full h-full object-cover ${unavailableForDates ? 'grayscale-[40%]' : ''}`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge top-right */}
        <div className="absolute top-3 right-3">
          {unavailableForDates ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
              <CalendarX size={11} /> Unavailable
            </span>
          ) : (
            <Badge status={room.availability ? 'available' : 'occupied'} />
          )}
        </div>

        {/* Price pill on hover */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            ${pricePerNight}/night
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-800 transition-colors">
            {category.name || 'Room'}
          </h3>
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
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{description}</p>
        )}

        {category.features && category.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {category.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {unavailableForDates ? (
          <div className="mt-auto space-y-2">
            <p className="text-xs text-center text-red-500 font-medium">
              Already booked for selected dates
            </p>
            <button
              onClick={handleViewDetails}
              className="w-full border border-gray-300 text-gray-500 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              View Details
            </button>
          </div>
        ) : (
          <button
            onClick={handleViewDetails}
            className="btn-gradient mt-auto w-full text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
