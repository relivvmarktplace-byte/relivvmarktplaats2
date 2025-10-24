import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';

const SellerRating = ({ 
  rating = 0, 
  ratingCount = 0, 
  isFeaturedSeller = false,
  size = 'sm',
  showCount = true,
  className = "" 
}) => {
  const { t } = useTranslation();
  
  // Generate stars display
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const starSize = size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm';
    
    return (
      <div className={`flex items-center space-x-1 ${starSize}`}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {/* Half star */}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">☆</span>
        ))}
      </div>
    );
  };

  const getRatingText = () => {
    if (rating === 0) return t('rating.noRating');
    return `${rating.toFixed(1)}`;
  };

  const getCountText = () => {
    if (ratingCount === 0) return '';
    const reviewKey = ratingCount === 1 ? 'rating.reviews_one' : 'rating.reviews_other';
    return `(${ratingCount} ${t(reviewKey)})`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Featured Seller Badge */}
      {isFeaturedSeller && (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1">
          ⭐ {t('rating.featured', { defaultValue: 'Top Verkoper' })}
        </Badge>
      )}
      
      {/* Stars */}
      {renderStars()}
      
      {/* Rating Number */}
      <span className={`font-semibold text-slate-700 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
        {getRatingText()}
      </span>
      
      {/* Rating Count */}
      {showCount && ratingCount > 0 && (
        <span className={`text-slate-500 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {getCountText()}
        </span>
      )}
    </div>
  );
};

// Star Rating Input Component (for giving ratings)
export const StarRatingInput = ({ 
  rating, 
  onRatingChange, 
  size = 'lg',
  className = "" 
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const starSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg';
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${starSize} transition-colors hover:scale-110 transform transition-transform`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <span 
            className={
              star <= (hoverRating || rating) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default SellerRating;