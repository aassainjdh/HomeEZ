import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Camera, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync state if user loads after mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name field cannot be left blank');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('address', address);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully');
        setImageFile(null); // Clear buffer
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile settings');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative overflow-hidden min-h-screen">
      <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Profile Configurations</h1>
          <p className="text-xs text-slate-400 mt-1">Configure your personal credentials and location parameters.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar selector */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={previewUrl || user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'C')}`}
                alt="Profile Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-primary-500/15"
              />
              <label className="absolute bottom-1 right-1 p-2 bg-primary-600 text-white rounded-full border-2 border-white dark:border-dark-900 shadow-md cursor-pointer hover:scale-105 hover:bg-primary-700 transition-all">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Upload Profile Picture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 transition-all">
                <User size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address (Read Only)</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-3 text-sm focus:outline-none text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 transition-all">
                <Phone size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Delivery Address</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-primary-500 transition-all">
                <MapPin size={16} className="text-slate-400 ml-3.5 absolute pointer-events-none" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-1.5 mt-6"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Details...</span>
              </>
            ) : (
              <span>Save Configurations</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
