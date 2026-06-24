import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code || !newPassword) {
      toast.error('Please fill in all inputs');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword
      });
      if (res.data.success) {
        toast.success('Password reset successfully! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Verify your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-md w-full bg-white dark:bg-dark-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Create New Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit the reset code together with your new password credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-all">
              <Mail size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reset Verification Code</label>
            <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-all">
              <ShieldCheck size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-Digit Code"
                className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white font-mono tracking-widest text-center"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-all">
              <Lock size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm mt-6"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-850">
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
