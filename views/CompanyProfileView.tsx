
import React, { useState, useEffect, useMemo } from 'react';
import { Company } from '../types';
import { generateSlug } from '../utils/slugUtils';
import { CompanyCard } from '../components/CompanyCard'; 
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Check, Star, Download, LayoutGrid, Edit, Save, X, Facebook, Instagram, Linkedin, Twitter, AlertCircle } from 'lucide-react';

interface CompanyProfileViewProps {
  company: Company;
  allCompanies: Company[];
  onBack: () => void;
  onHome: () => void;
  onViewRelated?: (company: Company) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onUpdateCompany: (company: Company) => void;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({ 
  company: initialCompany, 
  allCompanies, 
  onBack,
  onHome, 
  onViewRelated,
  isAuthenticated,
  onLogin,
  onUpdateCompany
}) => {
  const [company, setCompany] = useState<Company>(initialCompany);
  
  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Company>(initialCompany);
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  // Update local state if prop changes (e.g. from nav)
  useEffect(() => {
    setCompany(initialCompany);
    setEditForm(initialCompany);
    setIsEditing(false);
    setWebsiteError(null);
  }, [initialCompany]);

  // SEO & Schema.org Update
  useEffect(() => {
    const pageTitle = `${company.name} - ${company.city}, ${company.state} | GutterPros Directory`;
    const pageDescription = `${company.name} provides top-rated gutter services in ${company.city}, ${company.state}. ${company.description ? company.description.substring(0, 155).trim() + (company.description.length > 155 ? '...' : '') : `Contact us today for professional gutter installation, repair, and cleaning services in ${company.state}.`}`;
    const pageUrl = window.location.href;
    const pageImage = "https://images.unsplash.com/photo-1621253457065-22709cb1db64?auto=format&fit=crop&q=80&w=1200"; // High-res for OG

    // 1. Update Title
    document.title = pageTitle;
    window.scrollTo(0, 0);

    // 2. Helper to manage meta tags
    const setMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('description', pageDescription);

    // Open Graph / Facebook / LinkedIn
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDescription, 'property');
    setMeta('og:image', pageImage, 'property');
    setMeta('og:url', pageUrl, 'property');
    setMeta('og:type', 'business.business', 'property');
    setMeta('og:site_name', 'GutterPros Directory', 'property');

    // Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', pageUrl);

    // 3. Generate JSON-LD Structured Data
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": company.name,
      "description": company.description,
      "telephone": company.phone,
      "url": pageUrl,
      "priceRange": "$$",
      "image": [
        "https://images.unsplash.com/photo-1621253457065-22709cb1db64?auto=format&fit=crop&q=80&w=1000"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": company.address,
        "addressLocality": company.city,
        "addressRegion": company.state,
        "postalCode": company.zip,
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "City",
        "name": company.city,
        "address": {
            "@type": "PostalAddress",
            "addressRegion": company.state,
            "addressCountry": "US"
        }
      },
      "makesOffer": company.services?.map(service => ({
        "@type": "Offer",
        "itemOffered": {
            "@type": "Service",
            "name": service
        }
      })),
      "sameAs": [
        company.website,
        company.facebookUrl,
        company.instagramUrl,
        company.linkedinUrl,
        company.twitterUrl
      ].filter(Boolean)
    };

    if (company.rating) {
        // @ts-ignore
        schemaData.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": company.rating,
            "bestRating": "5",
            "ratingCount": "25" // Placeholder count for display logic
        };
    }

