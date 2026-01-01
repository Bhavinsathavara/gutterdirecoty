import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { enhanceCompanyProfile } from '../services/geminiService';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Check, Star, Sparkles, ShieldCheck, Clock, Download } from 'lucide-react';

interface CompanyProfileViewProps {
  company: Company;
  onBack: () => void;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({ company: initialCompany, onBack }) => {
  const [company, setCompany] = useState<Company>(initialCompany);
  const [loading, setLoading] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  // Update document title when company loads - Strictly Company Name
  useEffect(() => {
    document.title = `${company.name}`;
  }, [company.name]);

  const handleEnhance = async () => {
    setLoading(true);
    const enhancement = await enhanceCompanyProfile(company);
    setCompany(prev => ({ ...prev, ...enhancement }));
    setLoading(false);
    setIsEnhanced(true);
  };

  const handleExportHTML = () => {
    // STRICT: Title is Name only. Description is Meta only.
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${company.name}</title>
  <meta name="description" content="${company.description ? company.description.replace(/"/g, '&quot;') : `Professional gutter services provided by ${company.name} in ${company.city}, ${company.state}.`}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-white text-slate-900">
  <nav class="border-b border-slate-100 bg-white sticky top-0 z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="font-bold text-xl text-slate-900">GutterPros Directory</div>
      <div class="flex items-center gap-4">
        <a href="tel:${company.phone}" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Call Now</a>
      </div>
    </div>
  </nav>

  <div class="bg-slate-900 text-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Verified Pro</span>
        ${company.rating ? `<div class="flex items-center gap-1 text-yellow-400 font-bold text-sm"><span>★</span><span>${company.rating} / 5.0 Rating</span></div>` : ''}
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-4">${company.name}</h1>
      <div class="flex items-center gap-2 text-slate-300 text-lg mb-8">
        <span>📍 Serving ${company.city}, ${company.state}</span>
      </div>
      <div class="flex flex-wrap gap-4">
        <a href="tel:${company.phone}" class="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
          Call ${company.phone}
        </a>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 space-y-12">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-6">About Us</h2>
          <p class="text-slate-600 leading-relaxed text-lg">${company.description || "Professional gutter services."}</p>
        </section>
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Our Services</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${(company.services || []).map(s => `
              <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                <div class="text-blue-600 font-bold">✓</div>
                <span class="font-medium text-slate-800">${s}</span>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
      <div class="space-y-8">
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 class="font-bold text-slate-900 mb-6">Contact Info</h3>
          <div class="space-y-4">
             <div class="text-slate-600">
                <div class="text-xs font-bold text-slate-400 uppercase">Address</div>
                <div class="font-medium text-slate-900">${company.address || 'Service Area'}, ${company.city}, ${company.state} ${company.zip || ''}</div>
             </div>
             ${company.website ? `
             <div class="text-slate-600">
                <div class="text-xs font-bold text-slate-400 uppercase">Website</div>
                <a href="${company.website.startsWith('http') ? company.website : 'https://' + company.website}" class="font-medium text-blue-600 truncate block">${company.website}</a>
             </div>` : ''}
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
    <p>&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_profile.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="text-sm font-semibold text-slate-400">GutterPros Directory</div>
          </div>
          
          <button 
            onClick={handleExportHTML}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download size={16} />
            Export Page as HTML
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified Pro
                </span>
                {company.rating && (
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                    <Star fill="currentColor" size={14} />
                    <span>{company.rating} / 5.0 Rating</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{company.name}</h1>
              <div className="flex items-center gap-2 text-slate-300 text-lg mb-8">
                <MapPin size={20} className="text-blue-400" />
                <span>Serving {company.city}, {company.state} and surrounding areas</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href={`tel:${company.phone}`} className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Phone size={18} />
                  {company.phone}
                </a>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Mail size={18} />
                  Request Quote
                </button>
              </div>
            </div>
            
            {/* AI Enhancement CTA */}
            {!isEnhanced && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-sm w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">AI Profile Enhancer</h3>
                    <p className="text-slate-400 text-sm mt-1 mb-4">
                      Use Gemini AI to generate a professional description and highlight key services for this profile.
                    </p>
                    <button 
                      onClick={handleEnhance}
                      disabled={loading}
                      className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2 rounded-lg font-semibold text-sm transition-colors flex justify-center items-center gap-2"
                    >
                      {loading ? 'Analyzing...' : 'Generate Premium Profile'}
                      {!loading && <Sparkles size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                About Us
                {isEnhanced && <span className="text-purple-600 text-xs bg-purple-50 px-2 py-1 rounded border border-purple-100">AI Generated</span>}
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                <p>
                  {company.description || "We are a dedicated gutter service provider committed to protecting your home from water damage. With years of experience in the industry, our team delivers high-quality installation, repair, and cleaning services tailored to your specific needs. Customer satisfaction is our top priority."}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.services?.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="font-medium text-slate-800">{service}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to get started?</h3>
                  <p className="text-slate-600">Contact {company.name} today for a free inspection and estimate.</p>
                </div>
                <a 
                  href={`tel:${company.phone}`}
                  className="whitespace-nowrap bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Call {company.phone}
                </a>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Address</div>
                    <div className="text-sm font-medium text-slate-900">
                      {company.address ? company.address : 'Service Area Only'}<br/>
                      {company.city}, {company.state} {company.zip}
                    </div>
                  </div>
                </div>

                {company.website && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                      <Globe size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 uppercase">Website</div>
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium text-blue-600 hover:underline truncate block"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Hours</div>
                    <div className="text-sm font-medium text-slate-900">Mon - Fri: 8:00 AM - 6:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                 <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg text-sm font-medium">
                    <ShieldCheck size={16} />
                    Licensed & Insured
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};