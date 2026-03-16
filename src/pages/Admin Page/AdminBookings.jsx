import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { formatDate, formatCurrency, calculateNights } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';
import { Search, Download, CheckCircle, XCircle, CreditCard, Building2, Trash2, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null, reason: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, booking: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, booking: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/booking/get');
      setBookings(res.data.data || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch = !search || b.email?.toLowerCase().includes(search.toLowerCase()) || b.bookingId?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleConfirm = async (bookingId) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/booking/${bookingId}/confirm`);
      toast.success('Booking confirmed! Confirmation email sent to guest.');
      fetchBookings();
    } catch {
      toast.error('Failed to confirm booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModal.reason.trim()) return;
    setActionLoading(true);
    try {
      await api.patch(`/api/booking/${cancelModal.booking._id}/admin-cancel`, {
        reason: cancelModal.reason,
      });
      toast.success('Booking cancelled! Cancellation email sent to guest.');
      setCancelModal({ open: false, booking: null, reason: '' });
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/api/booking/delete/${deleteModal.booking._id}`);
      toast.success('Booking deleted!');
      setDeleteModal({ open: false, booking: null });
      fetchBookings();
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Booking ID', 'Email', 'Room', 'Check-In', 'Check-Out', 'Nights', 'Status', 'Amount'];
    const rows = filtered.map((b) => {
      const cat = b.roomId?.category || {};
      const nights = calculateNights(b.checkInDate, b.checkOutDate);
      return [b.bookingId, b.email, cat.name || '', formatDate(b.checkInDate), formatDate(b.checkOutDate), nights, b.status, b.totalAmount];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email or booking ID..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={fetchBookings} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
        <button onClick={exportCSV} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Booking ID', 'Guest Email', 'Room', 'Check-In', 'Check-Out', 'Nights', 'Status', 'Payment', 'Amount', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-12 text-gray-400">No bookings found</td></tr>
                ) : paginated.map((b) => {
                  const cat = b.roomId?.category || {};
                  const nights = calculateNights(b.checkInDate, b.checkOutDate);
                  const roomPhoto = b.roomId?.photos?.[0] || cat.image || null;
                  const roomID = b.roomId?.roomID || null;
                  return (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-blue-800 whitespace-nowrap">{b.bookingId}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{b.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {roomPhoto ? (
                            <img src={roomPhoto} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-200 text-xs border border-gray-100">
                              🛏
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-gray-800 font-medium text-xs truncate">{cat.name || 'N/A'}</p>
                            {roomID && <p className="text-gray-400 text-xs font-mono">#{roomID}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(b.checkInDate)}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(b.checkOutDate)}</td>
                      <td className="px-4 py-3 text-gray-600">{nights}</td>
                      <td className="px-4 py-3"><Badge status={b.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            {b.paymentMethod === 'online'
                              ? <CreditCard size={11} className="text-blue-600" />
                              : <Building2 size={11} className="text-gray-500" />}
                            <span className="capitalize">{b.paymentMethod === 'pay_at_hotel' ? 'At Hotel' : 'Online'}</span>
                          </div>
                          <Badge status={b.paymentStatus || 'pending'} />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(b.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setConfirmModal({ open: true, booking: b })}
                                disabled={actionLoading}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirm"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => setCancelModal({ open: true, booking: b, reason: '' })}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteModal({ open: true, booking: b })}
                            className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">
                Previous
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, booking: null })} title="Confirm Booking">
        <div className="space-y-4">
          <p className="text-gray-600">
            Confirm booking <span className="font-bold text-blue-800">#{confirmModal.booking?.bookingId}</span>?
          </p>
          {confirmModal.booking?.paymentMethod === 'pay_at_hotel' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              This is a <strong>Pay at Hotel</strong> booking. Guest will pay on arrival.
            </div>
          )}
          {confirmModal.booking?.paymentMethod === 'online' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              Payment of <strong>{formatCurrency(confirmModal.booking?.totalAmount)}</strong> has been collected online.
            </div>
          )}
          <p className="text-xs text-gray-500">A confirmation email will be sent to the guest automatically.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmModal({ open: false, booking: null })}>Cancel</Button>
            <Button onClick={() => { handleConfirm(confirmModal.booking._id); setConfirmModal({ open: false, booking: null }); }} loading={actionLoading}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModal.open} onClose={() => setCancelModal({ open: false, booking: null, reason: '' })} title="Cancel Booking">
        <div className="space-y-4">
          <p className="text-gray-600">Cancelling booking <span className="font-bold text-blue-800">#{cancelModal.booking?.bookingId}</span></p>
          {cancelModal.booking?.paymentMethod === 'online' && cancelModal.booking?.paymentStatus === 'paid' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
              This booking was <strong>paid online</strong>. Cancelling will mark it as refunded — please process the Stripe refund manually from your Stripe dashboard.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason <span className="text-red-500">*</span></label>
            <textarea
              value={cancelModal.reason}
              onChange={(e) => setCancelModal((p) => ({ ...p, reason: e.target.value }))}
              rows={3}
              placeholder="Provide a reason for cancellation..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setCancelModal({ open: false, booking: null, reason: '' })}>Back</Button>
            <Button variant="danger" onClick={handleCancel} loading={actionLoading} disabled={!cancelModal.reason.trim()}>Confirm Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, booking: null })} title="Delete Booking">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to permanently delete booking <span className="font-bold text-blue-800">#{deleteModal.booking?.bookingId}</span>? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, booking: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={actionLoading}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookings;
