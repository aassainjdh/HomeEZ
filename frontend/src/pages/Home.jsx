import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Star, ShieldCheck, CheckCircle2, ChevronDown, Award, 
  Users, Calendar, ArrowRight, Wrench, Lightbulb, Brush, 
  Sparkles, Hammer, Tv, Compass, ArrowUpRight, HelpCircle
} from 'lucide-react';
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

  // Categories list with details for 3D flip cards
  const categoryDetails = [
    { name: 'Plumbing', desc: 'Leaking pipes, basin installs, and bathroom repairs', icon: 'plumbing' },
    { name: 'Electrical', desc: 'Switch replacements, wiring repairs, and lighting setup', icon: 'electrical' },
    { name: 'House Cleaning', desc: 'Deep sanitation, dusting, and regular room cleaning', icon: 'cleaning' },
    { name: 'AC Repair', desc: 'Filter cleans, gas refilling, and thermostat repairs', icon: 'ac' },
    { name: 'Appliance Repair', desc: 'Refrigerators, washing machines, and oven servicing', icon: 'appliance' },
    { name: 'Painting', desc: 'Interior walls, textured finishes, and touch-ups', icon: 'painting' },
    { name: 'Pest Control', desc: 'Termite removal, bedbug treatments, and disinfection', icon: 'pest' },
    { name: 'Carpentry', desc: 'Furniture setup, lock replacement, and woodwork repair', icon: 'carpentry' }
  ];

  const categories = ['All', ...categoryDetails.map(c => c.name)];

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

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'plumbing': return <Wrench className="text-primary-500 dark:text-primary-400" size={28} />;
      case 'electrical': return <Lightbulb className="text-accent-500 dark:text-accent-400" size={28} />;
      case 'cleaning': return <Sparkles className="text-primary-500 dark:text-primary-400" size={28} />;
      case 'ac': return <Compass className="text-accent-500 dark:text-accent-400" size={28} />;
      case 'appliance': return <Tv className="text-primary-500 dark:text-primary-400" size={28} />;
      case 'painting': return <Brush className="text-accent-500 dark:text-accent-400" size={28} />;
      case 'pest': return <ShieldCheck className="text-primary-500 dark:text-primary-400" size={28} />;
      case 'carpentry': return <Hammer className="text-accent-500 dark:text-accent-400" size={28} />;
      default: return <Sparkles className="text-primary-500 dark:text-primary-400" size={28} />;
    }
  };

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
    <div className="space-y-24 pb-20 mesh-gradient-bg">
      {/* 3D Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Floating Blur Objects for 3D Visual Depth */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-pink-500/15 dark:bg-pink-500/5 blur-3xl animate-blob-1 pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-cyan-500/15 dark:bg-cyan-500/5 blur-3xl animate-blob-2 pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-purple-500/15 dark:bg-purple-500/5 blur-3xl animate-blob-3 pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-8 text-left animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-100/50 dark:bg-primary-950/40 border border-primary-200/50 dark:border-primary-900/30 backdrop-blur-md">
                <ShieldCheck size={16} className="text-accent-500" />
                <span className="text-xs font-semibold tracking-wide text-primary-900 dark:text-primary-300">
                  100% Certified & Insured Professionals
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Your Premium <br />
                Home Services, <br />
                <span className="text-gradient-neon font-extrabold">
                  Perfected in 3D.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-xl leading-relaxed">
                Connect instantly with verified experts in plumbing, electrical fixes, cleaning, painting, and carpentry. Premium work, guaranteed peace of mind.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl relative bg-white dark:bg-dark-900 p-2 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200/60 dark:border-slate-800/80 flex items-center space-x-2 backdrop-blur-lg hover:shadow-primary-500/5 transition-all duration-300">
                <Search className="text-slate-400 ml-3 flex-shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Search plumbing, AC, deep cleaning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 text-base py-3"
                />
                <button className="btn-neon px-8 py-3.5 flex items-center justify-center space-x-1.5 shrink-0">
                  <span>Explore</span>
                </button>
              </div>
            </div>

            {/* Hero Right 3D Visualizer Scene */}
            <div className="hidden lg:block relative h-[450px] scene-3d">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Core floating logo element */}
                <div className="w-44 h-44 rounded-3xl bg-gradient-to-tr from-primary-600/90 via-primary-500/95 to-accent-600/90 flex flex-col items-center justify-center text-white shadow-2xl animate-float preserve-3d border border-white/20">
                  <span className="font-heading font-extrabold text-5xl tracking-tighter drop-shadow-md">HEz</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 mt-1 drop-shadow">HomeEZ</span>
                </div>
                
                {/* Floating Orbiting Cards (3D Space Positions) */}
                <div className="absolute w-24 h-24 bg-white/70 dark:bg-dark-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col items-center justify-center shadow-lg animate-float-delayed transform translate-x-44 -translate-y-24 rotate-12 hover:scale-110 transition-all duration-300">
                  <Wrench className="text-primary-500 dark:text-primary-400 mb-1" size={28} />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Plumbing</span>
                </div>
                
                <div className="absolute w-24 h-24 bg-white/70 dark:bg-dark-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col items-center justify-center shadow-lg animate-float transform -translate-x-44 translate-y-20 -rotate-12 hover:scale-110 transition-all duration-300">
                  <Lightbulb className="text-accent-500 dark:text-accent-400 mb-1" size={28} />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Electrical</span>
                </div>
                
                <div className="absolute w-24 h-24 bg-white/70 dark:bg-dark-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col items-center justify-center shadow-lg animate-float-delayed transform translate-x-28 translate-y-36 rotate-6 hover:scale-110 transition-all duration-300">
                  <Sparkles className="text-primary-500 dark:text-primary-400 mb-1" size={28} />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Cleaning</span>
                </div>

                <div className="absolute w-24 h-24 bg-white/70 dark:bg-dark-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col items-center justify-center shadow-lg animate-float transform -translate-x-32 -translate-y-36 -rotate-6 hover:scale-110 transition-all duration-300">
                  <Brush className="text-accent-500 dark:text-accent-400 mb-1" size={28} />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Painting</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3D Categories Flipping Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white">
            Premium Service Categories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Hover over each category below to flip the 3D card and explore details of our household services.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryDetails.map((cat, idx) => (
            <div key={idx} className="h-56 card-3d-wrap cursor-pointer" onClick={() => setSelectedCategory(cat.name)}>
              <div className={`card-3d-flip ${selectedCategory === cat.name ? 'ring-2 ring-primary-500' : ''}`}>
                
                {/* Front Side */}
                <div className="card-3d-front glass-panel flex flex-col items-center justify-center p-6 border border-slate-200 dark:border-slate-850">
                  <div className="p-4 rounded-2xl bg-white dark:bg-dark-900 shadow-md mb-4 transform hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white text-center">
                    {cat.name}
                  </h3>
                  <span className="mt-2 text-[10px] uppercase tracking-wider text-primary-500 dark:text-primary-400 font-bold flex items-center gap-1">
                    Flip for info <ArrowRight size={10} />
                  </span>
                </div>
                
                {/* Back Side */}
                <div className="card-3d-back bg-gradient-to-br from-primary-950 to-slate-900 p-6 flex flex-col justify-between text-white border border-primary-500/20 shadow-2xl">
                  <div className="space-y-3">
                    <p className="text-xs uppercase font-bold tracking-widest text-primary-400">
                      {cat.name}
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <button className="w-full mt-4 py-2.5 btn-neon text-xs flex items-center justify-center gap-1.5">
                    <span>Filter Services</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services List Section (Dynamic Filters) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/50 dark:border-slate-850 pb-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
              Available Service Packages
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Browse individual packages tailored to your schedule and requirements.
            </p>
          </div>
          
          {/* Active Category Filter Indicator */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'btn-neon text-white px-5 py-2 text-xs'
                    : 'bg-white/80 dark:bg-dark-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-850 px-5 py-2 rounded-xl text-xs font-bold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white/60 dark:bg-dark-900/60 rounded-3xl p-5 border border-slate-250/30 dark:border-slate-850 animate-pulse space-y-4">
                <div className="bg-slate-200 dark:bg-slate-800 h-40 rounded-2xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="group tilt-card glass-card bg-white/70 dark:bg-dark-900/60 rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-850 flex flex-col justify-between"
                >
                  <div className="preserve-3d">
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 transform-style:preserve-3d">
                      <img
                        src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 dark:bg-dark-950/95 text-primary-600 dark:text-primary-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-850 shadow-sm uppercase tracking-wider">
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
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Price</p>
                      <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                        ${service.price} <span className="text-xs font-semibold text-slate-400">/ {service.duration}</span>
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
              <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/30 dark:bg-dark-900/20">
                No services match your query or category selection. Try selecting another filter!
              </div>
            )}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
            How HomeEZ Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Book professional services in three streamlined steps from your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connection Line decoration */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-10"></div>

          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-primary-500 text-white shadow-xl flex items-center justify-center mx-auto font-extrabold text-2xl animate-float border border-white/20">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Search & Select</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Explore categories or search for specific service packages. Check transparent pricing and duration upfront.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white shadow-xl flex items-center justify-center mx-auto font-extrabold text-2xl animate-float-delayed border border-white/20">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Schedule Booking</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Choose your preferred date, time, and address. Pay online securely or choose cash upon successful service completion.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-500 to-emerald-500 text-white shadow-xl flex items-center justify-center mx-auto font-extrabold text-2xl animate-float border border-white/20">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Relax & Approve</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              A verified professional completes the task. Check details, approve on your dashboard, and write an honest review.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Service Providers */}
      <section className="bg-slate-50/50 dark:bg-dark-900/20 py-16 border-y border-slate-200/40 dark:border-slate-850/50 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Verified Specialists</h2>
            <p className="text-slate-500 dark:text-slate-400">Our highest rated, background-checked professionals ready to service your household.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {providers.length > 0 ? (
              providers.map((p) => (
                <div
                  key={p._id}
                  className="group tilt-card bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="relative inline-block mt-2">
                      <img
                        src={p.userId?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.userId?.name || 'P')}`}
                        alt={p.userId?.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500/20 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 right-0 p-1 bg-accent-500 rounded-full text-white border-2 border-white dark:border-dark-900 glow-pulse">
                        <CheckCircle2 size={12} />
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
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
                          className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {p.services.length > 2 && (
                        <span className="text-[10px] font-bold text-slate-400">+{p.services.length - 2} more</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between text-xs text-slate-400 font-bold">
                    <span>Exp: {p.experience} Yrs</span>
                    <span className="text-accent-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span> Available
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400 py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/20">
                No featured providers verified yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Statistics Section with glow border */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glow-border rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-tr from-slate-950 via-slate-900 to-primary-950 p-10 text-center text-white relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
            
            <div className="space-y-2">
              <Users size={32} className="mx-auto text-primary-400 animate-float" />
              <p className="text-3xl font-extrabold font-heading">15,000+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Customers</p>
            </div>
            <div className="space-y-2 border-l-0 md:border-l border-slate-800 pt-6 md:pt-0">
              <Award size={32} className="mx-auto text-accent-400 animate-float-delayed" />
              <p className="text-3xl font-extrabold font-heading">450+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Experts</p>
            </div>
            <div className="space-y-2 border-l-0 md:border-l border-slate-800 pt-6 md:pt-0">
              <Calendar size={32} className="mx-auto text-primary-400 animate-float" />
              <p className="text-3xl font-extrabold font-heading">40,000+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bookings Completed</p>
            </div>
            <div className="space-y-2 border-l-0 md:border-l border-slate-800 pt-6 md:pt-0">
              <CheckCircle2 size={32} className="mx-auto text-accent-400 animate-float-delayed" />
              <p className="text-3xl font-extrabold font-heading">99.8%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials - Auto Scrolling Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-slate-500 dark:text-slate-400">Discover experiences from people who simplified household maintenance using HomeEZ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">
              "The AC Repair technician arrived exactly on time and wore boot covers. He explained the filter clogging issue and resolved it in 45 minutes. Super professional!"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover border border-primary-500/20" alt="Sarah" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sarah Johnson</p>
                <p className="text-xs text-slate-400">Dallas, TX</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">
              "Deep house cleaning on HomeEZ saved my weekend. The crew brought their own specialized industrial vacuums and eco-friendly liquids. The kitchen smells brand new!"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover border border-primary-500/20" alt="Marcus" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Marcus Brody</p>
                <p className="text-xs text-slate-400">Miami, FL</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">
              "Highly recommend HomeEZ for electrical installations. We had complex smart dimmer switch wirings and the technician sorted them out instantly. Fair and transparent pricing."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover border border-primary-500/20" alt="Elise" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Elise Patel</p>
                <p className="text-xs text-slate-400">Los Angeles, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Join As Provider Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-[2rem] p-10 md:p-14 text-white text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-3 relative z-10 max-w-xl">
            <h2 className="text-3xl font-heading font-extrabold tracking-tight">
              Are you a service professional?
            </h2>
            <p className="text-primary-100 text-sm leading-relaxed">
              Join our active community of background-verified electricians, plumbers, carpenters, and cleaners. Grow your local service business with HomeEZ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0">
            <Link
              to="/register?role=provider"
              className="w-full sm:w-auto px-7 py-4 bg-white text-slate-950 hover:text-primary-600 font-extrabold rounded-2xl text-center shadow-2xl hover:scale-105 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply as Provider</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <HelpCircle size={32} className="mx-auto text-primary-500" />
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-dark-900/80 border border-slate-200/50 dark:border-slate-850 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/10"
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
                <div className="p-5 pt-0 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100/50 dark:border-slate-800/30 animate-fade-in-up">
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
