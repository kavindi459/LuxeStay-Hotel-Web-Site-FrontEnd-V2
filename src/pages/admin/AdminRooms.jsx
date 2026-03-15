import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Images } from 'lucide-react';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, room: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, room: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [form, setForm] = useState({ category: '', maxGuests: 2, description: '', availability: true, photos: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, catsRes] = await Promise.all([
        api.get('/api/room/get'),
        api.get('/api/category/get?limit=100'),
      ]);
      setRooms(roomsRes.data.data || []);
      setCategories(catsRes.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ category: categories[0]?._id || '', maxGuests: 2, description: '', availability: true, photos: [] });
    setModal({ open: true, room: null });
  };

  const openEdit = (room) => {
    const catId = (room.category && typeof room.category === 'object') ? room.category._id : room.category;
    setForm({
      category: catId || '',
      maxGuests: room.maxGuests || 2,
      description: room.description || '',
      availability: room.availability ?? true,
      photos: room.photos || [],
    });
    setModal({ open: true, room });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((p) => ({ ...p, photos: [...p.photos, ev.target.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    if (!form.category) { toast.error('Please select a category'); return; }
    setSaving(true);
    try {
      if (modal.room) {
        await api.put(`/api/room/update/${modal.room._id}`, {
          category: form.category,
          maxGuests: form.maxGuests,
          description: form.description,
          availability: form.availability,
          photos: form.photos,
        });
        toast.success('Room updated!');
      } else {
        await api.post('/api/room/create', {
          category: form.category,
          maxGuests: form.maxGuests,
          description: form.description,
          availability: form.availability,
          photos: form.photos,
        });
        toast.success('Room created!');
      }
      setModal({ open: false, room: null });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/room/delete/${deleteModal.room._id}`);
      toast.success('Room deleted!');
      setDeleteModal({ open: false, room: null });
      fetchData();
    } catch {
      toast.error('Failed to delete room');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = categoryFilter === 'all' ? rooms : rooms.filter((r) => {
    const catId = (r.category && typeof r.category === 'object') ? r.category._id : r.category;
    return catId === categoryFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add Room
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Room ID', 'Category', 'Max Guests', 'Availability', 'Photos', 'Description', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No rooms found</td></tr>
                ) : filtered.map((room) => {
                  const cat = (room.category && typeof room.category === 'object') ? room.category : categories.find((c) => c._id === room.category) || {};
                  return (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-800">#{room.roomID}</td>
                      <td className="px-4 py-3 text-gray-700">{cat.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{room.maxGuests}</td>
                      <td className="px-4 py-3"><Badge status={room.availability ? 'available' : 'occupied'} /></td>
                      <td className="px-4 py-3 flex items-center gap-1 text-gray-500">
                        <Images size={14} /> {room.photos?.length || 0}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{room.description || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(room)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>
                          <button onClick={() => setDeleteModal({ open: true, room })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, room: null })} title={modal.room ? 'Edit Room' : 'Add New Room'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name} — ${c.price}/night</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
            <input type="number" min={1} max={20} value={form.maxGuests} onChange={(e) => setForm((p) => ({ ...p, maxGuests: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="avail" checked={form.availability} onChange={(e) => setForm((p) => ({ ...p, availability: e.target.checked }))} className="rounded" />
            <label htmlFor="avail" className="text-sm font-medium text-gray-700">Available</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos (upload multiple)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
            {form.photos.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-14 h-14 object-cover rounded-lg border" />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModal({ open: false, room: null })}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{modal.room ? 'Update' : 'Create'} Room</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, room: null })} title="Delete Room">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete room <span className="font-bold">#{deleteModal.room?.roomID}</span>? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, room: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete Room</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRooms;
