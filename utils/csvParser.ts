
import { Company } from '../types';

export const parseCSV = (content: string): Company[] => {
  const lines = content.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  
  const companies: Company[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting handling quotes
    const currentLine = lines[i];
    const values: string[] = [];
    let inQuotes = false;
    let currentValue = '';

    for (let char of currentLine) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    const company: any = { id: `comp-${i}` };
    
    headers.forEach((header, index) => {
      const val = values[index] || '';
      
      // Strict Priority Mapping based on user provided CSV structure:
      // Company Name,Website URL,Email,Phone,Address,City,State,Location,Facebook URL,Instagram URL,LinkedIn URL,X (Twitter) URL,Company Description

      if (header === 'company name' || header === 'name') {
        company.name = val;
      }
      else if (header === 'company description' || header === 'description') {
        company.description = val;
      }
      else if (header === 'website url' || header === 'website') {
        company.website = val;
      }
      else if (header === 'email') {
        company.email = val;
      }
      else if (header === 'phone') {
        company.phone = val;
      }
      else if (header === 'address') {
        company.address = val;
      }
      else if (header === 'city') {
        company.city = val;
      }
      else if (header === 'state') {
        company.state = val;
      }
      else if (header === 'location') {
        // Map 'Location' column to locationLabel to avoid overwriting specific Address
        company.locationLabel = val;
      }
      else if (header.includes('zip') || header.includes('postal')) {
        company.zip = val;
      }
      else if (header.includes('rat') || header.includes('star')) {
        company.rating = parseFloat(val) || 0;
      }
      else if (header.includes('service')) {
        company.services = val.split(/[;,]/).map(s => s.trim()).filter(s => s.length > 0);
      }
      // Social Media Mappings
      else if (header.includes('facebook')) {
        company.facebookUrl = val;
      }
      else if (header.includes('instagram')) {
        company.instagramUrl = val;
      }
      else if (header.includes('linkedin')) {
        company.linkedinUrl = val;
      }
      else if (header.includes('twitter') || header.includes('(x)')) {
        company.twitterUrl = val;
      }
      else {
        // Fallback for fuzzy matching if exact headers aren't found
        if (!company.description && (header.includes('desc') || header.includes('about'))) company.description = val;
        if (!company.website && (header.includes('web') || header.includes('url')) && !header.includes('facebook') && !header.includes('instagram') && !header.includes('linkedin') && !header.includes('twitter')) company.website = val;
        if (!company.address && header.includes('street')) company.address = val;
      }
    });

    // Fallback/Cleanup
    if (!company.name || company.name.length === 0) {
       company.name = `Company ${i}`;
    }
    
    // Default Services if missing
    if (!company.services || !Array.isArray(company.services) || company.services.length === 0) {
      company.services = ["Gutter Installation", "Gutter Repair", "Cleaning"];
    }
    
    companies.push(company as Company);
  }

  return companies;
};

export const getSampleCSV = () => {
  return `Company Name,Website URL,Email,Phone,Address,City,State,Location,Facebook URL,Instagram URL,LinkedIn URL,X (Twitter) URL,Company Description
"LeafGuard Gutters","https://www.leafguard.com","info@leafguard.com","+1-800-290-6106","1595 Georgetown Rd","Hudson","OH","Hudson, Ohio, USA","https://www.facebook.com/LeafGuard","https://www.instagram.com/leafguard","https://www.linkedin.com/company/leafguard","","LeafGuard Gutters is a nationally recognized gutter installation company..."`;
};
