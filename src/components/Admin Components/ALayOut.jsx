

import React from 'react';
import SideBar from './sideBar';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../../pages/admin page/dashboard/dashboard';
import AdminBooking from '../../pages/admin page/booking/booking';
import AdminCategories from '../../Pages/Admin Page/Categories/categories';
import AdminFeedback from '../../Pages/Admin Page/Feedback/feedback';
import AdminGallery from '../../Pages/Admin Page/Gallery/gallery';
import AdminUser from '../../Pages/Admin Page/Users/user';
import AdminRooms from '../../Pages/Admin Page/Rooms/rooms';
import NotFound from './NotFound';
import AdminHeader from './AdminHeader';

const LayOut = () => {
  return (
    <div className="w-full max-h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[20%] h-screen bg-blue-400 fixed top-0 left-0">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="w-[80%] ml-[20%] bg-slate-900 text-white flex flex-col h-screen">
        {/* Header stays fixed at the top */}
        <div className="flex-shrink-0">
          <AdminHeader />
        </div>

        {/* Scrollable page content */}
        <div className="flex-grow overflow-y-auto p-5">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/booking" element={<AdminBooking />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/rooms" element={<AdminRooms />} />
            <Route path="/users" element={<AdminUser />} />
            <Route path="/feedback" element={<AdminFeedback />} />
            <Route path="/gallery" element={<AdminGallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default LayOut;
