import { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Pencil, Trash2, Globe, Upload, Link2, Star, RefreshCw } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';
import api from '../../config/api.js';

const EMPTY_FORM = { name: '', location: '', description: '', imageUrl: '' };

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  /* Add / Edit modal */
  const [modal,   setModal]   = useState({ open: false, editing: null }); // editing = destination object
  const [tab,     setTab]     = useState('file'); // 'file' | 'url'
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  /* Delete confirm */
  const [deleteId, setDeleteId] = useState(null);

  /* ── Fetch ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/destination/get');
      setDestinations(res.data.data || []);
    } catch {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── Modal helpers ── */
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview('');
    setTab('file');
    setModal({ open: true, editing: null });
  };

  const openEdit = (dest) => {
    setForm({ name: dest.name, location: dest.location, description: dest.description, imageUrl: dest.image });
    setFile(null);
    setPreview(dest.image || '');
    setTab('url'); // when editing, default to URL tab (current image shown)
    setModal({ open: true, editing: dest });
  };

  const closeModal = () => {
    setModal({ open: false, editing: null });
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ── Save (create or update) ── */
  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }

    /* Validate image: need either a file (file tab) or URL (url tab) or existing image (edit) */
    const hasFile = tab === 'file' && file;
    const hasUrl  = tab === 'url'  && form.imageUrl.trim();
    const hasExisting = modal.editing?.image;

    if (!hasFile && !hasUrl && !hasExisting) {
      toast.error('Please select or provide an image');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name',        form.name.trim());
      fd.append('location',    form.location.trim());
      fd.append('description', form.description.trim());

      if (hasFile) {
        fd.append('image', file);
      } else if (hasUrl) {
        fd.append('imageUrl', form.imageUrl.trim());
      }
      // if editing + no new file/url → backend keeps existing image

      let res;
      if (modal.editing) {
        res = await api.put(`/api/destination/${modal.editing._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setDestinations((prev) =>
          prev.map((d) => d._id === modal.editing._id ? res.data.data : d)
        );
        toast.success('Destination updated!');
      } else {
        res = await api.post('/api/destination/create', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setDestinations((prev) => [...prev, res.data.data]);
        toast.success('Destination added!');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle Featured ── */
  const handleToggleFeatured = async (dest) => {
    try {
      const res = await api.patch(`/api/destination/${dest._id}/featured`);
      setDestinations((prev) =>
        prev.map((d) => d._id === dest._id ? res.data.data : d)
      );
      toast.success(res.data.data.isFeatured ? 'Added to carousel!' : 'Removed from carousel');
    } catch {
      toast.error('Failed to update');
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/destination/${deleteId}`);
      setDestinations((prev) => prev.filter((d) => d._id !== deleteId));
      setDeleteId(null);
      toast.success('Destination deleted');
    } catch {
      toast.error('Failed to delete destination');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Globe size={20} className="text-blue-800" /> Manage Destinations
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            These appear as a carousel on the home page below the CTA section.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors"
          >
            <Plus size={16} /> Add Destination
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100">
          <Globe size={40} className="mx-auto mb-3 opacity-30" />
          <p>No destinations yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest, i) => (
            <div
              key={dest._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                {dest.image ? (
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <MapPin size={36} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full border border-white/30">
                    #{i + 1}
                  </span>
                </div>
                {/* Featured badge */}
                {dest.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                      <Star size={10} fill="white" /> Featured
                    </span>
                  </div>
                )}
                {/* Star toggle button */}
                <button
                  onClick={() => handleToggleFeatured(dest)}
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow ${
                    dest.isFeatured
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-white/80 text-gray-400 hover:bg-amber-50 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                  }`}
                  title={dest.isFeatured ? 'Remove from carousel' : 'Add to carousel'}
                >
                  <Star size={14} fill={dest.isFeatured ? 'white' : 'none'} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{dest.name}</h3>
                {dest.location && (
                  <p className="text-amber-600 text-xs font-medium flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {dest.location}
                  </p>
                )}
                {dest.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{dest.description}</p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleToggleFeatured(dest)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      dest.isFeatured
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'text-gray-500 bg-gray-50 hover:bg-amber-50 hover:text-amber-600'
                    }`}
                  >
                    <Star size={13} fill={dest.isFeatured ? 'currentColor' : 'none'} />
                    {dest.isFeatured ? 'Featured' : 'Feature'}
                  </button>
                  <button
                    onClick={() => openEdit(dest)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(dest._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.editing ? 'Edit Destination' : 'Add Destination'}
      >
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Maldives Paradise"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Maldives, Indian Ocean"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short description of this destination..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            />
          </div>

          {/* Image — tab switcher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-red-500">*</span>
            </label>

            <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold mb-3">
              <button
                type="button"
                onClick={() => { setTab('file'); setPreview(''); setFile(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors ${
                  tab === 'file' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload size={14} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => { setTab('url'); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors ${
                  tab === 'url' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Link2 size={14} /> Paste URL
              </button>
            </div>

            {tab === 'file' && (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-800 hover:bg-blue-50 transition-colors">
                <Upload size={24} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">
                  {file ? file.name : 'Click to choose image'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {tab === 'url' && (
              <input
                value={form.imageUrl}
                onChange={(e) => {
                  setForm((p) => ({ ...p, imageUrl: e.target.value }));
                  setPreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            )}

            {/* Preview */}
            {preview && (
              <div className="mt-3 h-32 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors disabled:opacity-60"
            >
              {saving ? <Spinner size="sm" /> : null}
              {saving ? 'Saving…' : modal.editing ? 'Save Changes' : 'Add Destination'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Destination">
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete this destination? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60"
            >
              {deleting ? <Spinner size="sm" /> : <Trash2 size={14} />}
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDestinations;
