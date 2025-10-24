import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import WishlistButton from './WishlistButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const RecommendedProducts = ({ type = 'recommended', productId = null, title = 'Recommended for You', limit = 6 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [type, productId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      let url = '';

      if (type === 'similar' && productId) {
        url = `${BACKEND_URL}/api/products/${productId}/similar?limit=${limit}`;
      } else if (type === 'trending') {
        url = `${BACKEND_URL}/api/products/trending?limit=${limit}`;
      } else {
        url = `${BACKEND_URL}/api/products/recommended?limit=${limit}`;
      }

      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(url, config);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 dark:bg-slate-700 h-64 rounded-2xl mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 dark:bg-slate-800"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <Badge className="absolute top-4 left-4 bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg dark:bg-slate-700 dark:text-white">
                {product.condition}
              </Badge>
              <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                <WishlistButton productId={product.id} size="md" />
              </div>
              {type === 'trending' && product.trending_score && (
                <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  🔥 Trending
                </Badge>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {product.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 text-sm">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  €{product.price}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {product.views || 0} views
                  </span>
                  {product.wishlist_count > 0 && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      • ❤️ {product.wishlist_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
