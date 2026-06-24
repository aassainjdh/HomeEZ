import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Calendar, MapPin, DollarSign, Clock, Star, Compass, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error('Failed to load bookings', error);
      toast.error('Could not fetch booking history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
      if (res.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleSimulatePayment = async (id) => {
    try {
      const res = await api.put(`/bookings/${id}/payment`, { paymentStatus: 'paid' });
      if (res.data.success) {
        toast.success('Payment completed successfully! (Simulated)');
        fetchBookings();
      }
    } catch (error) {
      toast.error('Payment simulation failed');
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        providerId: selectedBooking.providerId._id,
        rating: Number(rating),
        comment
      });
      if (res.data.success) {
        toast.success('Review submitted successfully! Thank you.');
        setReviewModalOpen(false);
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Find the most active booking to track in real-time
  const trackingBooking = bookings.find(
    (b) => ['pending', 'accepted', 'in-progress'].includes(b.status)
  );

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'completed' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.serviceId ? b.serviceId.price : 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-400';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400';
      case 'rejected':
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen mesh-gradient-bg scene-3d">
      {/* Welcome Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">Customer Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Hello, {user?.name}. Monitor your upcoming home appointments and tracking metrics here.</p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
        
        <div className="glass-card bg-white/70 dark:bg-dark-900/60 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-850 flex items-center space-x-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-primary-100 dark:bg-primary-950/60 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm">
            <Compass size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalBookings}</p>
          </div>
        </div>

        <div className="glass-card bg-white/70 dark:bg-dark-900/60 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-850 flex items-center space-x-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-950/60 rounded-2xl text-yellow-600 dark:text-yellow-400 shadow-sm">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Tasks</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{pendingBookings}</p>
          </div>
        </div>

        <div className="glass-card bg-white/70 dark:bg-dark-900/60 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-850 flex items-center space-x-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-sm">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed Jobs</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{completedBookings}</p>
          </div>
        </div>

        <div className="glass-card bg-white/70 dark:bg-dark-900/60 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-850 flex items-center space-x-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-2xl text-purple-600 dark:text-purple-400 shadow-sm">
            <DollarSign size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">${totalSpent}</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
        
        {/* Left/Middle section: Active tracking & Bookings list */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Service Tracking Status */}
          {trackingBooking ? (
            <div className="glass-panel bg-white/70 dark:bg-dark-900/60 p-6 rounded-[2rem] border border-slate-200/40 dark:border-slate-850 shadow-md space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Appointment Tracking</span>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
                    {trackingBooking.serviceId?.title}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(trackingBooking.status)}`}>
                  {trackingBooking.status}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                {/* Connection Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
                {/* Active Connection Line */}
                <div
                  className="absolute top-4 left-4 h-0.5 bg-primary-500 -z-10 transition-all duration-500"
                  style={{
                    width:
                      trackingBooking.status === 'pending'
                        ? '0%'
                        : trackingBooking.status === 'accepted'
                        ? '33%'
                        : trackingBooking.status === 'in-progress'
                        ? '66%'
                        : '100%'
                  }}
                ></div>

                <div className="flex justify-between items-center text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary-600 text-white shadow-lg">1</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">Placed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      ['accepted', 'in-progress', 'completed'].includes(trackingBooking.status)
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>2</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Assigned</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      ['in-progress', 'completed'].includes(trackingBooking.status)
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>3</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">In-Progress</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      trackingBooking.status === 'completed'
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>4</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Finished</span>
                  </div>
                </div>
              </div>

              {/* Provider Info Card inside tracking */}
              <div className="bg-white/70 dark:bg-dark-950/60 p-4 rounded-2xl flex items-center justify-between border border-slate-150 dark:border-slate-800">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={trackingBooking.providerId?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trackingBooking.providerId?.name || 'P')}`}
                    alt="Provider"
                    className="w-12 h-12 rounded-full object-cover border border-primary-500/10"
                  />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Professional</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{trackingBooking.providerId?.name}</p>
                    <p className="text-xs text-slate-400">{trackingBooking.providerId?.phone}</p>
                  </div>
                </div>
                <div>
                  <a
                    href={`tel:${trackingBooking.providerId?.phone}`}
                    className="bg-primary-50 dark:bg-slate-900/60 text-primary-600 dark:text-primary-400 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-primary-500/10 hover:bg-primary-100 transition-all flex items-center"
                  >
                    Call Provider
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {/* Booking History Table */}
          <div className="glass-panel bg-white/70 dark:bg-dark-900/60 rounded-[2rem] border border-slate-200/40 dark:border-slate-850 shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-150/40 dark:border-slate-850 bg-slate-50/50 dark:bg-dark-950/20">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Booking History & Actions</h3>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading booking records...</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <AlertCircle className="mx-auto mb-2 text-slate-350" size={32} />
                No service bookings logged yet. Visit the Services page to choose a service.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/55 dark:bg-dark-950/40 border-b border-slate-150 dark:border-slate-800 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                      <th className="p-4 pl-6">Service Details</th>
                      <th className="p-4">Assigned Expert</th>
                      <th className="p-4">Schedule Date</th>
                      <th className="p-4">Billing Status</th>
                      <th className="p-4 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {booking.serviceId?.title || 'Unknown Service'}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">Category: {booking.serviceId?.category}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            {booking.providerId?.name || 'Unassigned'}
                          </p>
                          <p className="text-xs text-slate-400">{booking.providerId?.phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold mr-1.5 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                            {/* Cancel Booking */}
                            {['pending', 'accepted'].includes(booking.status) && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="px-3 py-1.5 text-xs font-bold text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                              >
                                Cancel
                              </button>
                            )}

                            {/* Pay (Simulation) */}
                            {booking.status === 'completed' && booking.paymentStatus === 'pending' && (
                              <button
                                onClick={() => handleSimulatePayment(booking._id)}
                                className="px-3 py-1.5 text-xs font-bold text-emerald-650 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                              >
                                Pay Now
                              </button>
                            )}

                            {/* Review */}
                            {booking.status === 'completed' && (
                              <button
                                onClick={() => openReviewModal(booking)}
                                className="px-3 py-1.5 text-xs font-bold text-primary-650 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 rounded-xl transition-all flex items-center space-x-1 hover:-translate-y-0.5 active:translate-y-0"
                              >
                                <Star size={12} fill="currentColor" />
                                <span>Review</span>
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
        </div>

        {/* Right side: Info and address cards */}
        <div className="space-y-6">
          {/* User profile card */}
          <div className="glass-panel bg-white/70 dark:bg-dark-900/60 p-6 rounded-[2rem] border border-slate-200/40 dark:border-slate-850 shadow-md text-center space-y-4">
            <img
              src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'C')}`}
              alt={user?.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border border-primary-500/20 shadow-md"
            />
            <div>
              <h3 className="font-heading font-extrabold text-slate-850 dark:text-white text-lg">{user?.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{user?.email}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-150/40 dark:border-slate-850/50 text-left space-y-3.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
              <div className="flex items-start space-x-2">
                <Calendar size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-650 dark:text-slate-400">Registered: {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-650 dark:text-slate-400">Address: {user?.address || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review & Ratings Modal */}
      {reviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={() => setReviewModalOpen(false)}></div>
          
          <div className="relative bg-white dark:bg-dark-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-md w-full z-10 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Review Professional</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Professional details</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedBooking.providerId?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Job: {selectedBooking.serviceId?.title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rating Score</label>
                <div className="flex items-center space-x-1.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Comments & Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience with this professional's service..."
                  className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-805 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-xs font-bold hover:from-primary-700 hover:to-accent-700 transition-all shadow-md shadow-primary-500/10 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
