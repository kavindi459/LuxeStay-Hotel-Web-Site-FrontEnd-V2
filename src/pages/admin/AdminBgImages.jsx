import { useState, useEffect, useRef } from 'react';
import api from '../../config/api.js';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';
import { Image, Plus, Trash2, Save, Link2, Upload } from 'lucide-react';

const SECTION_KEYS = [
  { key: 'homeHero',       label: 'Home — Hero' },
  { key: 'homeRooms',      label: 'Home — Rooms Section' },
  { key: 'homeCategories', label: 'Home — Categories Section' },
  { key: 'homeCta',        label: 'Home — CTA Section' },
  { key: 'rooms',          label: 'Rooms Page' },
  { key: 'gallery',        label: 'Gallery Page' },
  { key: 'about',          label: 'About Page' },
  { key: 'contact',        label: 'Contact Page' },
];

const AdminBgImages = () => {
  const [library,  setLibrary]  = useState([]);
  const [settings, setSettings] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  /* Add image modal */
  const [addOpen,  setAddOpen]  = useState(false);
  const [tab,      setTab]      = useState('file');          // 'file' | 'url'
  const [form,     setForm]     = useState({ name: '', imageUrl: '' });
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState('');
  const [adding,   setAdding]   = useState(false);
  const fileInputRef = useRef(null);

  /* Delete confirm */
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Fetch library + settings ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [libRes, setRes] = await Promise.all([
        api.get('/api/bgimage/get'),
        api.get('/api/bgimage/settings'),
      ]);
      setLibrary(libRes.data.data || []);
      setSettings(setRes.data.data || {});
    } catch {
      toast.error('Failed to load background images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const closeAdd = () => {
    setAddOpen(false);
    setForm({ name: '', imageUrl: '' });
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

  /* ── Add image to library ── */
  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }

    setAdding(true);
    try {
      let res;

      if (tab === 'file') {
        if (!file) { toast.error('Please select an image file'); setAdding(false); return; }
        const fd = new FormData();
        fd.append('name', form.name.trim());
        fd.append('image', file);
        res = await api.post('/api/bgimage/create', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        if (!form.imageUrl.trim()) { toast.error('Please enter an image URL'); setAdding(false); return; }
        res = await api.post('/api/bgimage/create', {
          name:     form.name.trim(),
          imageUrl: form.imageUrl.trim(),
        });
      }

      setLibrary((prev) => [res.data.data, ...prev]);
      toast.success('Image added to library!');
      closeAdd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add image');
    } finally {
      setAdding(false);
    }
  };

  /* ── Delete image from library ── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/bgimage/delete/${deleteId}`);
      setLibrary((prev) => prev.filter((img) => img._id !== deleteId));
      /* Clear from settings if assigned */
      setSettings((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((k) => {
          const img = library.find((i) => i._id === deleteId);
          if (img && updated[k] === img.imageUrl) updated[k] = '';
        });
        return updated;
      });
      toast.success('Image deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  /* ── Save section assignments ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/bgimage/settings', { sections: settings });
      toast.success('Section backgrounds saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Image size={20} className="text-blue-800" /> Background Images
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your image library and assign backgrounds to each page section.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* ── Image Library ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Image Library
          <span className="ml-2 text-xs font-normal text-gray-400">({library.length} images)</span>
        </h2>

        {library.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Image size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No images yet. Click <strong>Add Image</strong> to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {library.map((img) => (
              <div key={img._id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error'; }}
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-800 truncate">{img.name}</p>
                </div>
                <button
                  onClick={() => setDeleteId(img._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section Assignments ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-base font-bold text-gray-900">Assign to Sections</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors disabled:opacity-60"
          >
            {saving ? <Spinner size="sm" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {library.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Add images to the library first, then assign them to sections.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {SECTION_KEYS.map(({ key, label }) => {
              const currentUrl = settings[key] || '';
              return (
                <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Preview */}
                  <div className="h-28 bg-gray-100 relative">
                    {currentUrl ? (
                      <img
                        src={currentUrl}
                        alt={label}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Image size={28} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                      <span className="text-white text-xs font-semibold leading-tight">{label}</span>
                    </div>
                  </div>

                  {/* Select */}
                  <div className="p-3 space-y-2">
                    <select
                      value={currentUrl}
                      onChange={(e) => handleAssign(key, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                    >
                      <option value="">— No Image —</option>
                      {library.map((img) => (
                        <option key={img._id} value={img.imageUrl}>
                          {img.name}
                        </option>
                      ))}
                    </select>
                    {currentUrl && (
                      <button
                        onClick={() => handleAssign(key, '')}
                        className="w-full text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Image Modal ── */}
      <Modal isOpen={addOpen} onClose={closeAdd} title="Add Background Image">
        <div className="space-y-4">

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold">
            <button
              onClick={() => { setTab('file'); setPreview(''); setFile(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors ${
                tab === 'file' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload size={14} /> Upload File
            </button>
            <button
              onClick={() => { setTab('url'); setPreview(''); setFile(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors ${
                tab === 'url' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Link2 size={14} /> Paste URL
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Rooftop Pool Sunset"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          {/* File tab */}
          {tab === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image File <span className="text-red-500">*</span>
              </label>
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
            </div>
          )}

          {/* URL tab */}
          {tab === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => {
                  setForm((p) => ({ ...p, imageUrl: e.target.value }));
                  setPreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={closeAdd}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-colors disabled:opacity-60"
            >
              {adding ? <Spinner size="sm" /> : <Plus size={14} />}
              {adding ? 'Uploading…' : 'Add to Library'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Image">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This image will be removed from the library. Any section currently using it will be cleared.
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

export default AdminBgImages;
