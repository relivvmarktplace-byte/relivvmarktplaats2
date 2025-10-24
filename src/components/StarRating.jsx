import React from 'react';

const StarRating = ({ rating, totalStars = 5, size = 'md', interactive = false, onRatingChange }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const handleClick = (index) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const isFilled = index < rating;
        const isHalf = !isFilled && index < Math.ceil(rating) && rating % 1 !== 0;

        return (
          <span
            key={index}
            onClick={() => handleClick(index)}
            className={`${sizes[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          >
            {isFilled ? (
              <span className="text-yellow-400">⭐</span>
            ) : isHalf ? (
              <span className="text-yellow-400">⭐</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export const RatingDisplay = ({ rating, totalReviews, size = 'md' }) => {
  return (
    <div className="flex items-center space-x-2">
      <StarRating rating={rating} size={size} />
      <span className="text-slate-600 text-sm">
        {rating > 0 ? (
          <>
            <span className="font-semibold">{rating.toFixed(1)}</span>
            {totalReviews > 0 && ` (${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'})`}
          </>
        ) : (
          'No reviews yet'
        )}
      </span>
    </div>
  );
};

export default StarRating;
