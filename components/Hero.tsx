import React from 'react';
import { ArrowRight, Upload } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621258683568-7c8703713833?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Turn Your CSV into a<br />
          <span className="text-blue-400">Professional Directory</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
          Instantly generate a full directory website and individual SEO landing pages for gutter companies using your data file.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={onStart}
            className="rounded-md bg-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 flex items-center gap-2"
          >
            <Upload size={20} />
            Upload CSV & Generate
          </button>
        </div>
      </div>
    </div>
  );
};