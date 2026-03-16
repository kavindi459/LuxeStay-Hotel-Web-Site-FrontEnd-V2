import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import StarRating from '../ui/StarRating.jsx';
import TestimonialsSection from './TestimonialsSection.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.js';

const ReviewsCarousel = ({ reviews }) => {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState(null); // 'left' | 'right'
  const sectionRef = useScrollReveal(0.08);
  const count = reviews.length;

  const goTo = useCallback((idx, dir) => {
    setAnimDir(dir);
    setActive(((idx % count) + count) % count);
  }, [count]);

  /* Auto-advance every 5s */
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => goTo(active + 1, 'right'), 5000);
    return () => clearInterval(t);
  }, [active, count, goTo]);

  // if (count === 0) return <TestimonialsSection />;
  if (count === 0) return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
        <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Guest Reviews</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Guests Say</h2>
        <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full mb-10" />
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Quote size={40} className="text-amber-200" />
          <p className="text-lg font-medium text-gray-500">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      </div>
    </section>
  );

  /* Build visible slots: prev, active, next */
  const prev = ((active - 1) + count) % count;
  const next = (active + 1) % count;

  const slots = count === 1
    ? [{ idx: active, pos: 'center' }]
    : count === 2
      ? [{ idx: prev, pos: 'left' }, { idx: active, pos: 'center' }]
      : [
          { idx: prev,   pos: 'left'   },
          { idx: active, pos: 'center' },
          { idx: next,   pos: 'right'  },
        ];

  const posStyle = {
    left: {
      transform: 'translateX(-55%) scale(0.82) rotateY(18deg)',
      opacity: 0.45,
      zIndex: 1,
      filter: 'blur(1px)',
    },
    center: {
      transform: 'translateX(0%) scale(1) rotateY(0deg)',
      opacity: 1,
      zIndex: 10,
      filter: 'none',
    },
    right: {
      transform: 'translateX(55%) scale(0.82) rotateY(-18deg)',
      opacity: 0.45,
      zIndex: 1,
      filter: 'blur(1px)',
    },
  };

  const ReviewCard = ({ review }) => {
    const u = review.userId || {};
    const categoryName = review.roomId?.category?.name || 'Hotel Room';
    const avatarUrl = u.profilePic ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        (u.firstName || 'G') + ' ' + (u.lastName || '')
      )}&background=1e40af&color=fff&size=64`;

    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-5 h-full">
        {/* Top: quote + stars */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <Quote size={22} className="text-amber-500" />
          </div>
          <StarRating rating={review.rating} size="md" />
        </div>

        {/* Comment */}
        <p className="text-gray-600 text-sm leading-relaxed italic flex-1 line-clamp-4">
          {review.comment
            ? `"${review.comment}"`
            : <span className="text-gray-400">No comment provided.</span>
          }
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={u.firstName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-200 shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-xs text-amber-600 font-medium truncate">{categoryName}</p>
          </div>
          <span className="ml-auto text-xs text-gray-400 shrink-0">
            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Guest Reviews</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Guests Say</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3D Stage */}
        <div
          className="reveal relative flex items-center justify-center"
          style={{ perspective: '1200px', minHeight: '340px' }}
        >
          {slots.map(({ idx, pos }) => (
            <div
              key={idx}
              onClick={() => {
                if (pos === 'left')  goTo(active - 1, 'left');
                if (pos === 'right') goTo(active + 1, 'right');
              }}
              style={{
                position: 'absolute',
                width: '100%',
                maxWidth: '480px',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: pos !== 'center' ? 'pointer' : 'default',
                ...posStyle[pos],
              }}
            >
              <ReviewCard review={reviews[idx]} />
            </div>
          ))}
        </div>

        {/* Controls */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-6 mt-14">
            {/* Prev */}
            <button
              onClick={() => goTo(active - 1, 'left')}
              className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-amber-600 hover:border-amber-300 hover:shadow-amber-100/60 transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > active ? 'right' : 'left')}
                  className={`rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-8 h-2.5 bg-amber-500'
                      : 'w-2.5 h-2.5 bg-gray-200 hover:bg-amber-300'
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => goTo(active + 1, 'right')}
              className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-amber-600 hover:border-amber-300 hover:shadow-amber-100/60 transition-all duration-200 hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Counter */}
        {count > 1 && (
          <p className="text-center text-xs text-gray-400 mt-3 tabular-nums">
            {active + 1} / {count}
          </p>
        )}
      </div>
    </section>
  );
};

export default ReviewsCarousel;
