import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeaderNew from './AdminHeader.jsx';
import AdminDashboard from '../../Pages/Admin Page/AdminDashboard.jsx';
import AdminBookings from '../../pages/Admin Page/AdminBookings.jsx';
import AdminRooms from '../../pages/Admin Page/AdminRooms.jsx';
import AdminCategories from '../../pages/Admin Page/AdminCategories.jsx';
import AdminUsers from '../../pages/Admin Page/AdminUsers.jsx';
import AdminGallery from '../../pages/Admin Page/AdminGallery.jsx';
import AdminReviews from '../../pages/Admin Page/AdminReviews.jsx';
import AdminContacts from '../../pages/Admin Page/AdminContacts.jsx';
import AdminDestinations from '../../pages/Admin Page/AdminDestinations.jsx';
import AdminBgImages from '../../pages/Admin Page/AdminBgImages.jsx';

const LayOut = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="w-56 shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeaderNew />
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/rooms" element={<AdminRooms />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/gallery" element={<AdminGallery />} />
            <Route path="/reviews" element={<AdminReviews />} />
            <Route path="/contacts" element={<AdminContacts />} />
            <Route path="/destinations" element={<AdminDestinations />} />
            <Route path="/bg-images" element={<AdminBgImages />} />
            {/* Legacy routes kept for backward compatibility */}
            <Route path="/booking" element={<AdminBookings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default LayOut;
