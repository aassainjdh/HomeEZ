import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-slate-400 py-12 border-t border-slate-800/80 transition-colors duration-300 overflow-hidden">
      {/* Animated gradient top border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-heading font-extrabold text-lg shadow-md hover:scale-105 transition-all">
                HEz
              </span>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                HomeEZ
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium, full-stack home service management platform. Book plumbing, electrical repairs, deep cleaning, AC repairs, painting, and carpentry in just a few clicks with verified professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Browse All Services</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Plumbing & Repairs</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Electrical Works</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">House Deep Cleaning</Link></li>
            </ul>
          </div>

          {/* Join Us */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Join Us
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link 
                  to="/register?role=provider" 
                  className="hover:text-accent-300 hover:translate-x-1 inline-block font-semibold text-accent-400 transition-all duration-200"
                >
                  Become a Provider
                </Link>
              </li>
              <li><Link to="/login" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Provider Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Customer Sign Up</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm space-y-2.5">
              <li className="hover:text-white transition-colors duration-200">Email: support@homeez.com</li>
              <li className="hover:text-white transition-colors duration-200">Phone: +1 (555) 019-2834</li>
              <li className="hover:text-white transition-colors duration-200">Address: 100 Tech Park, Suite 400</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} HomeEZ Inc. All rights reserved. Created with premium MERN stack integration.</p>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-slate-300 transition-colors">Terms</Link>
            <span className="text-slate-850">|</span>
            <Link to="/" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
