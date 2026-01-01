import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">G</div>
              <span className="font-bold text-xl text-white">GutterPros</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connecting homeowners with trusted, verified gutter installation and cleaning professionals across the United States. Protect your home with the best local experts.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Browse Directory</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">For Professionals</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Top Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Gutter Installation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Gutter Cleaning</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Repair & Maintenance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Leaf Guards</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Downspout Extension</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 text-blue-500" size={18} />
                <span>123 Market Street, Suite 400<br/>San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-blue-500" size={18} />
                <span>(800) 555-0123</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-blue-500" size={18} />
                <span>support@gutterpros.com</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-400/10 px-3 py-2 rounded-lg w-fit">
              <Shield size={14} />
              100% Secure Platform
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} GutterPros Directory. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};