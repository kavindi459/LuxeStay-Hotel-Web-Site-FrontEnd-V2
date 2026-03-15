import { useState } from 'react';
import Navbar from '../../components/client/Navbar.jsx';
import Footer from '../../components/client/Footer.jsx';
import Button from '../../components/ui/Button.jsx';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../config/api.js';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/contact/create', form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-center text-white">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="text-blue-200 mt-3 max-w-xl mx-auto">
          We'd love to hear from you. Our team is always here to help.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Hotel Information</h2>
              <div className="space-y-4">
                {[
                  { icon: <MapPin size={20} className="text-blue-800" />, label: 'Address', value: '123 Luxury Avenue, Grand City, GC 10001' },
                  { icon: <Phone size={20} className="text-blue-800" />, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: <Mail size={20} className="text-blue-800" />, label: 'Email', value: 'info@luxestay.com' },
                  { icon: <Clock size={20} className="text-blue-800" />, label: 'Reception Hours', value: '24/7 — Always Open' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">{item.label}</p>
                      <p className="text-sm text-gray-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h2>
              <div className="flex items-center gap-4">
                <a href="#" className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-800 hover:bg-blue-800 hover:text-white transition-colors text-xl">
                  <FaFacebook />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 bg-pink-50 rounded-lg text-pink-600 hover:bg-pink-600 hover:text-white transition-colors text-xl">
                  <FaInstagram />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 bg-sky-50 rounded-lg text-sky-500 hover:bg-sky-500 hover:text-white transition-colors text-xl">
                  <FaTwitter />
                </a>
              </div>
            </div>

            {/* Google Maps Placeholder */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-blue-800 mx-auto mb-2" />
                  <p className="text-blue-800 font-semibold text-sm">Map Placeholder</p>
                  <p className="text-blue-600 text-xs mt-1">123 Luxury Avenue, Grand City</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" />
              </div>
              <Button type="submit" loading={loading} className="px-8 py-2.5">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