    // Inject Script into Head
    let script = document.querySelector('#json-ld-schema');
    if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

  }, [company]);

  const relatedCompanies = useMemo(() => {
    return allCompanies
      .filter(c => c.id !== company.id)
      .map(c => {
        let score = 0;
        if (c.city === company.city) score += 10;
        if (c.state === company.state) score += 5;
        if (c.rating && c.rating >= 4.0) score += 2;
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [company, allCompanies]);

  const toggleEdit = () => {
    if (!isAuthenticated) {
      onLogin();
    } else {
      if (isEditing) {
        // Cancel logic
        setEditForm(company);
        setIsEditing(false);
        setWebsiteError(null);
      } else {
        // Start edit
        setEditForm(company);
        setIsEditing(true);
        setWebsiteError(null);
      }
    }
  };

  const handleSave = () => {
    if (websiteError) {
      alert("Please fix the validation errors before saving.");
      return;
    }
    // Process services from string if needed (though we bind inputs)
    // Here we assume editForm.services is already array or we fix it
    onUpdateCompany(editForm);
    setCompany(editForm);
    setIsEditing(false);
    alert("Changes saved successfully!");
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
     const val = e.target.value;
     setEditForm({
       ...editForm,
       services: val.split(',').map(s => s.trim())
     });
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditForm({...editForm, website: val});
    
    if (!val) {
      setWebsiteError(null);
      return;
    }

    // Regex to validate that the string looks like a domain name
    // Matches: (optional http/s) + (subdomain.) + domain + .tld + (path)
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    
    if (!urlPattern.test(val)) {
      setWebsiteError("Please enter a valid URL (e.g. example.com)");
    } else {
      setWebsiteError(null);
    }
  };

  const handleExportHTML = () => {
    const slug = generateSlug(company);
    
    // Schema Data for Static HTML (Mirroring the useEffect schema)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": company.name,
      "description": company.description,
      "telephone": company.phone,
      "priceRange": "$$",
      "image": [
        "https://images.unsplash.com/photo-1621253457065-22709cb1db64?auto=format&fit=crop&q=80&w=1000"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": company.address,
        "addressLocality": company.city,
        "addressRegion": company.state,
        "postalCode": company.zip,
        "addressCountry": "US"
      },
      "makesOffer": company.services?.map(service => ({
        "@type": "Offer",
        "itemOffered": {
            "@type": "Service",
            "name": service
        }
      })),
      "sameAs": [
        company.website,
        company.facebookUrl,
        company.instagramUrl,
        company.linkedinUrl,
        company.twitterUrl
      ].filter(Boolean)
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${company.name} | ${company.city}, ${company.state} Gutter Service</title>
  <meta name="description" content="${company.description ? company.description.replace(/"/g, '&quot;') : `Professional gutter services provided by ${company.name} in ${company.city}, ${company.state}.`}">
  
  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="${company.name} - ${company.city}, ${company.state} Gutter Services" />
  <meta property="og:description" content="Verified gutter professional in ${company.city}, ${company.state}. Services include ${company.services?.slice(0, 3).join(', ')}." />
  <meta property="og:type" content="business.business" />
  <meta property="og:image" content="https://images.unsplash.com/photo-1621253457065-22709cb1db64?auto=format&fit=crop&q=80&w=1200" />
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <script type="application/ld+json">
    ${JSON.stringify(schemaData)}
  </script>
  <style>body { font-family: sans-serif; }</style>
</head>
<body class="bg-white text-slate-900">
  <header class="bg-slate-900 text-white py-20 px-8">
    <h1 class="text-4xl font-bold mb-4">${company.name}</h1>
    <p class="text-xl">Serving ${company.city}, ${company.state}</p>
    <div class="flex gap-4 mt-6">
      <a href="tel:${company.phone}" class="bg-blue-600 text-white px-6 py-3 rounded font-bold">Call ${company.phone}</a>
      ${company.email ? `<a href="mailto:${company.email}" class="bg-white text-slate-900 px-6 py-3 rounded font-bold">Email Us</a>` : ''}
    </div>
  </header>
  <main class="max-w-4xl mx-auto py-12 px-8">
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4">About Us</h2>
      <p class="mb-8 text-lg text-slate-700">${company.description || "Contact us for services."}</p>
    </section>
    
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Services</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${(company.services || []).map(s => `<li class="flex items-center gap-2"><span class="text-blue-600 font-bold">✓</span> ${s}</li>`).join('')}
      </ul>
    </section>

    <address class="bg-slate-50 p-6 rounded border border-slate-200 not-italic">
      <h3 class="font-bold mb-4 text-xl">Contact Information</h3>
      <p class="mb-2"><strong>Address:</strong><br/> ${company.address || ''}, ${company.city}, ${company.state} ${company.zip || ''}</p>
      ${company.website ? `<p class="mb-2"><strong>Website:</strong><br/> <a href="${company.website}" class="text-blue-600">${company.website}</a></p>` : ''}
      ${company.email ? `<p class="mb-2"><strong>Email:</strong><br/> ${company.email}</p>` : ''}
      
      <div class="flex gap-4 mt-6">
        ${company.facebookUrl ? `<a href="${company.facebookUrl}" target="_blank" style="font-size: 24px; color: #1877F2;" aria-label="Facebook"><i class="fab fa-facebook"></i></a>` : ''}
        ${company.instagramUrl ? `<a href="${company.instagramUrl}" target="_blank" style="font-size: 24px; color: #E4405F;" aria-label="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
        ${company.linkedinUrl ? `<a href="${company.linkedinUrl}" target="_blank" style="font-size: 24px; color: #0A66C2;" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
        ${company.twitterUrl ? `<a href="${company.twitterUrl}" target="_blank" style="font-size: 24px; color: #000000;" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>` : ''}
      </div>
    </address>
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-300 pt-16">
      
      {/* Header */}
      <Header 
        onLogoClick={onHome}
        actions={
          <div className="flex gap-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="w-px bg-slate-200 mx-1"></div>

            <button 
              onClick={toggleEdit}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                isEditing 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isEditing ? <><X size={16} /> Cancel</> : <><Edit size={16} /> Edit</>}
            </button>

            {isEditing && (
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                <Save size={16} /> Save
              </button>
            )}

            <button 
              onClick={handleExportHTML}
              className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Download size={16} />
              Export HTML
            </button>
          </div>
        }
      />

      <div className="flex-1">
        <article itemScope itemType="https://schema.org/HomeAndConstructionBusiness">
            {/* Hero Section */}
            <header className="bg-slate-900 text-white py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isEditing && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded font-bold text-xs">
                    EDIT MODE ACTIVE
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Verified Pro</span>
                       {company.rating && (
                          <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                            <Star fill="currentColor" size={14} />
                            <span itemProp="ratingValue">{company.rating}</span> / <span itemProp="bestRating">5.0</span>
                            <meta itemProp="ratingCount" content="25" />
                          </div>
                       )}
                    </div>
                    
                    {/* EDITABLE: NAME */}
                    {isEditing ? (
                      <input 
                        className="text-4xl md:text-6xl font-bold mb-4 bg-slate-800 text-white border border-slate-600 rounded p-2 w-full"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <h1 className="text-4xl md:text-6xl font-bold mb-4" itemProp="name">{company.name}</h1>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-slate-300 text-lg mb-8">
                      <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-blue-400" />
                        {/* EDITABLE: CITY / STATE */}
                        {isEditing ? (
                          <div className="flex gap-2 text-black">
                            <input 
                              placeholder="City"
                              className="px-2 py-1 rounded text-sm w-32"
                              value={editForm.city}
                              onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                            />
                            <input 
                              placeholder="State"
                              className="px-2 py-1 rounded text-sm w-16"
                              value={editForm.state}
                              onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                            />
                          </div>
                        ) : (
                          <span>
                             Serving {company.city}, {company.state}
                             {/* Show Location Label in Hero only if it's very different */}
                             {company.locationLabel && !company.locationLabel.includes(company.city) && <span className="text-slate-500 ml-2 text-sm">({company.locationLabel})</span>}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {isEditing ? (
                         <div className="flex flex-col gap-2 w-full max-w-md">
                           <input 
                             placeholder="Phone Number"
                             className="bg-white text-slate-900 px-4 py-2 rounded font-bold border-none"
                             value={editForm.phone}
                             onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                           />
                           <input 
                             placeholder="Email Address"
                             className="bg-white text-slate-900 px-4 py-2 rounded font-bold border-none"
                             value={editForm.email || ''}
                             onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                           />
                         </div>
                      ) : (
                        <>
                          <a href={`tel:${company.phone}`} className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                              <Phone size={18} />
                              <span itemProp="telephone">{company.phone}</span>
                          </a>
                          {company.email && (
                            <a href={`mailto:${company.email}`} className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                                <Mail size={18} />
                                Email Us
                            </a>
                          )}
                        </>
                      )}
                    </div>
                </div>
                </div>
            </div>
            </header>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">About Us</h2>
                    {/* EDITABLE: DESCRIPTION */}
                    {isEditing ? (
                      <textarea 
                        className="w-full h-64 p-4 border border-slate-300 rounded-lg text-lg leading-relaxed focus:ring-2 focus:ring-blue-500 font-sans"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        placeholder="Enter company description..."
                      />
                    ) : (
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg whitespace-pre-wrap" itemProp="description">
                        {company.description || "We are a dedicated gutter service provider committed to protecting your home from water damage."}
                      </div>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Services</h2>
                    {/* EDITABLE: SERVICES */}
                    {isEditing ? (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Separate services with commas (e.g., Installation, Repair, Cleaning)</p>
                        <textarea 
                          className="w-full h-32 p-4 border border-slate-300 rounded-lg"
                          value={editForm.services?.join(', ') || ''}
                          onChange={handleServiceChange}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {company.services?.map((service, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm" itemProp="makesOffer" itemScope itemType="https://schema.org/Offer">
                              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                                  <Check size={14} strokeWidth={3} />
                              </div>
                              <span className="font-medium text-slate-800" itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                                <span itemProp="name">{service}</span>
                              </span>
                            </div>
                        ))}
                      </div>
                    )}
                </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                <address className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24 not-italic">
                    <h3 className="font-bold text-slate-900 mb-6">Contact Information</h3>
                    
                    <div className="space-y-4">
                      {/* ADDRESS */}
                      <div className="flex items-start gap-3 text-slate-600" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                          <MapPin size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-slate-400 uppercase">Address</div>
                            {isEditing ? (
                               <div className="flex flex-col gap-1 mt-1">
                                  <input 
                                    className="w-full border p-1 rounded text-sm"
                                    value={editForm.address || ''}
                                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                    placeholder="Street Address (e.g. 123 Main St)"
                                  />
                                  <div className="flex gap-1">
                                    <input 
                                      className="w-full border p-1 rounded text-sm"
                                      value={editForm.zip || ''}
                                      onChange={(e) => setEditForm({...editForm, zip: e.target.value})}
                                      placeholder="Zip Code"
                                    />
                                  </div>
                                  <input 
                                    className="w-full border p-1 rounded text-sm"
                                    value={editForm.locationLabel || ''}
                                    onChange={(e) => setEditForm({...editForm, locationLabel: e.target.value})}
                                    placeholder="Full Location Label (Optional)"
                                  />
                               </div>
                            ) : (
                              <div className="text-sm font-medium text-slate-900 mt-1">
                                  {/* Line 1: Street Address */}
                                  {company.address && (
                                    <div className="mb-0.5" itemProp="streetAddress">{company.address}</div>
                                  )}
                                  
                                  {/* Line 2: City, State Zip */}
                                  <div className="mb-0.5">
                                    <span itemProp="addressLocality">{company.city}</span>, <span itemProp="addressRegion">{company.state}</span> <span itemProp="postalCode">{company.zip}</span>
                                  </div>

                                  {/* Line 3: Location Label (Fallback or Extra) */}
                                  {/* If no street address is known, show the full location label if available. */}
                                  {(!company.address && company.locationLabel) && (
                                     <div className="text-slate-600 italic">{company.locationLabel}</div>
                                  )}
                                  <meta itemProp="addressCountry" content="US" />
                              </div>
                            )}
                          </div>
                      </div>

                      {/* EMAIL */}
                      <div className="flex items-start gap-3 text-slate-600">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                          <Mail size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-slate-400 uppercase">Email</div>
                            {isEditing ? (
                               <input 
                                 className="w-full border p-1 rounded text-sm mt-1"
                                 value={editForm.email || ''}
                                 onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                 placeholder="info@example.com"
                               />
                            ) : (
                              company.email ? (
                                <a href={`mailto:${company.email}`} className="text-sm font-medium text-blue-600 hover:underline break-all block mt-1" itemProp="email">
                                  {company.email}
                                </a>
                              ) : (
                                <span className="text-sm text-slate-400 mt-1 block">Not Available</span>
                              )
                            )}
                          </div>
                      </div>

                      {/* WEBSITE */}
                      <div className="flex items-start gap-3 text-slate-600">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                            <Globe size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-semibold text-slate-400 uppercase">Website</div>
                            {isEditing ? (
                               <div>
                                 <input 
                                   className={`w-full border p-1 rounded text-sm mt-1 transition-colors ${websiteError ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                   value={editForm.website || ''}
                                   onChange={handleWebsiteChange}
                                   placeholder="www.example.com"
                                 />
                                 {websiteError && (
                                   <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                      <AlertCircle size={10} />
                                      <span>{websiteError}</span>
                                   </div>
                                 )}
                               </div>
                            ) : (
                              company.website && (
                                <a 
                                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm font-medium text-blue-600 hover:underline break-all block mt-1"
                                itemProp="url"
                                >
                                {company.website}
                                </a>
                              )
                            )}
                        </div>
                      </div>
                    </div>

                    {/* SOCIAL MEDIA SECTION */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Connect with Us</h4>
                      
                      {isEditing ? (
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                             <Facebook size={16} className="text-blue-600" />
                             <input 
                               className="w-full border p-1 rounded text-sm"
                               placeholder="Facebook URL"
                               value={editForm.facebookUrl || ''}
                               onChange={(e) => setEditForm({...editForm, facebookUrl: e.target.value})}
                             />
                           </div>
                           <div className="flex items-center gap-2">
                             <Instagram size={16} className="text-pink-600" />
                             <input 
                               className="w-full border p-1 rounded text-sm"
                               placeholder="Instagram URL"
                               value={editForm.instagramUrl || ''}
                               onChange={(e) => setEditForm({...editForm, instagramUrl: e.target.value})}
                             />
                           </div>
                           <div className="flex items-center gap-2">
                             <Linkedin size={16} className="text-blue-700" />
                             <input 
                               className="w-full border p-1 rounded text-sm"
                               placeholder="LinkedIn URL"
                               value={editForm.linkedinUrl || ''}
                               onChange={(e) => setEditForm({...editForm, linkedinUrl: e.target.value})}
                             />
                           </div>
                           <div className="flex items-center gap-2">
                             <Twitter size={16} className="text-slate-800" />
                             <input 
                               className="w-full border p-1 rounded text-sm"
                               placeholder="X (Twitter) URL"
                               value={editForm.twitterUrl || ''}
                               onChange={(e) => setEditForm({...editForm, twitterUrl: e.target.value})}
                             />
                           </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          {company.facebookUrl && (
                            <a 
                              href={company.facebookUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                              title="Facebook"
                              itemProp="sameAs"
                            >
                              <Facebook size={20} />
                            </a>
                          )}
                          {company.instagramUrl && (
                            <a 
                              href={company.instagramUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"
                              title="Instagram"
                              itemProp="sameAs"
                            >
                              <Instagram size={20} />
                            </a>
                          )}
                          {company.linkedinUrl && (
                            <a 
                              href={company.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"
                              title="LinkedIn"
                              itemProp="sameAs"
                            >
                              <Linkedin size={20} />
                            </a>
                          )}
                          {company.twitterUrl && (
                            <a 
                              href={company.twitterUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                              title="X (Twitter)"
                              itemProp="sameAs"
                            >
                              <Twitter size={20} />
                            </a>
                          )}
                          {!company.facebookUrl && !company.instagramUrl && !company.linkedinUrl && !company.twitterUrl && (
                            <span className="text-slate-400 text-sm italic">No social media profiles listed.</span>
                          )}
                        </div>
                      )}
                    </div>

                </address>
                </aside>

            </div>
            </div>
        </article>

        {/* RELATED LISTINGS */}
        {relatedCompanies.length > 0 && (
          <div className="bg-slate-50 py-16 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <LayoutGrid className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-slate-900">Related Professionals in {company.state}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedCompanies.map(related => (
                  <CompanyCard 
                    key={related.id} 
                    company={related} 
                    onView={onViewRelated || onBack} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
