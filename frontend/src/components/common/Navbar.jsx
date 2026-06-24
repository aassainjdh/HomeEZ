import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, User as UserIcon, BookOpen, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-dark-950/80 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-heading font-extrabold text-xl shadow-md">
                HEz
              </span>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-gradient-neon">
                HomeEZ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all nav-link-hover ${
                isActive('/')
                  ? 'text-primary-600 dark:text-primary-400 nav-link-active bg-primary-50/50 dark:bg-slate-900/50'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30'
              }`}
            >
              Home
            </Link>

            <Link
              to="/services"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all nav-link-hover ${
                isActive('/services')
                  ? 'text-primary-600 dark:text-primary-400 nav-link-active bg-primary-50/50 dark:bg-slate-900/50'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30'
              }`}
            >
              Services
            </Link>

            {/* Role-Specific Dashboard Buttons */}
            {user && (
              <Link
                to={
                  user.role === 'admin'
                    ? '/admin'
                    : user.role === 'provider'
                    ? '/provider'
                    : '/dashboard'
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 nav-link-hover ${
                  isActive('/dashboard') || isActive('/provider') || isActive('/admin')
                    ? 'text-primary-600 dark:text-primary-400 nav-link-active bg-primary-50/50 dark:bg-slate-900/50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:scale-105 active:scale-95"
                >
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-primary-500/20 shadow-sm"
                  />
                  <span className="hidden lg:block text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                    {user.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                       className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-dark-900 shadow-xl border border-slate-100 dark:border-slate-800/80 py-1.5 z-20 transition-all animate-scale-in">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md uppercase bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-400">
                          {user.role}
                        </span>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <UserIcon size={16} className="mr-2 text-slate-400" />
                        My Profile
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/25"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/register?role=provider"
                  className="px-3.5 py-2 text-sm btn-neon-outline flex items-center justify-center"
                >
                  Join as Professional
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30 border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm btn-neon flex items-center justify-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/30"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30 focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-950 border-b border-slate-200 dark:border-slate-800/80 px-2 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30"
          >
            Home
          </Link>
          
          <Link
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30"
          >
            Services
          </Link>
          
          {user && (
            <>
              <Link
                to={
                  user.role === 'admin'
                    ? '/admin'
                    : user.role === 'provider'
                    ? '/provider'
                    : '/dashboard'
                }
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/25"
              >
                Sign Out
              </button>
            </>
          )}

          {!user && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2 px-3">
              <Link
                to="/register?role=provider"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 btn-neon-outline block"
              >
                Join as Professional
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 btn-neon block"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
