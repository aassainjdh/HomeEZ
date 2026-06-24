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
      <div className="flex flex-col items-center justify-center min-h-[80vh] mesh-gradient-bg">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-semibold">Retrieving schedule availability...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto py-16 text-center mesh-gradient-bg">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
        <p className="font-semibold text-slate-700 dark:text-slate-350">Service details not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen mesh-gradient-bg scene-3d">
      
      {/* Back CTA */}
      <button
        onClick={() => navigate('/services')}
        className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors animate-fade-in-up"
      >
        <ArrowLeft size={14} />
        <span>Back to Services</span>
      </button>

      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white animate-fade-in-up">
        Book Appointment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
        {/* Left column: Booking form */}
        <div className="md:col-span-2 glass-panel p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-850 shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Step 1: Select Professional */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <UserCheck size={14} className="text-slate-400" />
                <span>Choose service provider</span>
              </label>
              
              {providers.length === 0 ? (
                <div className="bg-red-50/80 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 p-4 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-center space-x-2 backdrop-blur-md">
                  <AlertCircle size={18} />
                  <span>No verified professionals are currently registered for this category. Check back soon!</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {providers.map((p) => (
                    <label
                      key={p._id}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedProvider === p.userId._id
                          ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 ring-2 ring-primary-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-850/30'
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
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={p.userId.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.userId.name)}`}
                          alt={p.userId.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.userId.name}</p>
                          <p className="text-xs text-slate-400 font-medium">Experience: {p.experience} Years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-200/20 shadow-sm">
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
              <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Calendar size={14} className="text-slate-400" />
                <span>Date & Time</span>
              </label>
              <input
                type="datetime-local"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-white/75 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none text-slate-800 dark:text-white form-input-focus"
              />
            </div>

            {/* Step 3: Confirm Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <MapPin size={14} className="text-slate-400" />
                <span>Service Delivery Address</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address, Apt, City, State"
                className="w-full bg-white/75 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none text-slate-800 dark:text-white form-input-focus"
              />
            </div>

            {/* Step 4: Booking Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Notebook size={14} className="text-slate-400" />
                <span>Notes & Instructions</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide special instructions, parking alerts, or details of the repair needed..."
                className="w-full bg-white/75 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none text-slate-800 dark:text-white form-input-focus"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || providers.length === 0}
              className="w-full btn-neon py-3.5 flex items-center justify-center text-sm mt-4 disabled:opacity-55"
            >
              {submitting ? 'Confirming booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>

        {/* Right column: Service details overview */}
        <div className="space-y-4">
          <div className="glass-card bg-white/70 dark:bg-dark-900/60 rounded-[2rem] border border-slate-200/40 dark:border-slate-850 overflow-hidden shadow-md">
            <img
              src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'}
              alt={service.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {service.category}
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white pt-2">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>

              <div className="border-t border-slate-150/40 dark:border-slate-850/50 pt-4 flex justify-between items-center text-slate-600 dark:text-slate-350">
                <div className="flex items-center space-x-1 text-sm font-semibold">
                  <Clock size={16} className="text-slate-400" />
                  <span>{service.duration}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fixed Fare</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">${service.price}</p>
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
