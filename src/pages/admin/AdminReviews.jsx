import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Trash2, Star, MessageSquare, Eye, EyeOff, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // all | pending | accepted
  const [ratingFilter, setRatingFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, review: null });
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null); // reviewId being toggled

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/review/all');
      setReviews(res.data.data || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (reviewId) => {
    setToggling(reviewId);
    try {
      const res = await api.patch(`/api/review/${reviewId}/toggle`);
      const updated = res.data.data;
      setReviews((prev) => prev.map((r) => r._id === reviewId ? { ...r, isVisible: updated.isVisible } : r));
      toast.success(updated.isVisible ? 'Review accepted — now showing on homepage' : 'Review hidden from homepage');
    } catch {
      toast.error('Failed to update review');
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/review/${deleteModal.review._id}`);
      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r._id !== deleteModal.review._id));
      setDeleteModal({ open: false, review: null });
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  const totalCount = reviews.length;
  const acceptedCount = reviews.filter((r) => r.isVisible).length;
  const pendingCount = reviews.filter((r) => !r.isVisible).length;

  const filtered = reviews.filter((r) => {
    if (tab === 'accepted' && !r.isVisible) return false;
    if (tab === 'pending' && r.isVisible) return false;
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <MessageSquare size={22} className="text-amber-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reviews Management</h1>
            <p className="text-xs text-gray-400">Accept reviews to show them on the homepage</p>
          </div>
        </div>
        <button onClick={fetchReviews} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-xs text-gray-500 mt-1">Total Reviews</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Showing on Homepage</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Tab filter */}
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
          {[
            { key: 'all', label: `All (${totalCount})` },
            { key: 'pending', label: `Pending (${pendingCount})` },
            { key: 'accepted', label: `Accepted (${acceptedCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setPage(1); }}
              className={`px-4 py-2 font-medium transition-colors ${
                tab === key ? 'bg-blue-800 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Star filter */}
        <select
          value={ratingFilter}
          onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>

        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} review{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Guest', 'Room', 'Rating', 'Comment', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      No reviews found
                    </td>
                  </tr>
                ) : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((r) => (
                  <tr key={r._id} className={`hover:bg-gray-50 transition-colors ${!r.isVisible ? 'bg-amber-50/40' : ''}`}>
                    {/* Guest */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            r.userId?.profilePic ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent((r.userId?.firstName || 'G') + ' ' + (r.userId?.lastName || ''))}&background=1e40af&color=fff&size=40`
                          }
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="text-gray-800 font-medium text-xs whitespace-nowrap">
                            {r.userId?.firstName} {r.userId?.lastName}
                          </p>
                          <p className="text-gray-400 text-xs">{r.userId?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                      Room #{r.roomId?.roomID || 'N/A'}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <StarRating rating={r.rating} size="sm" />
                    </td>

                    {/* Comment */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="truncate text-xs text-gray-500">{r.comment || <span className="italic text-gray-300">No comment</span>}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {r.isVisible ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                          <Eye size={11} /> Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                          <EyeOff size={11} /> Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.isVisible ? (
                          <button
                            onClick={() => toggleVisibility(r._id)}
                            disabled={toggling === r._id}
                            title="Hide from homepage"
                            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleVisibility(r._id)}
                            disabled={toggling === r._id}
                            title="Show on homepage"
                            className="flex items-center gap-1 text-xs font-medium text-green-700 hover:bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={13} /> Accept
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteModal({ open: true, review: r })}
                          title="Delete permanently"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {Math.ceil(filtered.length / PAGE_SIZE) > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Page {page} of {Math.ceil(filtered.length / PAGE_SIZE)} ({filtered.length} reviews)</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.ceil(filtered.length / PAGE_SIZE) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${n === page ? 'bg-blue-800 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))} disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, review: null })}
        title="Delete Review"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete this review? This cannot be undone.
          </p>
          {deleteModal.review && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <StarRating rating={deleteModal.review.rating} size="sm" />
              <p className="mt-1 italic">"{deleteModal.review.comment || 'No comment'}"</p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, review: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReviews;
