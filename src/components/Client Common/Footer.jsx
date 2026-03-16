import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { MapPin, Phone, Mail } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal.js';
import logo from '../../assets/logo.png';

const Footer = () => {
  const footerRef = useScrollReveal(0.05);

  return (
    <footer className="bg-gray-900 text-gray-300" ref={footerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="reveal stagger-1 col-span-1">
            <div className="mb-4">
              <img src={logo} alt="CINNAMON LAKE Hotel" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Experience luxury like never before. Where comfort meets elegance and every detail is perfected.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FaFacebook size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FaInstagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FaTwitter size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="reveal stagger-2">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Home',    path: '/' },
                { name: 'Rooms',   path: '/rooms' },
                { name: 'About Us',path: '/about' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-amber-400 inline-block transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="reveal stagger-3">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5">
              {['Luxury Rooms', 'Fine Dining', 'Pool & Spa', 'Conference Hall', 'Airport Transfer', 'Room Service'].map((s) => (
                <li key={s} className="text-sm text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="reveal stagger-4">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 text-amber-500 shrink-0" />
                123 Luxury Avenue, Grand City, GC 10001
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-amber-500 shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-amber-500 shrink-0" />
                info@luxestay.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CINNAMON LAKE Hotel. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Crafted with care for luxury experiences
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
