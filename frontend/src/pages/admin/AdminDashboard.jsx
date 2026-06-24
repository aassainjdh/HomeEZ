import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShieldAlert, Trash2, Edit2, Check, X, ShieldCheck, Plus, ListFilter, DollarSign, Calendar, Users, Briefcase, PlusCircle, AlertCircle, LayoutGrid, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // New service form state
  const [newService, setNewService] = useState({
    title: '',
    category: 'Plumbing',
    description: '',
    price: '',
    duration: ''
  });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [submittingService, setSubmittingService] = useState(false);

  // Edit service state
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, providersRes, servicesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/providers'),
        api.get('/services')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (providersRes.data.success) setProviders(providersRes.data.providers);
      if (servicesRes.data.success) setServices(servicesRes.data.services);
    } catch (error) {
      console.error('Failed to load admin stats', error);
      toast.error('Could not fetch control panel data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProvider = async (id, status) => {
    try {
      const res = await api.put(`/admin/providers/${id}/verify`, { status });
      if (res.data.success) {
        toast.success(`Provider status updated to ${status}`);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to verify provider');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all related records?')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success('User and records deleted successfully');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleCreateServiceSubmit = async (e) => {
    e.preventDefault();
    if (!newService.title || !newService.price || !newService.duration) {
      toast.error('Please enter all required fields');
      return;
    }

    setSubmittingService(true);
    try {
      const formData = new FormData();
      formData.append('title', newService.title);
      formData.append('category', newService.category);
      formData.append('description', newService.description);
      formData.append('price', newService.price);
      formData.append('duration', newService.duration);
      if (serviceImageFile) {
        formData.append('image', serviceImageFile);
      }

      const res = await api.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        toast.success('New service created successfully');
        setNewService({ title: '', category: 'Plumbing', description: '', price: '', duration: '' });
        setServiceImageFile(null);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to create new service');
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data.success) {
        toast.success('Service deleted successfully');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  // Recharts color maps
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  // Data preparation for charts
  const getPieChartData = () => {
    if (!stats || !stats.bookingsByStatus) return [];
    return Object.entries(stats.bookingsByStatus).map(([status, count]) => ({
      name: status.toUpperCase(),
      value: count
    }));
  };

  const getBarChartData = () => {
    if (!stats || !stats.bookingsByCategory) return [];
    return Object.entries(stats.bookingsByCategory).map(([category, count]) => ({
      category,
      bookings: count
    }));
  };

  const categoriesList = [
    'Plumbing',
    'Electrical',
    'House Cleaning',
    'AC Repair',
    'Appliance Repair',
    'Painting',
    'Pest Control',
    'Carpentry'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Admin Console</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform analytics, user moderation, verification queues, and catalog editing.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        {[
          { id: 'analytics', label: 'Analytics', icon: LayoutGrid },
          { id: 'providers', label: 'Provider Queue', icon: ShieldAlert },
          { id: 'services', label: 'Manage Services', icon: PlusCircle },
          { id: 'users', label: 'Registered Users', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 text-sm font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading control panel records...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Tab 1: Analytics Dashboard */}
          {activeTab === 'analytics' && stats && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Revenue</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${stats.totalRevenue}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-950/60 rounded-xl text-primary-600 dark:text-primary-400">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Bookings</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalBookings}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Members</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalUsers}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registered Experts</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalProviders}</p>
                  </div>
                </div>
              </div>

              {/* Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart: Status Breakdown */}
                <div className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-slate-800 dark:text-white text-base">Booking Status Breakdown</h3>
                  <div className="h-[250px] w-full">
                    {getPieChartData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs">No booking entries logged yet</div>
                    )}
                  </div>
                </div>

                {/* Bar Chart: Bookings by Category */}
                <div className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-slate-800 dark:text-white text-base">Bookings by Category</h3>
                  <div className="h-[250px] w-full">
                    {getBarChartData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getBarChartData()}>
                          <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs">No categories data logged yet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Bookings Monitoring */}
              <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-heading font-bold text-slate-800 dark:text-white text-base">Platform Activity (Recent Bookings)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-dark-950/40 text-[10px] uppercase font-extrabold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                        <th className="p-4 pl-6">Service</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Provider</th>
                        <th className="p-4">Fares</th>
                        <th className="p-4 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                      {stats.recentBookings.map((b) => (
                        <tr key={b._id}>
                          <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">
                            {b.serviceId?.title}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                            {b.customerId?.name}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                            {b.providerId?.name}
                          </td>
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                            ${b.serviceId?.price}
                          </td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Provider Verification Requests */}
          {activeTab === 'providers' && (
            <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-bold text-slate-800 dark:text-white text-base">Expert Verification Queue</h3>
              </div>
              {providers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No provider verification logs found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-dark-950/40 text-[10px] uppercase font-extrabold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                        <th className="p-4 pl-6">Professional Profile</th>
                        <th className="p-4">Experience & Services</th>
                        <th className="p-4">Description Bio</th>
                        <th className="p-4">Queue Status</th>
                        <th className="p-4 text-right pr-6">Approval Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {providers.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="p-4 pl-6">
                            <div className="flex items-center space-x-3">
                              <img
                                src={p.userId?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.userId?.name || 'P')}`}
                                alt="Provider"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-slate-850 dark:text-slate-200">{p.userId?.name || 'Unknown User'}</p>
                                <p className="text-xs text-slate-400">{p.userId?.email} | {p.userId?.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-700 dark:text-slate-350">{p.experience} Years Experience</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.services.map((s) => (
                                <span key={s} className="bg-slate-100 dark:bg-slate-800 text-[10px] px-1.5 py-0.5 rounded font-bold text-slate-500">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={p.description}>
                            {p.description || 'No bio specified'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                              p.verificationStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : p.verificationStatus === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400'
                            }`}>
                              {p.verificationStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex items-center justify-end space-x-1.5">
                              {p.verificationStatus !== 'verified' && (
                                <button
                                  onClick={() => handleVerifyProvider(p._id, 'verified')}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200/20 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 transition-all"
                                  title="Verify & Approve"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              {p.verificationStatus !== 'rejected' && (
                                <button
                                  onClick={() => handleVerifyProvider(p._id, 'rejected')}
                                  className="p-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200/20 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 transition-all"
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Catalog Service Management CRUD */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: List of existing services */}
              <div className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-heading font-bold text-slate-850 dark:text-white text-base">Catalog Services</h3>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {services.map((service) => (
                    <div key={service._id} className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'}
                          alt={service.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{service.title}</p>
                          <p className="text-xs text-slate-400">
                            Category: <span className="text-primary-500 font-semibold">{service.category}</span> | Duration: {service.duration}
                          </p>
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">${service.price}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 transition-all border border-red-200/20"
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Add Service form */}
              <div className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-slate-850 dark:text-white text-base flex items-center space-x-1">
                    <PlusCircle className="text-primary-500" size={18} />
                    <span>Create New Service</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Configure service metrics for pricing and categories listings.</p>
                </div>

                <form onSubmit={handleCreateServiceSubmit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Title</label>
                    <input
                      type="text"
                      required
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="e.g. Standard Toilet Repair"
                      className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      placeholder="59"
                      className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration Estimate</label>
                    <input
                      type="text"
                      required
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      placeholder="e.g. 1-2 hours"
                      className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Brief details of what is covered in this service check..."
                      className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setServiceImageFile(e.target.files[0])}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 dark:file:bg-slate-800 dark:file:text-slate-300 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingService}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-1.5"
                  >
                    <span>Create Catalog Entry</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 4: Registered Users moderation */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-bold text-slate-855 dark:text-white text-base">Registered Member Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-dark-950/40 text-[10px] uppercase font-extrabold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                      <th className="p-4 pl-6">Member details</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Location address</th>
                      <th className="p-4 text-right pr-6">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">
                          <p>{u.name}</p>
                          <span className="text-xs font-normal text-slate-400">{u.email}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wide ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                              : u.role === 'provider'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-350">{u.phone || 'N/A'}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-350 max-w-[200px] truncate">{u.address || 'N/A'}</td>
                        <td className="p-4 text-right pr-6">
                          {u._id !== user._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 border border-red-200/20 transition-all"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
