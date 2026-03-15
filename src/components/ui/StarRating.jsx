const StarRating = ({ rating = 0, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size] || sizeClasses.md}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? 'text-amber-500' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
