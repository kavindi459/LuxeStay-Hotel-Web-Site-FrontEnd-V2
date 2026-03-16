import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, BedDouble, Users, X, ChevronLeft, ChevronRight, GripVertical, RefreshCw } from 'lucide-react';

const PAGE_SIZE = 8;

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, room: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, room: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
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

  const removePhoto = (index) => {
    setForm((p) => ({ ...p, photos: p.photos.filter((_, i) => i !== index) }));
  };

  const movePhoto = (index, dir) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= form.photos.length) return;
    setForm((p) => {
      const photos = [...p.photos];
      [photos[index], photos[newIndex]] = [photos[newIndex], photos[index]];
      return { ...p, photos };
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

  const handleToggleStatus = async (room) => {
    setTogglingId(room._id);
    try {
      const res = await api.patch(`/api/room/toggle-status/${room._id}`);
      setRooms((prev) =>
        prev.map((r) => r._id === room._id ? { ...r, availability: res.data.data.availability } : r)
      );
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = categoryFilter === 'all' ? rooms : rooms.filter((r) => {
    const catId = (r.category && typeof r.category === 'object') ? r.category._id : r.category;
    return catId === categoryFilter;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Room
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No rooms found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginated.map((room) => {
            const cat   = (room.category && typeof room.category === 'object') ? room.category : categories.find((c) => c._id === room.category) || {};
            const photo = room.photos?.[0];
            return (
              <div key={room._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">

                {/* Image */}
                <div className="relative h-44">
                  {photo ? (
                    <img src={photo} alt={room.roomID} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200">
                      <BedDouble size={40} />
                    </div>
                  )}

                  {/* Room ID */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                    <span className="text-white text-xs font-mono font-bold">#{room.roomID}</span>
                  </div>

                  {/* Photo count badge */}
                  {room.photos?.length > 1 && (
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      +{room.photos.length} photos
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{cat.name || 'Uncategorized'}</p>
                    {cat.price && (
                      <p className="text-blue-800 font-semibold text-sm">
                        ${cat.price.toLocaleString()}<span className="text-gray-400 text-xs font-normal">/night</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 flex-1">{room.description || '—'}</p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users size={12} />
                    <span>Max {room.maxGuests} guests</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {/* Toggle availability */}
                    <button
                      onClick={() => handleToggleStatus(room)}
                      disabled={togglingId === room._id}
                      title={room.availability ? 'Mark as Occupied' : 'Mark as Available'}
                      className="flex items-center gap-1.5 group"
                    >
                      {room.availability ? (
                        <ToggleRight size={20} className="text-green-500 group-hover:text-green-700 transition-colors" />
                      ) : (
                        <ToggleLeft size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                      )}
                      <Badge status={room.availability ? 'available' : 'occupied'} />
                    </button>

                    {/* Edit / Delete */}
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(room)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteModal({ open: true, room })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">Page {page} of {totalPages} ({filtered.length} rooms)</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${n === page ? 'bg-blue-800 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white">
              <ChevronRight size={14} />
            </button>
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
              <div className="mt-3 space-y-2">
                {form.photos.map((photo, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <img src={photo} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {i === 0 && (
                        <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mb-0.5">Cover</span>
                      )}
                      <p className="text-xs text-gray-400">Photo {i + 1} of {form.photos.length}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move left">
                        <ChevronLeft size={14} />
                      </button>
                      <button type="button" onClick={() => movePhoto(i, 1)} disabled={i === form.photos.length - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move right">
                        <ChevronRight size={14} />
                      </button>
                      <button type="button" onClick={() => removePhoto(i)}
                        className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors" title="Remove photo">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
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
