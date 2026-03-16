import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';
import { Search, ToggleLeft, ToggleRight, ShieldCheck, User, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';

const ITEMS_PER_PAGE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users/');
      setUsers(res.data.data || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.firstName?.toLowerCase().includes(s) || u.lastName?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleStatus = async (userId) => {
    setActionLoading(userId + 'status');
    try {
      const res = await api.patch(`/api/admin/users/${userId}/status`);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isActive: res.data.data.isActive } : u));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to toggle user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/users/delete/${deleteModal.user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteModal.user._id));
      toast.success('User deleted!');
      setDeleteModal({ open: false, user: null });
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const changeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    setActionLoading(userId + 'role');
    try {
      const res = await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: res.data.data.role } : u));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to change user role');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No users found</td></tr>
                ) : paginated.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.profilePic || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=1e40af&color=fff`}
                          alt={u.firstName} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-medium text-gray-900 whitespace-nowrap">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                    <td className="px-4 py-3"><Badge status={u.role?.toLowerCase()} /></td>
                    <td className="px-4 py-3"><Badge status={u.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(u._id)}
                          disabled={actionLoading === u._id + 'status'}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          {u.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button
                          onClick={() => changeRole(u._id, u.role)}
                          disabled={actionLoading === u._id + 'role'}
                          title={u.role === 'Admin' ? 'Demote to User' : 'Promote to Admin'}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          {u.role === 'Admin' ? <User size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, user: u })}
                          title="Delete User"
                          className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Previous</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, user: null })} title="Delete User">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete{' '}
            <span className="font-bold text-gray-900">{deleteModal.user?.firstName} {deleteModal.user?.lastName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, user: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
