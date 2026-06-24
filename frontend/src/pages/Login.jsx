import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result && result.success) {
      toast.success('Login successful! Welcome back.');
      navigate(redirectPath, { replace: true });
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden mesh-gradient-bg scene-3d">
      <div className="max-w-md w-full glass-panel border border-slate-200/50 dark:border-slate-850 rounded-[2rem] p-8 shadow-2xl relative z-10 tilt-card preserve-3d">
        <div className="text-center space-y-2 tilt-card-child">
          <span className="p-2 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-heading font-extrabold text-lg shadow-md inline-block mb-2">
            HEz
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log in to manage your appointments and home tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6 tilt-card-child">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <Mail size={18} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center bg-white/70 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800 rounded-xl form-input-focus">
              <Lock size={18} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-450 mt-6 tilt-card-child border-t border-slate-100 dark:border-slate-800/60 pt-4">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
