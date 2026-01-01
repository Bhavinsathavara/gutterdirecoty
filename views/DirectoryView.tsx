import React, { useState, useMemo, useEffect } from 'react';
import { Company } from '../types';
import { CompanyCard } from '../components/CompanyCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Search, MapPin, SlidersHorizontal, Settings, RefreshCw, ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface DirectoryViewProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onBack: () => void; // This will now trigger Admin Panel
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ companies, onSelectCompany, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset title on mount
  useEffect(() => {
    document.title = "GutterPros - Find Local Services";
    window.scrollTo(0, 0);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter]);

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

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set(companies.map(c => c.state));
    return Array.from(locs).sort();
  }, [companies]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results grid
    const gridElement = document.getElementById('results-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16">
      
      {/* 1. Header */}
      <Header 
        onLogoClick={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg"
              title="Admin Access"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Admin / Upload</span>
            </button>
          </div>
        }
      />

      {/* 2. Hero Search Section */}
      <div className="bg-slate-900 pb-24 pt-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Find the Best Gutter Pros Near You
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Explore {companies.length} verified professionals for installation, cleaning, and repair.
            </p>

            {/* Search Bar Container */}
            <div className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-12 pr-4 py-3 rounded-lg outline-none text-slate-900 placeholder-slate-400 focus:bg-slate-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-px bg-slate-200 hidden md:block"></div>
              <div className="md:w-1/3 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select 
                  className="w-full pl-12 pr-10 py-3 rounded-lg outline-none text-slate-900 appearance-none bg-white cursor-pointer hover:bg-slate-50"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All States</option>
                  {uniqueLocations.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
         </div>
      </div>

      {/* 3. Results Grid */}
      <main id="results-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20 flex-1 w-full">
        
        {/* Stats Row */}
        <div className="flex items-center justify-between text-slate-500 text-sm mb-6 px-2">
           <span>Showing {paginatedCompanies.length} of {filteredCompanies.length} results</span>
           {(locationFilter || searchTerm) && (
             <button 
               onClick={() => {setLocationFilter(''); setSearchTerm('');}}
               className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
             >
               <RefreshCw size={12} /> Clear filters
             </button>
           )}
        </div>

        {filteredCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
              {paginatedCompanies.map(company => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  onView={onSelectCompany} 
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none px-2 scrollbar-hide">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No pros found matching your criteria</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              We couldn't find any companies for "{searchTerm}" in {locationFilter || 'all locations'}. Try clearing your filters or searching for "gutter cleaning".
            </p>
            <button 
               onClick={() => {setSearchTerm(''); setLocationFilter('');}}
               className="mt-6 text-blue-600 font-bold hover:underline"
            >
              View All Companies
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};