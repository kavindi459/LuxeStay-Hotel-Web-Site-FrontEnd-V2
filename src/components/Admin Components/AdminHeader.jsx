import React from 'react';
import AdminuserTag from './AdminuserTag';

const AdminHeader = () => {
  return (
    <header className="h-20 w-full bg-gray-800 flex items-center justify-between px-6 shadow-md">
      {/* Logo or Title */}
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Right side: User Info + Logout */}
      <div className="flex items-center gap-4">
        <AdminuserTag/>
      </div>
    </header>
  );
};

export default AdminHeader;
