import React from 'react';
import { Shield } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, actions, className = '' }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onLogoClick} 
          className={`flex items-center gap-3 group ${onLogoClick ? 'cursor-pointer' : ''}`}
        >
          <div className="relative transition-transform group-hover:scale-105 duration-300">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               <Shield size={18} fill="currentColor" className="text-blue-50" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white ring-1 ring-white/50"></div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none group-hover:text-blue-700 transition-colors">GutterPros</h1>
            <div className="flex items-center gap-1 mt-0.5">
               <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Directory</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {actions}
        </div>
      </div>
    </header>
  );
};