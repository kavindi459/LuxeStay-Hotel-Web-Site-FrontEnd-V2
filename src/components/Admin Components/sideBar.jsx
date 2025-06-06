import React from 'react';
import { Link } from 'react-router-dom';
import Alogo1 from './../../assets/Alogo1.png';
import { 
  FaTachometerAlt, FaBook, FaList, 
  FaBed, FaUsers, FaComments, FaImages 
} from 'react-icons/fa';

const SideBar = () => {
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Booking', path: '/admin/booking', icon: <FaBook /> },
    { name: 'Categories', path: '/admin/categories', icon: <FaList /> },
    { name: 'Rooms', path: '/admin/rooms', icon: <FaBed /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Feedback', path: '/admin/feedback', icon: <FaComments /> },
    { name: 'Gallery Item', path: '/admin/gallery', icon: <FaImages /> },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 min-h-screen">
      <Link to="/admin/dashboard">
        <img
          src={Alogo1}
          alt="Logo"
          className="w-40 h-auto rounded-full ml-2 mb-4 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
        />
      </Link>

      {links.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          className="flex items-center gap-3 text-white text-lg font-semibold px-4 py-2 rounded transition-transform duration-200 ease-in-out hover:bg-gray-600 hover:text-black hover:scale-105"
        >
          <span className="text-xl">{link.icon}</span>
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
