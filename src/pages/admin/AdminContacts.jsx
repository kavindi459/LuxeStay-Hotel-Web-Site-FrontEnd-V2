import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import toast from 'react-hot-toast';
import { Mail, Trash2, Eye, MailOpen, Search, RefreshCw, Inbox } from 'lucide-react';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState({ open: false, msg: null });
  const [deleting, setDeleting] = useState(null); // id being deleted

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/contact/');
      setMessages(res.data.data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const handleView = async (msg) => {
    setViewModal({ open: true, msg });
    // Mark as read if not already
    if (!msg.isRead) {
      try {
        await api.patch(`/api/contact/${msg._id}/read`);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (viewModal.msg?._id === id) setViewModal({ open: false, msg: null });
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = messages.filter((m) => !m.isRead);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((m) => api.patch(`/api/contact/${m._id}/read`)));
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      toast.success('All messages marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const filtered = messages.filter((m) => {
    // Tab filter
    if (filter === 'unread' && m.isRead) return false;
    if (filter === 'read' && !m.isRead) return false;
    // Search filter
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Mail size={22} className="text-rose-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-xs text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-sm text-blue-800 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              <MailOpen size={15} /> Mark all read
            </button>
          )}
          <button
            onClick={fetchMessages}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                filter === f ? 'bg-blue-800 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>

        <span className="text-xs text-gray-400 ml-auto">{filtered.length} message{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Message List */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
          <Inbox size={40} className="text-gray-300" />
          <p className="font-medium">No messages found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((msg) => (
              <div
                key={msg._id}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                  !msg.isRead ? 'bg-rose-50 hover:bg-rose-100/60' : ''
                }`}
              >
                {/* Dot indicator */}
                <div className="mt-1.5 shrink-0">
                  {!msg.isRead ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleView(msg)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${!msg.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                    {!msg.isRead && (
                      <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className={`text-sm mt-0.5 ${!msg.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-lg">{msg.message}</p>
                </div>

                {/* Date + Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleView(msg)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    disabled={deleting === msg._id}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"
                    title="Delete"
                  >
                    {deleting === msg._id ? <RefreshCw size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Message Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, msg: null })}
        title="Message Details"
      >
        {viewModal.msg && (
          <div className="space-y-4">
            {/* Sender Info */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm shrink-0">
                {viewModal.msg.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{viewModal.msg.name}</p>
                <a href={`mailto:${viewModal.msg.email}`} className="text-sm text-blue-700 hover:underline">
                  {viewModal.msg.email}
                </a>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                {new Date(viewModal.msg.createdAt).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>

            {/* Subject */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Subject</p>
              <p className="text-sm font-semibold text-gray-800">{viewModal.msg.subject}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Message</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {viewModal.msg.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <a
                href={`mailto:${viewModal.msg.email}?subject=Re: ${viewModal.msg.subject}`}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Mail size={15} /> Reply via Email
              </a>
              <button
                onClick={() => handleDelete(viewModal.msg._id)}
                disabled={deleting === viewModal.msg._id}
                className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminContacts;
