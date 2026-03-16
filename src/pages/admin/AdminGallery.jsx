import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { Trash2, Upload, Star, RefreshCw, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

const AdminGallery = () => {
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [editModal,   setEditModal]   = useState({ open: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [form,        setForm]        = useState({ name: '', description: '', image: null });
  const [editForm,    setEditForm]    = useState({ name: '', description: '', image: null });
  const [page,        setPage]        = useState(1);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/gallery/get');
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setForm((p) => ({ ...p, image: e.target.files[0] }));
  };

  const handleUpload = async () => {
    if (!form.name || !form.image) { toast.error('Name and image are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('image', form.image);
      await api.post('/api/gallery/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Gallery item added!');
      setUploadModal(false);
      setForm({ name: '', description: '', image: null });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/gallery/delete/${deleteModal.item._id}`);
      toast.success('Item deleted!');
      setDeleteModal({ open: false, item: null });
      fetchItems();
    } catch {
      toast.error('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (item) => {
    setEditForm({ name: item.name, description: item.description || '', image: null });
    setEditModal({ open: true, item });
  };

  const handleUpdate = async () => {
    if (!editForm.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', editForm.name);
      fd.append('description', editForm.description);
      if (editForm.image) fd.append('image', editForm.image);
      await api.put(`/api/gallery/update/${editModal.item._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Gallery item updated!');
      setEditModal({ open: false, item: null });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const res = await api.patch(`/api/gallery/featured/${item._id}`);
      setItems((prev) => prev.map((i) => i._id === item._id ? res.data.data : i));
      toast.success(res.data.data.isFeatured ? 'Added to featured!' : 'Removed from featured');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end gap-2">
        <button onClick={fetchItems} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
        <Button onClick={() => setUploadModal(true)} className="flex items-center gap-2">
          <Upload size={16} /> Upload Image
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No gallery items yet. Upload the first one!</div>
      ) : (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((item) => (
            <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Featured badge */}
              {item.isFeatured && (
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    <Star size={10} fill="white" /> Featured
                  </span>
                </div>
              )}

              {/* Star toggle — top right */}
              <button
                onClick={() => handleToggleFeatured(item)}
                title={item.isFeatured ? 'Remove from featured' : 'Add to featured'}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow ${
                  item.isFeatured
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-white/80 text-gray-400 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                }`}
              >
                <Star size={13} fill={item.isFeatured ? 'white' : 'none'} />
              </button>

              {/* Edit / Delete buttons */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(item)}
                  className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                  title="Edit"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, item })}
                  className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="p-3">
                <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                {item.description && <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
        {Math.ceil(items.length / PAGE_SIZE) > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500">Page {page} of {Math.ceil(items.length / PAGE_SIZE)} ({items.length} images)</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.ceil(items.length / PAGE_SIZE) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${n === page ? 'bg-blue-800 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(Math.ceil(items.length / PAGE_SIZE), p + 1))} disabled={page === Math.ceil(items.length / PAGE_SIZE)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
        </>
      )}

      {/* Upload Modal */}
      <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload Gallery Image">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Image title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
            {form.image && (
              <img src={URL.createObjectURL(form.image)} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUpload} loading={saving}>Upload</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, item: null })} title="Edit Gallery Item">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Image title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace Image <span className="text-gray-400 font-normal">(optional)</span></label>
            {editModal.item && !editForm.image && (
              <img src={editModal.item.image} alt="" className="mb-2 w-full h-32 object-cover rounded-lg border" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setEditForm((p) => ({ ...p, image: e.target.files[0] }))}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
            {editForm.image && (
              <img src={URL.createObjectURL(editForm.image)} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditModal({ open: false, item: null })}>Cancel</Button>
            <Button onClick={handleUpdate} loading={saving}>Update</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, item: null })} title="Delete Gallery Item">
        <div className="space-y-4">
          <p className="text-gray-600">Delete <span className="font-bold">{deleteModal.item?.name}</span>? This cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, item: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGallery;
