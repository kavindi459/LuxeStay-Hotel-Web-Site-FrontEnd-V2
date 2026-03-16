import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminSidebar from '../Components/admin/AdminSidebar.jsx';
import AdminHeaderNew from '../Components/admin/AdminHeader.jsx';
import AdminDashboard from '../Pages/admin/AdminDashboard.jsx';
import AdminBookings from '../Pages/admin/AdminBookings.jsx';
import AdminRooms from '../Pages/admin/AdminRooms.jsx';
import AdminCategories from '../Pages/admin/AdminCategories.jsx';
import AdminUsers from '../Pages/admin/AdminUsers.jsx';
import AdminGallery from '../Pages/admin/AdminGallery.jsx';
import AdminReviews from '../Pages/admin/AdminReviews.jsx';
import AdminContacts from '../Pages/admin/AdminContacts.jsx';
import AdminDestinations from '../Pages/admin/AdminDestinations.jsx';
import AdminBgImages from '../Pages/admin/AdminBgImages.jsx';

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
