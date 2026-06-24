import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please specify your email');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success('Reset code generated successfully');
        // Capture mock reset code for development testing
        setResetCode(res.data.resetCode);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-md w-full bg-white dark:bg-dark-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Recover Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit your registered email address to receive a secure password reset code.
          </p>
        </div>

        {!resetCode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-all">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Requesting Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary-50 dark:bg-primary-950/40 p-4 border border-primary-200/50 dark:border-primary-800/40 rounded-2xl flex flex-col items-center space-y-2 text-center">
              <ShieldAlert className="text-primary-500" size={24} />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Development Environment Verification Code:</p>
              <p className="text-3xl font-extrabold tracking-widest text-primary-600 dark:text-primary-400 font-heading select-all px-4 py-2 bg-white dark:bg-dark-950 rounded-xl border border-primary-100 dark:border-primary-900">{resetCode}</p>
              <p className="text-[10px] text-slate-400 max-w-[280px]">In a live system, this code is sent to your inbox. Copy it and click below to reset your password.</p>
            </div>

            <button
              onClick={() => navigate('/reset-password', { state: { email } })}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <span>Proceed to Reset</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-850">
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
