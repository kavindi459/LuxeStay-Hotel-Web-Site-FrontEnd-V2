import { Wifi, Clock, Waves, UtensilsCrossed } from 'lucide-react';

const features = [
  {
    icon: <Wifi size={32} className="text-blue-800" />,
    title: 'Free High-Speed WiFi',
    description: 'Stay connected with complimentary ultra-fast fiber internet throughout the entire property.',
  },
  {
    icon: <Clock size={32} className="text-blue-800" />,
    title: '24/7 Concierge Service',
    description: 'Our dedicated team is available around the clock to assist with any request, any time of day.',
  },
  {
    icon: <Waves size={32} className="text-blue-800" />,
    title: 'Pool & Spa',
    description: 'Indulge in our heated infinity pool and full-service spa for the ultimate relaxation experience.',
  },
  {
    icon: <UtensilsCrossed size={32} className="text-blue-800" />,
    title: 'Fine Dining',
    description: 'Savor exquisite cuisine crafted by award-winning chefs using locally sourced, seasonal ingredients.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">World-Class Amenities</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl mx-auto mb-5 group-hover:bg-blue-800 transition-colors">
                <div className="group-hover:[&_svg]:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
