import StarRating from '../ui/StarRating.jsx';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Traveler',
    comment:
      'Absolutely incredible experience. The rooms are stunning, the staff is attentive, and the amenities are top-notch. I stay here every time I visit the city.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=1e40af&color=fff',
  },
  {
    name: 'Michael Chen',
    role: 'Honeymooner',
    comment:
      'We chose LuxeStay for our honeymoon and it exceeded every expectation. The romantic ambiance, personalized service, and fine dining made it truly special.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=d97706&color=fff',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Family Vacation',
    comment:
      'The family suite was spacious and the kids loved the pool. The concierge arranged everything perfectly for us. Will definitely be back next summer!',
    rating: 4,
    avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=16a34a&color=fff',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Guests Say</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="text-5xl text-blue-100 font-serif absolute top-4 left-6 leading-none">"</div>
              <div className="relative z-10">
                <StarRating rating={t.rating} size="sm" />
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5 italic">"{t.comment}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
