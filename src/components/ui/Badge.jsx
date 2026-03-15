const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border border-green-300',
  cancelled: 'bg-red-100 text-red-800 border border-red-300',
  available: 'bg-green-100 text-green-800 border border-green-300',
  occupied: 'bg-red-100 text-red-800 border border-red-300',
  active: 'bg-green-100 text-green-800 border border-green-300',
  inactive: 'bg-gray-100 text-gray-600 border border-gray-300',
  admin: 'bg-blue-100 text-blue-800 border border-blue-300',
  user: 'bg-purple-100 text-purple-800 border border-purple-300',
};

const Badge = ({ status, className = '' }) => {
  const key = (status || '').toLowerCase();
  const style = statusStyles[key] || 'bg-gray-100 text-gray-700 border border-gray-300';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${style} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;
