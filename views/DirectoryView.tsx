import React, { useState, useMemo, useEffect } from 'react';
import { Company } from '../types';
import { CompanyCard } from '../components/CompanyCard';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

interface DirectoryViewProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onBack: () => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ companies, onSelectCompany, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Reset title on mount
  useEffect(() => {
    document.title = "GutterPros Directory";
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = locationFilter === '' || 
                              c.city.toLowerCase().includes(locationFilter.toLowerCase()) || 
                              c.state.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [companies, searchTerm, locationFilter]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set(companies.map(c => c.state));
    return Array.from(locs).sort();
  }, [companies]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">G</div>
             <span className="font-bold text-xl text-slate-900">GutterPros</span>
          </div>
          <div className="text-sm text-slate-500">
            {companies.length} Companies Listed
          </div>
        </div>
        
        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search companies or services..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-64">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                onView={onSelectCompany} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};