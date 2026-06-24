import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Star, ShieldCheck, CheckCircle2, ChevronDown, Award, Users, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState({});

  // Categories list
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
    const fetchInitialData = async () => {
      try {
        const [servicesRes, providersRes] = await Promise.all([
          api.get('/services'),
          api.get('/users/providers')
        ]);
        if (servicesRes.data.success) {
          setServices(servicesRes.data.services);
        }
        if (providersRes.data.success) {
          // Limit to top 4 featured providers
          setProviders(providersRes.data.providers.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load home page data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filtered Services based on category and search query
  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    // Redirect to booking detail page
    navigate(`/book/${serviceId}`);
  };

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      q: 'How does HomeEZ verify service providers?',
      a: 'All providers must undergo a background check, years of experience validation, and documentation review. Only verified providers are listed on our active marketplace.'
    },
    {
      q: 'Can I reschedule or cancel my booking?',
      a: 'Yes, you can cancel or reschedule bookings directly from your customer dashboard for free up to 2 hours before the scheduled appointment.'
    },
    {
      q: 'How do I pay for my services?',
      a: 'We support secure post-service online payments or cash on completion. You can mark bookings as paid from your customer dashboard.'
    },
    {
      q: 'What if I am unhappy with the service?',
      a: 'Customer satisfaction is our highest priority. If you are unsatisfied, please write a review and contact support. We will review and issue refunds or dispatch another professional if necessary.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950 -z-10"></div>
        
        {/* Animated background blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md">
            <ShieldCheck size={16} className="text-accent-500" />
            <span className="text-xs font-semibold tracking-wide">100% Verified Service Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Your Premium Home Services, <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Simplified and Guaranteed.
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Book professional plumbers, electricians, cleaners, painters, and carpenters. High-quality service with transparent pricing.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative bg-white dark:bg-dark-900 p-2 rounded-2xl shadow-2xl border border-slate-200/20 dark:border-slate-800/80 flex items-center space-x-2 backdrop-blur-lg">
            <Search className="text-slate-400 ml-3 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search for plumbing, deep cleaning, electrical installation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 text-base py-3"
            />
            <button className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-1.5">
              <span>Find</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Explore Service Categories</h2>
          <p className="text-slate-500 dark:text-slate-400">Select a category to filter customized services for your household requirements.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                selectedCategory === category
                  ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/80 animate-pulse space-y-4">
                <div className="bg-slate-200 dark:bg-slate-800 h-44 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="glass-card bg-white dark:bg-dark-900 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 dark:bg-dark-950/95 text-primary-600 dark:text-primary-400 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                        {service.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/50 mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Est. Price / Duration</p>
                      <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                        ${service.price} <span className="text-xs font-semibold text-slate-400">/ {service.duration}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookNow(service._id)}
                      className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-2.5 text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                    >
                      <span>Book</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400">
                No services match your query or category selection. Try searching something else!
              </div>
            )}
          </div>
        )}
      </section>

      {/* Featured Service Providers */}
      <section className="bg-slate-50 dark:bg-dark-900/30 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Featured Specialists</h2>
            <p className="text-slate-500 dark:text-slate-400">Our highest rated, background-verified professionals ready to serve your household.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {providers.length > 0 ? (
              providers.map((p) => (
                <div
                  key={p._id}
                  className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 text-center space-y-4 relative overflow-hidden"
                >
                  <div className="relative inline-block">
                    <img
                      src={p.userId?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.userId?.name || 'P')}`}
                      alt={p.userId?.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500/20"
                    />
                    <span className="absolute bottom-0 right-0 p-1 bg-accent-500 rounded-full text-white border-2 border-white dark:border-dark-900">
                      <CheckCircle2 size={12} />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white truncate">
                      {p.userId?.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-1 text-amber-500 text-sm font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>{p.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {p.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {p.services.length > 2 && (
                      <span className="text-[10px] font-bold text-slate-400">+{p.services.length - 2} more</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 flex justify-between text-xs text-slate-400 font-medium">
                    <span>Exp: {p.experience} Yrs</span>
                    <span className="text-accent-500">Available</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400 py-6">
                No featured providers verified yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gradient-to-tr from-primary-900 to-slate-950 p-10 rounded-3xl text-center text-white border border-slate-800/60 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
          
          <div className="space-y-2">
            <Users size={32} className="mx-auto text-primary-400" />
            <p className="text-3xl font-extrabold font-heading">15,000+</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Satisfied Customers</p>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0">
            <Award size={32} className="mx-auto text-accent-400" />
            <p className="text-3xl font-extrabold font-heading">450+</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Verified Professionals</p>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0">
            <Calendar size={32} className="mx-auto text-primary-400" />
            <p className="text-3xl font-extrabold font-heading">40,000+</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Bookings Completed</p>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0">
            <CheckCircle2 size={32} className="mx-auto text-accent-400" />
            <p className="text-3xl font-extrabold font-heading">99.8%</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Reliability Score</p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-slate-500 dark:text-slate-400">Discover experiences from people who simplified household maintenance using HomeEZ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm italic">
              "The AC Repair technician arrived exactly on time and wore boot covers. He explained the filter clogging issue and resolved it in 45 minutes. Super professional!"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover" alt="Sarah" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sarah Johnson</p>
                <p className="text-xs text-slate-400">Dallas, TX</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm italic">
              "Deep house cleaning on HomeEZ saved my weekend. The crew brought their own specialized industrial vacuums and eco-friendly liquids. The kitchen smells brand new!"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover" alt="Marcus" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Marcus Brody</p>
                <p className="text-xs text-slate-400">Miami, FL</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm italic">
              "Highly recommend HomeEZ for electrical installations. We had complex smart dimmer switch wirings and the technician sorted them out instantly. Fair and transparent pricing."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover" alt="Elise" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Elise Patel</p>
                <p className="text-xs text-slate-400">Los Angeles, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/20"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-250 ${
                    faqOpen[index] ? 'rotate-180 text-primary-500' : ''
                  }`}
                />
              </button>
              {faqOpen[index] && (
                <div className="p-5 pt-0 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/40 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
