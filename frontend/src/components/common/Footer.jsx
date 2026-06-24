import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-heading font-extrabold text-lg shadow-md">
                HEz
              </span>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                HomeEZ
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Premium, full-stack home service management platform. Book plumbing, electrical repairs, deep cleaning, AC repairs, painting, and carpentry in just a few clicks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Plumbing & Repairs</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Electrical Works</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">AC Repair & Installation</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">House Deep Cleaning</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@homeez.com</li>
              <li>Phone: +1 (555) 019-2834</li>
              <li>Address: 100 Tech Park, Suite 400</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HomeEZ Inc. All rights reserved. Created with premium MERN stack integration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
