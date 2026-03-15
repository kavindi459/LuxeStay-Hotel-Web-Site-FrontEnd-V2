import { useState, useRef } from 'react';
import Navbar from '../../components/client/Navbar.jsx';
import Footer from '../../components/client/Footer.jsx';
import { useAuthStore } from '../../store/authStore.jsx';
import { formatDate } from '../../utils/formatDate.js';
import api from '../../config/api.js';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Camera, Shield, CheckCircle, XCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, dispatch } = useAuthStore();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [pwForm, setPwForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handlePwChange = (e) => setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('firstName', form.firstName);
      fd.append('lastName', form.lastName);
      fd.append('phone', form.phone);
      const res = await api.put(`/api/users/update/${user._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch({ type: 'UPDATE_USER', payload: res.data.data });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('profilePic', file);
    fd.append('firstName', user?.firstName || '');
    fd.append('lastName', user?.lastName || '');
    fd.append('phone', user?.phone || '');
    try {
      const res = await api.put(`/api/users/update/${user._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch({ type: 'UPDATE_USER', payload: res.data.data });
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (pwForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    try {
      const fd = new FormData();
      fd.append('firstName', user?.firstName || '');
      fd.append('lastName', user?.lastName || '');
      fd.append('phone', user?.phone || '');
      fd.append('password', pwForm.password);
      await api.put(`/api/users/update/${user._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPwForm({ password: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="space-y-6">
          {/* Avatar & Read-Only Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <img
                  src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1e40af&color=fff&size=128`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-blue-800 text-white p-1.5 rounded-full hover:bg-blue-900 shadow-md"
                >
                  <Camera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge status={user?.role?.toLowerCase()} />
                  {user?.isEmailVerified ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={12} /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-500">
                      <XCircle size={12} /> Not Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Member Since</p>
                <p className="text-sm font-medium text-gray-800">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Account Status</p>
                <Badge status={user?.isActive ? 'active' : 'inactive'} />
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input value={user?.email || ''} readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 cursor-not-allowed text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
              </div>
              <Button type="submit" loading={loading}>Save Changes</Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={20} className="text-blue-800" />
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" name="password" value={pwForm.password} onChange={handlePwChange} required
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required
                  placeholder="Repeat new password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
              </div>
              <Button type="submit" loading={pwLoading} variant="outline">Update Password</Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
