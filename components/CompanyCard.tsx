import React from 'react';
import { MapPin, Star, Phone, ArrowRight } from 'lucide-react';
import { Company } from '../types';
import { generateSlug } from '../utils/slugUtils';

interface CompanyCardProps {
  company: Company;
  onView: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onView }) => {
  const slug = generateSlug(company);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onView(company);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{company.name}</h3>
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
              <MapPin size={14} />
              <span>{company.city}, {company.state}</span>
            </div>
          </div>
          {company.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
              <Star size={12} fill="currentColor" />
              <span>{company.rating}</span>
            </div>
          )}
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {company.description || `Professional gutter services in ${company.city}. We provide top-quality installation and maintenance.`}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {company.services?.slice(0, 3).map((service, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
              {service}
            </span>
          ))}
          {(company.services?.length || 0) > 3 && (
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
              +{company.services!.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <Phone size={14} />
          <span>{company.phone || 'Contact for info'}</span>
        </div>
        <a 
          href={`/${slug}`}
          onClick={handleClick}
          className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          View Profile <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
};