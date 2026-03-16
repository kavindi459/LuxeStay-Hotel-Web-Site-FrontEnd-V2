import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, DollarSign, Star, RefreshCw } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, cat: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, cat: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', features: '', image: '', imageFile: null });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/category/get?limit=100');
      setCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ name: '', price: '', description: '', features: '', image: '' });
    setModal({ open: true, cat: null });
  };

  const openEdit = (cat) => {
    setForm({
      name: cat.name || '',
      price: cat.price || '',
      description: cat.description || '',
      features: (cat.features || []).join(', '),
      image: cat.image || '',
      imageFile: null,
    });
    setModal({ open: true, cat });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, image: ev.target.result, imageFile: file }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', Number(form.price));
      fd.append('description', form.description);
      const features = form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [];
      features.forEach((f) => fd.append('features', f));
      if (form.imageFile) fd.append('image', form.imageFile);
      if (modal.cat) {
        await api.put(`/api/category/update/${modal.cat._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated!');
      } else {
        await api.post('/api/category/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created!');
      }
      setModal({ open: false, cat: null });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (cat) => {
    setTogglingId(cat._id);
    try {
      const res = await api.patch(`/api/category/toggle-featured/${cat._id}`);
      setCategories((prev) => prev.map((c) => c._id === cat._id ? { ...c, isFeatured: res.data.data.isFeatured } : c));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to toggle featured');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/category/delete/${deleteModal.cat._id}`);
      toast.success('Category deleted!');
      setDeleteModal({ open: false, cat: null });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end gap-2">
        <button onClick={fetchCategories} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No categories yet. Add one to get started!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-blue-50 flex items-center justify-center text-blue-200">
                    <DollarSign size={40} />
                  </div>
                )}
                <button
                  onClick={() => handleToggleFeatured(cat)}
                  disabled={togglingId === cat._id}
                  title={cat.isFeatured ? 'Remove from Home' : 'Feature on Home'}
                  className={`absolute top-2 right-2 p-1.5 rounded-full shadow transition-colors ${
                    cat.isFeatured ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-white/80 text-gray-400 hover:bg-amber-50 hover:text-amber-500'
                  }`}
                >
                  <Star size={14} fill={cat.isFeatured ? 'currentColor' : 'none'} />
                </button>
                {cat.isFeatured && (
                  <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                  <span className="text-blue-800 font-bold">${cat.price}<span className="text-gray-400 text-xs font-normal">/night</span></span>
                </div>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{cat.description}</p>
                {cat.features?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cat.features.map((f) => (
                      <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(cat)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteModal({ open: true, cat })} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, cat: null })} title={modal.cat ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Deluxe Suite"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($) <span className="text-red-500">*</span></label>
            <input type="number" min={0} value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="150"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
            <input value={form.features} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
              placeholder="WiFi, Pool, Breakfast, TV"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
            {form.image && <img src={form.image} alt="" className="mt-2 w-full h-28 object-cover rounded-lg" />}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModal({ open: false, cat: null })}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{modal.cat ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, cat: null })} title="Delete Category">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete <span className="font-bold">{deleteModal.cat?.name}</span>? Rooms using this category may be affected.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, cat: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
