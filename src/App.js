import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './App.css';
import './i18n';

// Import new components
import LocationPicker from './components/LocationPicker';
import ProductMap from './components/ProductMap';
import LanguageSwitcher from './components/LanguageSwitcher';
import NotificationBell from './components/NotificationBell';
import AppDownload from './components/AppDownload';
import SellerRating from './components/SellerRating';
import FeaturedSellers from './components/FeaturedSellers';
import ShoppingCart, { AddToCartButton } from './components/ShoppingCart';
import Footer from './components/Footer';

// Import pages
import PaymentSuccess from './pages/PaymentSuccess';
import OrdersPage from './pages/OrdersPage';
import Dashboard from './pages/Dashboard';
import MessagesPage from './pages/MessagesPage';
import SupportPage from './pages/SupportPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import ProductsManagement from './pages/admin/ProductsManagement';
import TicketsManagement from './pages/admin/TicketsManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import VerificationsManagement from './pages/admin/VerificationsManagement';
import WishlistPage from './pages/WishlistPage';
import SellerDashboard from './pages/SellerDashboard';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DeleteAccount from './pages/DeleteAccount';
import PlayStoreAssets from './pages/PlayStoreAssets';
import ReportButton from './components/ReportButton';
import TrustBadge from './components/TrustBadge';
import WishlistButton from './components/WishlistButton';
import FAQ from './pages/FAQ';
import SellPage from './pages/SellPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Import shadcn components
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SkeletonCard } from './components/SkeletonLoader';
import InstallPrompt from './components/InstallPrompt';
import RecommendedProducts from './components/RecommendedProducts';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You would typically verify the token here
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Header Component
const Header = () => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('header.brand')}
              </span>
              <div className="text-xs text-slate-500 font-medium">{t('header.tagline')}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 font-semibold hover:scale-105 relative group">
              {t('navigation.explore')}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/categories" className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 font-semibold hover:scale-105 relative group">
              {t('navigation.categories')}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            {user && (
              <>
                <Link to="/sell" className="text-slate-700 hover:text-indigo-600 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  {t('navigation.sell')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/messages" className="text-slate-700 hover:text-indigo-600 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  {t('navigation.messages')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/cart" className="text-slate-700 hover:text-indigo-600 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  🛒 {t('cart.title')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/orders" className="text-slate-700 hover:text-indigo-600 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  📦 {t('orders.title')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/transaction-history" className="text-slate-700 hover:text-indigo-600 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  📄 Invoices
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/wishlist" className="text-slate-700 hover:text-indigo-600 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  ❤️ {t('navigation.wishlist')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/seller-dashboard" className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 font-semibold hover:scale-105 relative group">
                  📊 Seller Dashboard
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <LanguageSwitcher />
            {user && <NotificationBell />}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard"
                  className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:scale-105"
                >
                  {user.profile_image && (
                    <img 
                      src={`${BACKEND_URL}${user.profile_image}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  )}
                  <span className="text-slate-700 font-semibold">{t('header.welcome', { name: user.name.split(' ')[0] })}</span>
                </Link>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 rounded-xl"
                  data-testid="logout-button"
                >
                  {t('navigation.logout')}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-0"
                data-testid="login-button"
              >
                {t('header.joinButton')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </header>
  );
};

// Auth Modal Component
const AuthModal = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    is_business_seller: false,
    business_name: '',
    vat_number: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, formData);
      
      login(response.data.user, response.data.access_token);
      toast.success(isLogin ? t('auth.loginSuccess') : t('auth.registerSuccess'));
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || (isLogin ? t('auth.loginFailed') : t('auth.registerFailed')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white via-slate-50 to-indigo-50 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-slate-800 mb-4">
            {isLogin ? t('auth.welcomeBack') : t('auth.joinRevolution')}
          </DialogTitle>
          <p className="text-center text-slate-600 text-sm">
            {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
          </p>
        </DialogHeader>

        <Tabs value={isLogin ? 'login' : 'register'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger 
              value="login" 
              onClick={() => setIsLogin(true)}
              data-testid="login-tab"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {t('auth.loginTab')}
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              onClick={() => setIsLogin(false)}
              data-testid="register-tab"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {t('auth.registerTab')}
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder={t('auth.email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="email-input"
                className="w-full rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-12"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder={t('auth.password')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="password-input"
                className="w-full rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-12"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <Input
                    type="text"
                    placeholder={t('auth.name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="name-input"
                    className="w-full rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-12"
                  />
                </div>
                
                <div>
                  <PhoneInput
                    country={'nl'}
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone: phone })}
                    inputProps={{
                      name: 'phone',
                      required: false,
                      'data-testid': 'phone-input'
                    }}
                    containerStyle={{
                      width: '100%'
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '16px',
                      paddingLeft: '48px'
                    }}
                    buttonStyle={{
                      borderRadius: '12px 0 0 12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc'
                    }}
                    dropdownStyle={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    enableSearch={true}
                    searchPlaceholder={t('auth.searchCountry', { defaultValue: 'Search country...' })}
                    preferredCountries={['nl', 'be', 'de', 'fr', 'gb']}
                  />
                </div>

                {/* Business Seller Option */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_business_seller"
                      checked={formData.is_business_seller}
                      onChange={(e) => setFormData({ ...formData, is_business_seller: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="is_business_seller" className="text-sm font-medium text-slate-700">
                      🏢 I am a business seller
                    </label>
                  </div>

                  {formData.is_business_seller && (
                    <>
                      <div>
                        <Input
                          type="text"
                          placeholder="🏢 Company Name *"
                          value={formData.business_name}
                          onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                          required={formData.is_business_seller}
                          className="w-full rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-12"
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="🔢 BTW/VAT Number (e.g., NL123456789B01) *"
                          value={formData.vat_number}
                          onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
                          required={formData.is_business_seller}
                          className="w-full rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-12"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Your VAT number for business registration
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-0"
              data-testid="auth-submit-button"
            >
              {loading ? t('common.loading') : (isLogin ? t('auth.loginButton') : t('auth.registerButton'))}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Home Page Component
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalUsers: '10K+',
    itemsSaved: '50K+',
    carbonSaved: '2.5M kg'
  });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API}/products?limit=8`),
          axios.get(`${API}/categories`)
        ]);
        setFeaturedProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading Relivv...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full border border-indigo-200">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">🌱 Sustainable • Verified • Secure</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('home.hero.title')}
                </span>
                <br />
                <span className="text-slate-800">{t('home.hero.titleSecond')}</span>
                <span className="text-4xl"> ♻️</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                {t('home.hero.subtitle')}
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</div>
                  <div className="text-sm text-slate-500">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.itemsSaved}</div>
                  <div className="text-sm text-slate-500">Items Rescued</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.carbonSaved}</div>
                  <div className="text-sm text-slate-500">CO₂ Saved</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-0"
                  data-testid="browse-products-button"
                >
                  🔍 Explore Treasures
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:border-indigo-300"
                  data-testid="start-selling-button"
                >
                  💰 Start Selling
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white to-slate-100 rounded-3xl p-8 shadow-2xl border border-slate-200/50">
                <img 
                  src="https://images.unsplash.com/photo-1678274324663-afc2c68eeeec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBzdXN0YWluYWJsZSUyMG1hcmtldHBsYWNlfGVufDB8fHx8MTc2MDIxNDY0N3ww&ixlib=rb-4.1.0&q=85"
                  alt="Modern Sustainable Marketplace"
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                />
                
                {/* Floating Commission Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-black">5%</div>
                    <div className="text-sm font-semibold">Commission</div>
                  </div>
                </div>
                
                {/* Floating Trust Badge */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">🔒 Secure Escrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              ⭐ Featured Products
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Hand-picked items selected by our team
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredProducts
              .filter(p => p.is_featured && !p.is_sold)
              .slice(0, 6)
              .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
          
          {featuredProducts.filter(p => p.is_featured).length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <p className="text-slate-500">No featured products yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section - Full List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Shop by Category</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Discover amazing pre-loved finds in every category</p>
          </div>
          
          {/* Full Width List - All Categories Vertical */}
          <div className="max-w-4xl mx-auto space-y-3">
            {categories.slice(0, 10).map((category, index) => {
              const icons = ['📱', '👔', '🏠', '⚽', '📚', '🧸', '🚗', '🎨', '🎸', '📦'];
              const colors = [
                'bg-blue-100 text-blue-600',
                'bg-purple-100 text-purple-600', 
                'bg-green-100 text-green-600',
                'bg-orange-100 text-orange-600',
                'bg-pink-100 text-pink-600',
                'bg-indigo-100 text-indigo-600',
                'bg-red-100 text-red-600',
                'bg-yellow-100 text-yellow-600',
                'bg-teal-100 text-teal-600',
                'bg-slate-100 text-slate-600'
              ];
              
              return (
                <Link
                  key={category}
                  to={`/browse?category=${encodeURIComponent(category)}`}
                  className="block group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-indigo-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 ${colors[index % colors.length]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl">{icons[index % icons.length]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-xl leading-relaxed">
                        {category}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">Browse {category.toLowerCase()} items</p>
                    </div>
                    <div className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-800 mb-6">Featured Treasures</h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">Handpicked gems from our sustainable community</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-slate-600 text-xl mb-4">No treasures yet!</p>
              <p className="text-slate-500">Be the first to list something amazing on Relivv</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <FeaturedSellers />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-slate-600 text-lg">{t('home.howItWorks.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home.howItWorks.step1')}</h3>
              <p className="text-slate-600">{t('home.howItWorks.step1Desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home.howItWorks.step2')}</h3>
              <p className="text-slate-600">{t('home.howItWorks.step2Desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home.howItWorks.step3')}</h3>
              <p className="text-slate-600">{t('home.howItWorks.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <AppDownload />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Join the Revolution? 🚀</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">Start your sustainable shopping journey today and help build a circular economy</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-50 font-bold px-12 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl border-0"
            >
              🛍️ Start Shopping
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold px-12 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              💰 List Your Items
            </Button>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="container mx-auto px-6">
        <RecommendedProducts 
          type="recommended" 
          title="🎯 Recommended for You" 
          limit={6} 
        />
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-6">
        <RecommendedProducts 
          type="trending" 
          title="🔥 Trending Now" 
          limit={6} 
        />
      </section>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buyingNow, setBuyingNow] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }

    setBuyingNow(true);
    try {
      const originUrl = window.location.origin;
      const response = await axios.post(
        `${BACKEND_URL}/api/payments/create-checkout?product_id=${product.id}&origin_url=${encodeURIComponent(originUrl)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create payment');
      setBuyingNow(false);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50"
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1633345136287-23889e21db00?w=300&h=200&fit=crop'} 
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Badge className="absolute top-4 left-4 bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg">
          {product.condition}
        </Badge>
        <div className="absolute top-4 right-4 bg-white/90 rounded-full flex items-center justify-center shadow-lg p-1" onClick={(e) => e.stopPropagation()}>
          <WishlistButton productId={product.id} size="md" />
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-3xl font-black text-emerald-600">€{product.price}</span>
            <p className="text-xs text-slate-500 mt-1">
              + Platform Fee (5%)
            </p>
            <p className="text-xs text-slate-500">📍 {product.pickup_location?.address || 'Locatie onbekend'}</p>
          </div>
          <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-600">
            {product.category}
          </Badge>
        </div>
        
        {/* Payment Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 rounded-xl transition-all duration-300"
          >
            {buyingNow ? '⏳' : '💳'} Buy Now
          </Button>
          <AddToCartButton 
            productId={product.id}
            className="py-2"
          />
        </div>
        
        {/* Seller Info */}
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-100">
          {product.seller_profile_image ? (
            <img 
              src={`${BACKEND_URL}${product.seller_profile_image}`}
              alt={product.seller_name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {product.seller_name ? product.seller_name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-700">
                {product.seller_name || 'Anonim'}
              </p>
              {product.is_featured_seller && (
                <span className="text-xs">⭐</span>
              )}
            </div>
            <SellerRating
              rating={product.seller_rating || 0}
              ratingCount={product.seller_rating_count || 0}
              isFeaturedSeller={product.is_featured_seller}
              size="sm"
              showCount={false}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Browse Products Component
const BrowsePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    condition: '',
    seller_type: '',
    date_range: '',
    sort_by: 'newest'
  });
  const { t } = useTranslation();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'minPrice') params.append('min_price', value);
          else if (key === 'maxPrice') params.append('max_price', value);
          else params.append(key, value);
        }
      });
      
      const response = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(t('browse.loadFailed', { defaultValue: 'Failed to load products' }));
    } finally {
      setLoading(false);
    }
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      condition: '',
      seller_type: '',
      date_range: '',
      sort_by: 'newest'
    });
  };
  
  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      value && key !== 'sort_by'
    ).length;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 pt-24 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">🔍 Hazineleri Keşfet</h1>
          <p className="text-slate-600 text-xl">Sürdürülebilir topluluğumuzdan eşsiz ikinci el ürünler keşfedin</p>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-2xl p-1 border border-slate-200 shadow-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                📋 Liste Görünümü
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  viewMode === 'map' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                🗺️ Harita Görünümü
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-lg">
          <CardContent className="p-6">
            {/* Basic Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder={t('browse.searchPlaceholder', { defaultValue: '🔍 Search treasures...' })}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                data-testid="search-input"
                className="rounded-xl border-slate-200 h-12"
              />
              
              <Select value={filters.category || "all"} onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? "" : value })}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder={t('browse.categoryPlaceholder', { defaultValue: '📂 Category' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('browse.allCategories', { defaultValue: 'All Categories' })}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.sort_by} onValueChange={(value) => setFilters({ ...filters, sort_by: value })}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder={t('browse.sortBy', { defaultValue: '🔄 Sort By' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('browse.sortNewest', { defaultValue: '🆕 Newest First' })}</SelectItem>
                  <SelectItem value="oldest">{t('browse.sortOldest', { defaultValue: '📅 Oldest First' })}</SelectItem>
                  <SelectItem value="price_low">{t('browse.sortPriceLow', { defaultValue: '💰 Price: Low to High' })}</SelectItem>
                  <SelectItem value="price_high">{t('browse.sortPriceHigh', { defaultValue: '💸 Price: High to Low' })}</SelectItem>
                  <SelectItem value="popular">{t('browse.sortPopular', { defaultValue: '⭐ Most Popular' })}</SelectItem>
                  <SelectItem value="featured">{t('browse.sortFeatured', { defaultValue: '🌟 Featured' })}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant="outline"
                className="rounded-xl h-12 border-2"
              >
                {showAdvancedFilters ? '▲' : '▼'} {t('browse.advancedFilters', { defaultValue: 'Advanced Filters' })} 
                {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
              </Button>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid md:grid-cols-5 gap-4 pt-4 border-t border-slate-200">
                <Input
                  type="number"
                  placeholder={t('browse.minPrice', { defaultValue: '💰 Min Price €' })}
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  data-testid="min-price-input"
                  className="rounded-xl h-12"
                />
                
                <Input
                  type="number"
                  placeholder={t('browse.maxPrice', { defaultValue: '💸 Max Price €' })}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  data-testid="max-price-input"
                  className="rounded-xl h-12"
                />
                
                <Input
                  placeholder={t('browse.location', { defaultValue: '📍 Location' })}
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  data-testid="location-input"
                  className="rounded-xl h-12"
                />
                
                <Select value={filters.condition || "all"} onValueChange={(value) => setFilters({ ...filters, condition: value === "all" ? "" : value })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder={t('browse.condition', { defaultValue: '✨ Condition' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all', { defaultValue: 'All' })}</SelectItem>
                    <SelectItem value="New">{t('product.conditions.new', { defaultValue: 'New' })}</SelectItem>
                    <SelectItem value="Like New">{t('product.conditions.likeNew', { defaultValue: 'Like New' })}</SelectItem>
                    <SelectItem value="Good">{t('product.conditions.good', { defaultValue: 'Good' })}</SelectItem>
                    <SelectItem value="Fair">{t('product.conditions.fair', { defaultValue: 'Fair' })}</SelectItem>
                    <SelectItem value="Poor">{t('product.conditions.poor', { defaultValue: 'Poor' })}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.seller_type || "all"} onValueChange={(value) => setFilters({ ...filters, seller_type: value === "all" ? "" : value })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder={t('browse.sellerType', { defaultValue: '👤 Seller Type' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all', { defaultValue: 'All' })}</SelectItem>
                    <SelectItem value="individual">{t('browse.individual', { defaultValue: 'Individual' })}</SelectItem>
                    <SelectItem value="business">{t('browse.business', { defaultValue: 'Business' })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Active Filters & Actions */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || key === 'sort_by') return null;
                    return (
                      <Badge key={key} variant="secondary" className="px-3 py-1">
                        {key}: {value}
                        <button
                          onClick={() => setFilters({ ...filters, [key]: '' })}
                          className="ml-2 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  {t('browse.clearFilters', { defaultValue: '🗑️ Clear All' })}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-slate-600 text-sm">
            {t('browse.resultsFound', { defaultValue: 'Found {{count}} products', count: products.length })}
          </div>
        )}

        {/* Products Grid or Map */}
        {loading ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent absolute top-0"></div>
            </div>
            <p className="text-slate-600 mt-4">Hazineler aranıyor...</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="space-y-6">
            <ProductMap
              products={products}
              center={products.length > 0 && products[0].pickup_location ? products[0].pickup_location.coordinates : undefined}
              height="500px"
              className="w-full"
            />
            {products.length > 0 && (
              <div className="text-center text-slate-600">
                <p className="font-semibold">🗺️ Haritada {products.length} ürün gösteriliyor</p>
                <p className="text-sm mt-1">İşaretçilere tıklayarak ürün detaylarını görün</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-slate-600 text-xl mb-4">Hiç hazine bulunamadı</p>
            <p className="text-slate-500">Arama filtrelerinizi düzenleyerek tekrar deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" />;
};

// Main App Component
function App() {
  const { t } = useTranslation();
  
  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header />
            <InstallPrompt />
            <main>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/sell" element={
                <ProtectedRoute>
                  <SellPage />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 pt-24">
                  <div className="container mx-auto px-6 py-12">
                    <div className="text-center">
                      <h1 className="text-5xl font-bold text-slate-800 mb-6">🏷️ {t('navigation.categories')}</h1>
                      <p className="text-slate-600 text-xl">{t('categories.subtitle', { defaultValue: 'Binnenkort beschikbaar!' })}</p>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 pt-24">
                    <div className="container mx-auto px-6 py-12">
                      <ShoppingCart />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/payment-success" element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <SupportPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
              <Route path="/transaction-history" element={
                <ProtectedRoute>
                  <TransactionHistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/seller-dashboard" element={
                <ProtectedRoute>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="tickets" element={<TicketsManagement />} />
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="verifications" element={<VerificationsManagement />} />
              </Route>
              
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/play-store-assets" element={<PlayStoreAssets />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;