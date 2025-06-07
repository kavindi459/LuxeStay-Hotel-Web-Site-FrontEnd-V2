import React from 'react';

const AdminBooking = () => {
  // Sample static booking data
  const bookings = [
    {
      bookingId: 'B001',
      email: 'guest1@example.com',
      roomId: 'Room101',
      checkInDate: '2025-06-10',
      checkOutDate: '2025-06-12',
      totalAmount: 300,
      status: 'confirmed',
      reason: '',
    },
    {
      bookingId: 'B002',
      email: 'guest2@example.com',
      roomId: 'Room102',
      checkInDate: '2025-07-01',
      checkOutDate: '2025-07-05',
      totalAmount: 500,
      status: 'pending',
      reason: '',
    },
    {
      bookingId: 'B003',
      email: 'guest3@example.com',
      roomId: 'Room103',
      checkInDate: '2025-08-15',
      checkOutDate: '2025-08-20',
      totalAmount: 750,
      status: 'cancelled',
      reason: 'Personal emergency',
    },
  ];


const getStatusColor =(status) => {
  if (status === 'confirmed') return 'text-green-600 font-semibold';
  if (status === 'pending') return 'text-yellow-600 font-semibold';
  if (status === 'cancelled') return 'text-red-600 font-semibold';
  return '';
}

  return (
    <div className="w-full p-5">
      <h1 className="text-2xl font-bold mb-4">Booking</h1>

      <table className="w-full border border-collapse border-gray-300">
        <thead className="bg-gray-800 text-left">
          <tr>
            <th className="border px-4 py-2">Booking ID</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Room</th>
            <th className="border px-4 py-2">Check-In</th>
            <th className="border px-4 py-2">Check-Out</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="hover:bg-gray-800">
              <td className="border px-4 py-2">{booking.bookingId}</td>
              <td className="border px-4 py-2">{booking.email}</td>
              <td className="border px-4 py-2">{booking.roomId}</td>
              <td className="border px-4 py-2">{booking.checkInDate}</td>
              <td className="border px-4 py-2">{booking.checkOutDate}</td>
              <td className="border px-4 py-2">${booking.totalAmount}</td>
              <td className={`border border-white px-4 py-2 ${getStatusColor(booking.status)}`}>
                {booking.status}
              </td>
              <td className="border px-4 py-2">
                {booking.reason || <span className="text-gray-400 italic">-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default AdminBooking;
