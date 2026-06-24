import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Calendar, Clock, MapPin, Notebook, UserCheck, Star, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const BookService = () => {
  const { id } = useParams(); // serviceId
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServiceAndProviders = async () => {
      try {
        // Get service info
        const serviceRes = await api.get(`/services/${id}`);
        if (serviceRes.data.success) {
          setService(serviceRes.data.service);
          
          // Get providers for that category
          const category = serviceRes.data.service.category;
          const providersRes = await api.get(`/users/providers?category=${encodeURIComponent(category)}`);
          if (providersRes.data.success) {
            setProviders(providersRes.data.providers);
            if (providersRes.data.providers.length > 0) {
              setSelectedProvider(providersRes.data.providers[0].userId._id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load booking page details', error);
        toast.error('Could not load service details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndProviders();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProvider) {
      toast.error('Please select a service provider');
      return;
    }
    if (!bookingDate) {
      toast.error('Please select an appointment date and time');
      return;
    }
    if (!address.trim()) {
      toast.error('Please specify the delivery address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        providerId: selectedProvider,
        serviceId: id,
        bookingDate,
        address,
        notes
      });
      if (res.data.success) {
        toast.success('Service booked successfully! Awaiting provider acceptance.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500">Retrieving schedule availability...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
        <p>Service details not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-h-screen">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Services</span>
      </button>

      <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Book Appointment</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Booking form */}
        <div className="md:col-span-2 bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Step 1: Select Professional */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <UserCheck size={14} className="text-slate-400" />
                <span>Choose service provider</span>
              </label>
              {providers.length === 0 ? (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 p-4 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-center space-x-2">
                  <AlertCircle size={18} />
                  <span>No verified professionals are currently registered for this category. Check back soon!</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {providers.map((p) => (
                    <label
                      key={p._id}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedProvider === p.userId._id
                          ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="provider"
                        value={p.userId._id}
                        checked={selectedProvider === p.userId._id}
                        onChange={() => setSelectedProvider(p.userId._id)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.userId.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.userId.name)}`}
                          alt={p.userId.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.userId.name}</p>
                          <p className="text-xs text-slate-400">Experience: {p.experience} Years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md">
                        <Star size={12} fill="currentColor" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select Date & Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Calendar size={14} className="text-slate-400" />
                <span>Date & Time</span>
              </label>
              <input
                type="datetime-local"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Step 3: Confirm Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <MapPin size={14} className="text-slate-400" />
                <span>Service Delivery Address</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address, Apt, City, State"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Step 4: Booking Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Notebook size={14} className="text-slate-400" />
                <span>Notes & Instructions</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide special instructions, parking alerts, or details of the repair needed..."
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || providers.length === 0}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center text-sm"
            >
              {submitting ? 'Confirming booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>

        {/* Right column: Service details overview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <img
              src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'}
              alt={service.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded">
                  {service.category}
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white pt-1">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center text-slate-600 dark:text-slate-350">
                <div className="flex items-center space-x-1 text-sm font-semibold">
                  <Clock size={16} className="text-slate-400" />
                  <span>{service.duration}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Fixed Fare</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">${service.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
