import React, { useState, useEffect } from 'react';
import { Company, ViewState } from './types';
import { parseCSV } from './utils/csvParser';
import { DataService } from './services/dataService'; // Import "Backend" service
import { Hero } from './components/Hero';
import { FileUpload } from './components/FileUpload';
import { DirectoryView } from './views/DirectoryView';
import { CompanyProfileView } from './views/CompanyProfileView';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.UPLOAD);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Initial Load (Simulating Backend Fetch on Startup)
  useEffect(() => {
    const data = DataService.loadState();
    
    if (data.companies.length > 0) {
      setCompanies(data.companies);
      
      // If we were viewing a specific profile, try to restore it
      if (data.viewState === ViewState.PROFILE && data.selectedCompanyId) {
        const company = DataService.getCompanyById(data.companies, data.selectedCompanyId);
        if (company) {
          setSelectedCompany(company);
          setViewState(ViewState.PROFILE);
        } else {
          setViewState(ViewState.DIRECTORY);
        }
      } else {
        setViewState(data.viewState);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Persistence Effect (Sync Frontend state to "Backend")
  useEffect(() => {
    if (isInitialized) {
      DataService.saveState(companies, viewState, selectedCompany?.id || null);
    }
  }, [companies, viewState, selectedCompany, isInitialized]);

  // Handlers
  const handleUpload = (csvContent: string) => {
    try {
      const parsedCompanies = parseCSV(csvContent);
      if (parsedCompanies.length > 0) {
        setCompanies(parsedCompanies);
        setViewState(ViewState.DIRECTORY);
        // Data is automatically saved via the useEffect above
      } else {
        alert("No valid companies found in CSV.");
      }
    } catch (e) {
      console.error(e);
      alert("Error parsing CSV file.");
    }
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setViewState(ViewState.PROFILE);
  };

  const handleBackToDirectory = () => {
    setSelectedCompany(null);
    setViewState(ViewState.DIRECTORY);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure? This will delete the current directory data.")) {
      setCompanies([]);
      setSelectedCompany(null);
      setViewState(ViewState.UPLOAD);
      DataService.clearData(); // Clear backend storage
    }
  };

  // Prevent flash of content during initialization
  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {viewState === ViewState.UPLOAD && (
        <>
          <Hero onStart={() => {
            const el = document.getElementById('upload-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }} />
          <div id="upload-section" className="py-20 bg-white">
             <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-10">
                   <h2 className="text-3xl font-bold text-slate-900">Upload Data</h2>
                   <p className="text-slate-500 mt-2">Generate your directory instantly.</p>
                </div>
                <FileUpload onUpload={handleUpload} />
             </div>
          </div>
        </>
      )}

      {viewState === ViewState.DIRECTORY && (
        <DirectoryView 
          companies={companies} 
          onSelectCompany={handleSelectCompany}
          onBack={handleReset}
        />
      )}

      {viewState === ViewState.PROFILE && selectedCompany && (
        <CompanyProfileView 
          company={selectedCompany} 
          onBack={handleBackToDirectory} 
        />
      )}
    </div>
  );
};

export default App;