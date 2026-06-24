import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, Phone, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'customer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole); // 'customer' or 'provider'
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !address) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password, role, phone, address);
    setSubmitting(false);

    if (result && result.success) {
      toast.success('Registration successful! Welcome to HomeEZ.');
      if (role === 'provider') {
        navigate('/provider');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden mesh-gradient-bg scene-3d">
      <div className="max-w-md w-full glass-panel border border-slate-200/50 dark:border-slate-850 rounded-[2rem] p-8 shadow-2xl relative z-10 tilt-card preserve-3d">
        <div className="text-center space-y-2 tilt-card-child">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-heading font-extrabold text-lg shadow-md inline-block mb-2">
            HEz
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join HomeEZ to simplify your home maintenance scheduling.
          </p>
        </div>

        {/* Role Selector Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-dark-950/80 p-1.5 rounded-xl border border-slate-200/20 mt-6 tilt-card-child">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-white dark:bg-dark-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === 'provider'
                ? 'bg-white dark:bg-dark-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            I am a Professional
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6 tilt-card-child">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <UserIcon size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <Mail size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <Lock size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone Number</label>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <Phone size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Service Delivery Address</label>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <MapPin size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address, City, State"
                className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-neon py-3.5 flex items-center justify-center space-x-2 text-sm mt-6 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-450 mt-6 tilt-card-child border-t border-slate-100 dark:border-slate-800/60 pt-4">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
