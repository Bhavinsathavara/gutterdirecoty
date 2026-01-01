import React from 'react';
import { Search, MapPin, Shield, Star, UserCog } from 'lucide-react';
import { Header } from './Header';

interface HeroProps {
  onStart: () => void;
  hasData: boolean;
  onResume?: (val: any) => void;
  companyCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ onStart, hasData, onResume, companyCount }) => {
  return (
    <div className="relative bg-white min-h-screen flex flex-col pt-16">
      <Header 
        actions={
          <button 
            onClick={onStart} 
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            <UserCog size={18} />
            <span>Admin Login</span>
          </button>
        }
      />

      <div className="flex-1 relative overflow-hidden flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl animate-in slide-in-from-left-4 fade-in duration-700">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-6 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              America's #1 Gutter Service Directory
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Find Trusted <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">Gutter Experts</span> Near You
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Don't let water damage ruin your home. Connect with verified professionals for gutter cleaning, repair, and installation. Fast, reliable, and local.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {hasData ? (
                <button
                  onClick={onResume}
                  className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Browse {companyCount} Pros
                </button>
              ) : (
                <button
                  disabled
                  className="rounded-full bg-slate-100 px-8 py-4 text-lg font-semibold text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Directory Coming Soon
                </button>
              )}
              
              <button onClick={onStart} className="rounded-full bg-white border border-slate-200 px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                Are you a Pro? Join Now
              </button>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={18} />
                <span>Verified Pros</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" size={18} />
                <span>Top Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-500" size={18} />
                <span>Nationwide Coverage</span>
              </div>
            </div>
          </div>

          {/* Image / Graphic */}
          <div className="relative lg:block hidden animate-in slide-in-from-right-4 fade-in duration-700 delay-200">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2rem] blur-2xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden p-2 transform hover:-rotate-1 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1621253457065-22709cb1db64?auto=format&fit=crop&q=80&w=1000" 
                 alt="Home maintenance" 
                 className="rounded-xl w-full object-cover h-[500px]"
               />
               
               {/* Floating Card */}
               <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-4 animate-bounce-slow">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">100% Guaranteed</div>
                    <div className="text-xs text-slate-500">Quality Service</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};