import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ShoppingCart = ({ className = "" }) => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart`);
      
      if (response.data.items && response.data.items.length > 0) {
        // Fetch product details for each cart item
        const itemsWithDetails = await Promise.all(
          response.data.items.map(async (item) => {
            try {
              const productResponse = await axios.get(`${BACKEND_URL}/api/products/${item.product_id}`);
              return {
                ...item,
                product: productResponse.data
              };
            } catch (error) {
              console.error(`Failed to fetch product ${item.product_id}:`, error);
              return null;
            }
          })
        );
        
        setCartItems(itemsWithDetails.filter(item => item !== null));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error(t('cart.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/cart/remove/${productId}`);
      setCartItems(cartItems.filter(item => item.product_id !== productId));
      toast.success(t('cart.removedFromCart'));
    } catch (error) {
      toast.error(t('cart.purchaseFailed'));
    }
  };

  const purchaseItem = async (productId) => {
    setProcessingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const originUrl = window.location.origin;
      
      const response = await axios.post(
        `${BACKEND_URL}/api/payments/create-checkout`,
        { product_id: productId, origin_url: originUrl },
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: { product_id: productId, origin_url: originUrl }
        }
      );
      
      if (response.data && response.data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || t('cart.purchaseFailed'));
      setProcessingPayment(false);
    }
  };

  const proceedToCheckout = async () => {
    setProcessingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const originUrl = window.location.origin;
      
      const response = await axios.post(
        `${BACKEND_URL}/api/payments/create-checkout-cart`,
        { origin_url: originUrl },
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: { origin_url: originUrl }
        }
      );
      
      if (response.data && response.data.checkout_url) {
        toast.success(`🚀 ${t('cart.redirectingToCheckout')}`);
        // Redirect to Stripe checkout
        setTimeout(() => {
          window.location.href = response.data.checkout_url;
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || t('cart.checkoutFailed'));
      setProcessingPayment(false);
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0), 0);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🛒 {t('cart.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <p className="text-slate-600 text-lg mb-4">{t('cart.empty')}</p>
            <p className="text-slate-500 mb-6">{t('cart.emptyDescription')}</p>
            <Button 
              onClick={() => window.location.href = '/browse'}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-2xl"
            >
              🔍 {t('cart.startShopping')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
          <span>🛒</span>
          <span>{t('cart.title')}</span>
          <Badge className="bg-indigo-100 text-indigo-700">{cartItems.length}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center space-x-4 p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200"
            >
              {/* Product Image */}
              {item.product?.images?.[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                />
              )}
              
              {/* Product Info */}
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-1">{item.product?.title}</h4>
                <p className="text-slate-600 text-sm mb-2 line-clamp-1">{item.product?.description}</p>
                
                {/* Pickup Location */}
                {item.product?.pickup_address && (
                  <div className="flex items-start space-x-1 text-slate-500 text-xs mb-2">
                    <span>📍</span>
                    <span className="line-clamp-2">{item.product.pickup_address}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-black text-emerald-600">€{item.product?.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.product?.condition}
                  </Badge>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => purchaseItem(item.product_id)}
                  disabled={processingPayment}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-xl text-sm"
                >
                  {processingPayment ? '⏳' : '💳'} {t('cart.buyNow')}
                </Button>
                
                <Button
                  onClick={() => removeFromCart(item.product_id)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 px-6 py-2 rounded-xl text-sm"
                >
                  🗑️ {t('cart.remove')}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cart Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t('cart.orderSummary')}</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-slate-700">
              <span>{t('cart.subtotal')} ({cartItems.length} {t('cart.items')})</span>
              <span className="font-semibold">€{getTotalAmount().toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between text-slate-700">
              <span>{t('cart.platformFee')} (5%)</span>
              <span className="font-semibold">€{(getTotalAmount() * 0.05).toFixed(2)}</span>
            </div>
            
            <div className="border-t border-indigo-200 pt-3 flex items-center justify-between">
              <span className="text-xl font-bold text-slate-800">{t('cart.total')}</span>
              <span className="text-3xl font-black text-emerald-600">€{(getTotalAmount() * 1.05).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 space-y-1 mt-4">
            <p>✓ {t('cart.securePayment')}</p>
            <p>✓ {t('cart.escrowProtection')}</p>
            <p>✓ {t('cart.buyerProtection')}</p>
          </div>
        </div>

        {/* Proceed to Checkout Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={proceedToCheckout}
            disabled={processingPayment || cartItems.length === 0}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {processingPayment ? '⏳ ' + t('cart.processing') : '🚀 ' + t('cart.proceedToCheckout')}
          </Button>
          
          <p className="text-xs text-slate-500 mt-3">
            {t('cart.checkoutNote')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Add to Cart Button Component
export const AddToCartButton = ({ productId, className = "" }) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  
  const addToCart = async () => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/cart/add?product_id=${productId}`);
      toast.success('🛒 ' + t('cart.addedToCart'));
    } catch (error) {
      toast.error(error.response?.data?.detail || t('cart.addToCartFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={addToCart}
      disabled={loading}
      className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 ${className}`}
    >
      {loading ? '⏳' : '🛒'} {loading ? t('cart.adding') : t('cart.addToCart')}
    </Button>
  );
};

export default ShoppingCart;