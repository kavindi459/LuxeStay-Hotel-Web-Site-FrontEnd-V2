import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminUserTag = () => {
  const [name, setName] = useState('');
  const [imageLink, setImageLink] = useState();
  const [userFound, setUserFound] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token !== null) {
      axios
        .get(`${BACKEND_URL}/api/users/getuserprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setName(
            response.data.data.firstName + ' ' + response.data.data.lastName
          );
          setImageLink(response.data.data.profilePic);
          setUserFound(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setName('');
      setImageLink('');
    }
  }, [userFound]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserFound(false);
    navigate('/auth/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {userFound && (
          <>
            <img
              className="rounded-full w-10 h-10 border border-white"
              src={imageLink}
              style={{ width: '50px', height: '50px' }}
              alt="Profile"
            />
            <h1 className="text-lg font-bold">{name}</h1>
          </>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 text-white bg-red-500 shadow-lg rounded-md z-10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-white hover:bg-red-600 rounded-md "
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserTag;
