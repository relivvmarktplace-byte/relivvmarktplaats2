import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WishlistButton = ({ productId, size = 'md' }) => {
  const { t } = useTranslation();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  useEffect(() => {
    checkWishlist();
  }, [productId]);

  const checkWishlist = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/wishlist/check/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInWishlist(response.data.is_in_wishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error(t('auth.loginFailed'));
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await axios.delete(
          `${BACKEND_URL}/api/wishlist/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(false);
        toast.success(t('wishlist.removedFromWishlist'));
      } else {
        await axios.post(
          `${BACKEND_URL}/api/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        toast.success(t('wishlist.addedToWishlist') + ' ❤️');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error(t('wishlist.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${sizes[size]} transition-all duration-300 hover:scale-110 ${
        loading ? 'opacity-50' : ''
      }`}
      title={isInWishlist ? t('wishlist.removeFromWishlist') : t('wishlist.addToWishlist')}
    >
      {isInWishlist ? '❤️' : '🤍'}
    </button>
  );
};

export default WishlistButton;
