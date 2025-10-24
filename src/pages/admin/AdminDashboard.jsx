import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [sellerStats, setSellerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all analytics data
      const [statsRes, analyticsRes, salesRes, categoryRes, userGrowthRes, topProductsRes, sellerRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/stats`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/analytics/overview?days=${dateRange}`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/analytics/sales-trend?days=${dateRange}`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/analytics/category-distribution`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/analytics/user-growth?days=${dateRange}`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/analytics/top-products?limit=5&metric=views`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/analytics/seller-stats`, { headers })
      ]);

      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setSalesTrend(salesRes.data);
      setCategoryDist(categoryRes.data);
      setUserGrowth(userGrowthRes.data);
      setTopProducts(topProductsRes.data);
      setSellerStats(sellerRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{title}</p>
            <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
            {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
          </div>
          <div className={`text-5xl opacity-20`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">📊 Analytics Dashboard</h1>
          <p className="text-slate-600 mt-1">Comprehensive insights and metrics</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics?.total_users || 0}
          icon="👥"
          color="text-blue-600"
          subtext={`+${analytics?.recent?.users || 0} in ${dateRange} days`}
        />
        <StatCard
          title="Active Products"
          value={analytics?.total_active_products || 0}
          icon="📦"
          color="text-green-600"
          subtext={`${analytics?.total_products || 0} total listed`}
        />
        <StatCard
          title="Total Revenue"
          value={`€${analytics?.total_revenue || 0}`}
          icon="💰"
          color="text-emerald-600"
          subtext={`€${analytics?.total_commission || 0} commission`}
        />
        <StatCard
          title="Completed Sales"
          value={analytics?.total_transactions || 0}
          icon="💳"
          color="text-purple-600"
          subtext={`+${analytics?.recent?.transactions || 0} in ${dateRange} days`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Avg Rating"
          value={analytics?.average_rating || 0}
          icon="⭐"
          color="text-yellow-600"
          subtext="Platform average"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pending_orders || 0}
          icon="⏳"
          color="text-orange-600"
        />
        <StatCard
          title="Open Tickets"
          value={stats?.open_tickets || 0}
          icon="🎫"
          color="text-red-600"
        />
        <StatCard
          title="Total Tickets"
          value={stats?.total_tickets || 0}
          icon="📋"
          color="text-slate-600"
        />
      </div>

      {/* Sales Trend Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>📈 Sales & Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (€)" />
              <Area yAxisId="right" type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" name="Sales Count" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>🎯 Product Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>👥 User Registration Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Seller Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>🔥 Top Products (Most Viewed)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 line-clamp-1">{product.title}</p>
                      <p className="text-sm text-slate-600">€{product.price} • {product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-indigo-600">{product.views || 0} views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seller Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>🏆 Top Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sellerStats?.top_sellers?.slice(0, 5).map((seller, index) => (
                <div key={seller.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{seller.name}</p>
                      <p className="text-xs text-slate-600">
                        {seller.is_business ? '🏢 Business' : '👤 Individual'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">€{seller.revenue}</p>
                    <p className="text-xs text-slate-600">{seller.sales_count} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/admin/users'}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition-colors"
            >
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-semibold text-blue-900">Manage Users</h4>
              <p className="text-sm text-blue-700 mt-1">View, ban, or verify users</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/products'}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-left transition-colors"
            >
              <div className="text-3xl mb-2">📦</div>
              <h4 className="font-semibold text-green-900">Manage Products</h4>
              <p className="text-sm text-green-700 mt-1">Moderate and manage listings</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/tickets'}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition-colors"
            >
              <div className="text-3xl mb-2">🎫</div>
              <h4 className="font-semibold text-purple-900">Support Tickets</h4>
              <p className="text-sm text-purple-700 mt-1">Respond to user inquiries</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
