import React from 'react';
import Login from "../../assets/Login.jpg";

const LoginPage = () => {
  return (
    <div className='w-full h-screen relative overflow-hidden'>
      {/* Background image */}
      <img
        src={Login}
        alt="Login Background"
        className="w-full h-full object-cover absolute inset-0 z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Login Form */}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'>
        <div className='bg-white/15 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80 sm:w-96'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>Login</h1>

          <form className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-950 mb-1'>Email</label>
              <input
                type="email"
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-950 mb-1'>Password</label>
              <input
                type="password"
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="Enter your password"
                required 
              />
            </div>

            <button
              type="submit"
              className='w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-300'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
