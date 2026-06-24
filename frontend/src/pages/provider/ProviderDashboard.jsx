import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Briefcase, DollarSign, Star, Calendar, Clock, MapPin, AlertTriangle, ShieldCheck, Check, X, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const ProviderDashboard = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit provider profile states
  const [experience, setExperience] = useState(providerProfile?.experience || 0);
  const [description, setDescription] = useState(providerProfile?.description || '');
  const [availability, setAvailability] = useState(providerProfile?.availability ?? true);
  const [selectedServices, setSelectedServices] = useState(providerProfile?.services || []);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const categories = [
    'Plumbing',
    'Electrical',
    'House Cleaning',
    'AC Repair',
    'Appliance Repair',
    'Painting',
    'Pest Control',
    'Carpentry'
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  // Sync edits if profile loads after initial render
  useEffect(() => {
    if (providerProfile) {
      setExperience(providerProfile.experience);
      setDescription(providerProfile.description);
      setAvailability(providerProfile.availability);
      setSelectedServices(providerProfile.services);
    }
  }, [providerProfile]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch provider bookings', error);
      toast.error('Could not load assigned bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Booking updated to '${newStatus}'`);
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleToggleService = (category) => {
    setSelectedServices((prev) => {
      if (prev.includes(category)) {
        return prev.filter((s) => s !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const result = await updateProvider({
        experience: Number(experience),
        description,
        availability,
        services: selectedServices
      });
      if (result.success) {
        toast.success('Professional profile settings updated successfully');
      } else {
        toast.error(result.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Failed to update professional settings');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Calculations
  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const activeJobs = bookings.filter((b) => ['accepted', 'in-progress'].includes(b.status));
  const completedJobs = bookings.filter((b) => b.status === 'completed');
  
  const totalEarnings = completedJobs.reduce(
    (sum, b) => sum + (b.serviceId ? b.serviceId.price : 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Professional Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Hello, {user?.name}. Manage job requests and earnings tracking metrics here.</p>
      </div>

      {/* Verification Banner */}
      {providerProfile && (
        <div>
          {providerProfile.verificationStatus === 'pending' && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 p-5 rounded-2xl flex items-start space-x-3.5 text-yellow-800 dark:text-yellow-400">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-sm">Verification Status: Pending Review</p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your professional documents are currently in line for review. Once verified by our administration team, your profile will appear in search results, and you can start accepting jobs.
                </p>
              </div>
            </div>
          )}

          {providerProfile.verificationStatus === 'rejected' && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-5 rounded-2xl flex items-start space-x-3.5 text-red-800 dark:text-red-400">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-sm">Verification Status: Rejected</p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your verification was not approved. Please verify your experience details and description, or contact administration support for resolution.
                </p>
              </div>
            </div>
          )}

          {providerProfile.verificationStatus === 'verified' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-2xl flex items-start space-x-3.5 text-emerald-800 dark:text-emerald-400">
              <ShieldCheck className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-sm">Verification Status: Fully Approved</p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your profile is fully verified! You are visible on the HomeEZ homepage marketplace. Ensure your availability toggle is ON to receive job requests.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Counter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-950/60 rounded-xl text-primary-600 dark:text-primary-400">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed Jobs</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{completedJobs.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Earnings</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${totalEarnings}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-500">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rating Score</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{providerProfile?.rating.toFixed(1) || '5.0'}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-accent-100 dark:bg-accent-950/60 rounded-xl text-accent-600 dark:text-accent-400">
            {availability ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Job Availability</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{availability ? 'Active (Open)' : 'Inactive (Closed)'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Jobs Lists column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* New Job Requests (Pending) */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">New Job Requests</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full dark:bg-yellow-950/40 dark:text-yellow-400">
                {pendingRequests.length} pending
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading schedules...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No active booking requests at the moment. Keep your availability ON!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {pendingRequests.map((booking) => (
                  <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded">
                          {booking.serviceId?.category}
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{booking.serviceId?.title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <p className="flex items-center space-x-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{new Date(booking.bookingDate).toLocaleDateString()} @ {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                        <p className="flex items-center space-x-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-[200px]">{booking.address}</span>
                        </p>
                      </div>
                      {booking.notes && (
                        <p className="text-xs italic bg-slate-50 dark:bg-dark-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/50 text-slate-500 dark:text-slate-400">
                          Note: "{booking.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
                      >
                        <Check size={14} />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                        className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/20 rounded-xl p-2.5 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950 transition-all flex items-center space-x-1"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active / Ongoing Jobs */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Active Assignments</h3>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading assignments...</div>
            ) : activeJobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No ongoing assignments. Accept pending requests to start working!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {activeJobs.map((booking) => (
                  <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded">
                          {booking.serviceId?.category}
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{booking.serviceId?.title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <p className="flex items-center space-x-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{new Date(booking.bookingDate).toLocaleDateString()} @ {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                        <p className="flex items-center space-x-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span>{booking.address}</span>
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Customer: <span className="text-slate-700 dark:text-slate-300">{booking.customerId?.name}</span> ({booking.customerId?.phone})
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {booking.status === 'accepted' ? (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'in-progress')}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
                        >
                          Start Job
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
                        >
                          Complete Job
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Edit provider settings profile */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-slate-850 dark:text-white text-lg flex items-center space-x-1.5">
                <Sparkles className="text-primary-500" size={18} />
                <span>Professional Details</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Set up your workspace parameters to receive job matches.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              
              {/* Experience */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Years of Experience</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                />
              </div>

              {/* Bio/Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Bio / Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your specialties, background experience, and service guarantees..."
                  className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                />
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-dark-950/60 rounded-xl border border-slate-200/40">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Open for Booking Requests</p>
                  <p className="text-[10px] text-slate-400">Toggle availability on search marketplace</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAvailability(!availability)}
                  className="focus:outline-none text-primary-600 dark:text-primary-400"
                >
                  {availability ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-slate-400" />}
                </button>
              </div>

              {/* Services offered checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Offered Services</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleService(cat)}
                      className={`p-2 rounded-lg border text-left font-semibold transition-all ${
                        selectedServices.includes(cat)
                          ? 'border-primary-500 bg-primary-50/20 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
              >
                {updatingProfile ? 'Updating Setup...' : 'Save Setup Parameters'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
