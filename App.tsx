
import React, { useState, useEffect } from 'react';
import { Company, ViewState } from './types';
import { parseCSV } from './utils/csvParser';
import { generateSlug, getCompanyFromSlug } from './utils/slugUtils';
import { DataService } from './services/dataService';
import { Hero } from './components/Hero';
import { AdminDashboard } from './components/AdminDashboard';
import { CompanyCard } from './components/CompanyCard';
import { Footer } from './components/Footer';
import { DirectoryView } from './views/DirectoryView';
import { CompanyProfileView } from './views/CompanyProfileView';
import { Lock, Unlock, X, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.UPLOAD);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Admin/Upload States
  const [showAdminPanel, setShowAdminPanel] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // 1. Initial Data Load (Async for Firebase)
  useEffect(() => {
    const initApp = async () => {
      const data = await DataService.loadState();
      if (data.companies.length > 0) {
        setCompanies(data.companies);
      }
      setIsInitialized(true);
    };
    initApp();
  }, []);

  // 2. History API Routing Logic
  useEffect(() => {
    if (!isInitialized) return;

    const handleLocationChange = () => {
      const path = window.location.pathname; // e.g. /elite-gutter-pros-austin-tx
      
      // Home
      if (path === '/' || path === '') {
        setViewState(ViewState.UPLOAD);
        setSelectedCompany(null);
        return;
      }
      
      // Directory
      if (path === '/directory') {
        setViewState(ViewState.DIRECTORY);
        setSelectedCompany(null);
        return;
      }

      // Company Profile
      if (companies.length > 0) {
        // Remove leading slash
        const slug = path.substring(1); 
        const foundCompany = getCompanyFromSlug(companies, slug);
        
        if (foundCompany) {
          setSelectedCompany(foundCompany);
          setViewState(ViewState.PROFILE);
          return;
        }
      }

      // Fallback if path not found
      setViewState(ViewState.UPLOAD);
      setSelectedCompany(null);
    };

    // Run once on mount/init
    handleLocationChange();

    // Listen for browser Back/Forward buttons
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [isInitialized, companies]); 

  // 3. Persistence (Save to Firebase/Local)
  useEffect(() => {
    if (isInitialized) {
      // Fire and forget save (async)
      DataService.saveState(companies, ViewState.UPLOAD, null);
    }
  }, [companies, isInitialized]);

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234567890') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleUpload = (csvContent: string) => {
    try {
      const newBatch = parseCSV(csvContent);
      if (newBatch.length > 0) {
         const existingSignatures = new Set(
          companies.map(c => 
            `${c.name.trim().toLowerCase()}|${c.city.trim().toLowerCase()}|${c.state.trim().toLowerCase()}`
          )
        );
        const uniqueNewCompanies: Company[] = [];
        let duplicatesCount = 0;
        newBatch.forEach(company => {
          const signature = `${company.name.trim().toLowerCase()}|${company.city.trim().toLowerCase()}|${company.state.trim().toLowerCase()}`;
          if (existingSignatures.has(signature)) {
            duplicatesCount++;
          } else {
            const uniqueId = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            uniqueNewCompanies.push({ ...company, id: uniqueId });
            existingSignatures.add(signature);
          }
        });

        if (uniqueNewCompanies.length > 0) {
          const updatedCompanies = [...companies, ...uniqueNewCompanies];
          setCompanies(updatedCompanies);
          alert(`Success! Added ${uniqueNewCompanies.length} new professionals.`);
        } else {
           alert(`No new companies added. Duplicates: ${duplicatesCount}`);
        }
      } else {
        alert("No valid companies found in CSV.");
      }
    } catch (e) {
      console.error(e);
      alert("Error parsing CSV file.");
    }
  };

  const handleDeleteCompanies = (ids: string[]) => {
    const idsSet = new Set(ids);
    const newCompanies = companies.filter(c => !idsSet.has(c.id));
    setCompanies(newCompanies);
  };

  const handleResetDB = () => {
    if(confirm("DANGER: This will delete ALL companies from the database. Are you sure?")) {
      setCompanies([]);
      DataService.clearData();
      alert("Database cleared.");
    }
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    if (selectedCompany && selectedCompany.id === updatedCompany.id) {
        setSelectedCompany(updatedCompany);
    }
  };

  // --- NAVIGATION HANDLERS (Update URL Path) ---

  const handleSelectCompany = (company: Company) => {
    const slug = generateSlug(company);
    // Push state to history
    window.history.pushState({}, '', `/${slug}`);
    
    // Manually update React State since pushState doesn't trigger popstate
    setSelectedCompany(company);
    setViewState(ViewState.PROFILE);
    window.scrollTo(0, 0);
  };

  const goToDirectory = () => {
    window.history.pushState({}, '', '/directory');
    setViewState(ViewState.DIRECTORY);
    window.scrollTo(0, 0);
  };

  const handleBackToDirectory = () => {
    goToDirectory();
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    setViewState(ViewState.UPLOAD);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const toggleAdmin = () => {
    setShowAdminPanel(!showAdminPanel);
    if (!showAdminPanel) {
      setTimeout(() => {
        document.getElementById('admin-panel')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* VIEW: HOME PAGE (ViewState.UPLOAD) */}
      {viewState === ViewState.UPLOAD && (
        <>
          <Hero 
            onStart={toggleAdmin} 
            hasData={companies.length > 0} 
            onResume={goToDirectory}
            companyCount={companies.length}
          />

          {companies.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold text-slate-900">Newest Professionals</h2>
                   <p className="text-slate-500 mt-2">Recently added gutter experts ready to help you.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {companies.slice(-12).reverse().map(company => (
                      <CompanyCard 
                        key={company.id} 
                        company={company} 
                        onView={handleSelectCompany} 
                      />
                   ))}
                </div>

                <div className="mt-16 text-center">
                  <button 
                    onClick={goToDirectory}
                    className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-bold px-8 py-3 rounded-full hover:bg-slate-50 hover:text-blue-600 transition-all hover:scale-105 shadow-sm"
                  >
                    <LayoutGrid size={20} />
                    View All {companies.length} Companies
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <Footer />
        </>
      )}

      {/* VIEW: DIRECTORY */}
      {viewState === ViewState.DIRECTORY && (
        <DirectoryView 
          companies={companies} 
          onSelectCompany={handleSelectCompany}
          onBack={goHome} 
        />
      )}

      {/* VIEW: COMPANY PROFILE */}
      {viewState === ViewState.PROFILE && selectedCompany && (
        <CompanyProfileView 
          company={selectedCompany} 
          allCompanies={companies} 
          onBack={handleBackToDirectory}
          onHome={goHome}
          onViewRelated={handleSelectCompany}
          isAuthenticated={isAuthenticated}
          onLogin={() => setShowAdminPanel(true)}
          onUpdateCompany={handleUpdateCompany}
        />
      )}

      {/* GLOBAL ADMIN MODAL */}
      {showAdminPanel && (
        <div id="admin-panel" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
          <div 
            className={`bg-white w-full rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300 flex flex-col ${
              isAuthenticated ? 'max-w-5xl h-[80vh]' : 'max-w-lg'
            }`}
          >
            
            <button 
              onClick={() => setShowAdminPanel(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className={`p-8 h-full flex flex-col ${isAuthenticated ? 'p-0' : ''}`}>
              {!isAuthenticated ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
                    <p className="text-slate-500">Enter password to edit listings or manage data.</p>
                  </div>
                  <div className="max-w-sm mx-auto w-full">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                          <Lock size={24} />
                        </div>
                      </div>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                          <input 
                            type="password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="••••••••••"
                            autoFocus
                          />
                          {authError && <p className="text-red-500 text-sm mt-2">Incorrect password.</p>}
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Login
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                   <div className="bg-slate-900 text-white px-8 py-4 flex items-center gap-3 shrink-0">
                      <Unlock size={20} className="text-green-400" />
                      <h2 className="font-bold text-lg">Admin Control Center</h2>
                   </div>
                   <div className="flex-1 overflow-hidden p-6">
                      <AdminDashboard 
                        companies={companies} 
                        onUpload={handleUpload}
                        onDelete={handleDeleteCompanies}
                        onUpdate={handleUpdateCompany}
                        onReset={handleResetDB}
                      />
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
