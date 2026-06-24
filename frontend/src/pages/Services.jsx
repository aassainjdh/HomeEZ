import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Star, ShieldCheck, ArrowRight, Sparkles, Filter, Clock, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
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
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (error) {
        console.error('Failed to load services', error);
        toast.error('Could not load services, please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = (serviceId) => {
    if (!user) {
      toast.info('Please log in to book a service');
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      toast.warning('Only customers can book services');
      return;
    }
    navigate(`/book/${serviceId}`);
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 mesh-gradient-bg">
      {/* Search/Hero Banner */}
      <div className="relative overflow-hidden py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/30 via-slate-950 to-slate-950 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Our Professional <span className="text-gradient-neon font-extrabold">Home Services</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Browse through our fully verified, premium home service offerings. Standardized pricing, high-quality delivery.
          </p>

          {/* Dedicated Search Input */}
          <div className="max-w-xl mx-auto relative bg-white dark:bg-dark-950 p-1.5 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 flex items-center space-x-2 form-input-focus transition-all duration-300">
            <Search className="text-slate-400 ml-3 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-450 py-2.5 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850">
            <div className="flex items-center gap-2 font-heading font-bold text-slate-900 dark:text-white mb-4">
              <Filter size={18} className="text-primary-500" />
              <span>Categories</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between border border-transparent ${
                    selectedCategory === category
                      ? 'btn-neon text-white shadow-md'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-dark-900/60 border-slate-200/40 dark:border-slate-800/40'
                  }`}
                >
                  <span>{category}</span>
                  {selectedCategory === category && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-slate-900 dark:text-white">
              <Info size={16} className="text-accent-500" />
              <span className="text-sm">HomeEZ Promise</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every booking includes certified experts, transparent post-completion checkout, and dedicated customer support.
            </p>
          </div>
        </div>

        {/* Right Services Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white/60 dark:bg-dark-900/60 rounded-3xl p-5 border border-slate-200/30 dark:border-slate-850 animate-pulse space-y-4">
                  <div className="bg-slate-200 dark:bg-slate-800 h-40 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <p>Showing {filteredServices.length} services</p>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')} 
                    className="text-primary-500 hover:underline font-bold text-xs"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <div
                      key={service._id}
                      className="group tilt-card glass-card bg-white/70 dark:bg-dark-900/60 rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-850 flex flex-col justify-between"
                    >
                      <div className="preserve-3d">
                        <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-white/95 dark:bg-dark-950/95 text-primary-600 dark:text-primary-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-850 shadow-sm uppercase tracking-wider">
                            {service.category}
                          </span>
                        </div>

                        <div className="p-5 space-y-2 tilt-card-child">
                          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-500 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-150/40 dark:border-slate-850/50 mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock size={10} /> {service.duration}
                          </p>
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                            ${service.price}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleBookNow(service._id)}
                          className="btn-neon py-2 px-4 text-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Book</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/30 dark:bg-dark-900/20">
                    <p className="font-semibold text-lg mb-1">No services found</p>
                    <p className="text-sm">Try modifying your search or select a different category filter.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Services;
