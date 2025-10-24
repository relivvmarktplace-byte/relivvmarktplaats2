import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import SellerRating from './SellerRating';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FeaturedSellers = ({ className = "" }) => {
  const { t } = useTranslation();
  const [featuredSellers, setFeaturedSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSellers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/featured-sellers`);
        setFeaturedSellers(response.data);
      } catch (error) {
        console.error('Error fetching featured sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSellers();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (featuredSellers.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-slate-500">
            <p className="font-semibold">🌟 {t('featuredSellers.comingSoon')}</p>
            <p className="text-sm mt-2">{t('featuredSellers.comingSoonDesc')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          ⭐ {t('featuredSellers.title')}
        </CardTitle>
        <p className="text-center text-slate-600 text-sm">
          {t('featuredSellers.subtitle')}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredSellers.map((seller, index) => (
            <div
              key={seller.id}
              className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                {/* Seller Avatar */}
                <div className="relative">
                  {seller.profile_image ? (
                    <img
                      src={`${BACKEND_URL}${seller.profile_image}`}
                      alt={seller.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-yellow-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center border-2 border-yellow-300">
                      <span className="text-white font-bold text-lg">
                        {seller.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                  
                  {/* Ranking */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Seller Info */}
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 mb-1">{seller.name}</h4>
                  
                  <SellerRating
                    rating={seller.rating_average}
                    ratingCount={seller.rating_count}
                    isFeaturedSeller={true}
                    size="sm"
                    showCount={true}
                    className="mb-2"
                  />
                  
                  <p className="text-xs text-slate-500">
                    ✓ {t('featuredSellers.verified')} • {t('featuredSellers.memberSince')} {new Date(seller.created_at).getFullYear()}
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>🏆 {t('featuredSellers.topSeller')}</span>
                  <span>💎 {t('featuredSellers.premiumQuality')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {featuredSellers.length >= 8 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              {t('featuredSellers.viewAll')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedSellers;