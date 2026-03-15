import Navbar from '../../components/client/Navbar.jsx';
import Footer from '../../components/client/Footer.jsx';
import { Hotel, Award, Users, Star } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Award size={24} />, label: 'Years of Excellence', value: '25+' },
    { icon: <Users size={24} />, label: 'Happy Guests', value: '50K+' },
    { icon: <Hotel size={24} />, label: 'Luxury Rooms', value: '120+' },
    { icon: <Star size={24} />, label: 'Awards Won', value: '35+' },
  ];

  const team = [
    { name: 'James Harrison', role: 'General Manager', avatar: 'https://ui-avatars.com/api/?name=James+Harrison&background=1e40af&color=fff&size=128' },
    { name: 'Sofia Martinez', role: 'Executive Chef', avatar: 'https://ui-avatars.com/api/?name=Sofia+Martinez&background=d97706&color=fff&size=128' },
    { name: 'Michael Chen', role: 'Head Concierge', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=16a34a&color=fff&size=128' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-20 text-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold">About LuxeStay</h1>
          <p className="text-blue-200 mt-3 max-w-2xl mx-auto">
            A quarter century of delivering unparalleled luxury, comfort, and world-class hospitality.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Heritage</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                25 Years of Luxury Hospitality
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 1999, LuxeStay Hotel has been a beacon of luxury and elegance in the heart of Grand City.
                What began as a boutique property with just 20 rooms has grown into a world-renowned destination
                spanning over 120 meticulously designed suites and rooms.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our philosophy is simple: every guest deserves an extraordinary experience. From our locally-sourced
                fine dining to our award-winning spa, every detail is crafted to perfection by our passionate team
                of hospitality professionals.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We have been honored with 35+ international hospitality awards, and our commitment to excellence
                continues to set the standard for luxury hotels worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
                alt="Hotel"
                className="rounded-xl object-cover w-full h-48 col-span-2"
              />
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300"
                alt="Room"
                className="rounded-xl object-cover w-full h-36"
              />
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300"
                alt="Spa"
                className="rounded-xl object-cover w-full h-36"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-800 rounded-xl mx-auto mb-3 text-amber-400">
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-blue-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Our People</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Leadership</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition-shadow">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-amber-600 text-sm font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
