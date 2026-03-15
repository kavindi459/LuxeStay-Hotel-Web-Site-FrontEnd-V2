export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const formatCurrency = (amount) =>
  `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export const calculateNights = (checkIn, checkOut) =>
  Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
