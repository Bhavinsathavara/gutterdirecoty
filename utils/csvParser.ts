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
      
      // Strict Priority Mapping to avoid "Company Description" becoming "Company Name"
      
      // 1. First check for Description fields (highest priority to filter out)
      if (header.includes('desc') || header.includes('about') || header.includes('bio') || header.includes('info')) {
        company.description = val;
      } 
      // 2. Then check for Name/Title fields
      else if (header.includes('name') || header.includes('company') || header.includes('business') || header.includes('title')) {
        company.name = val;
      }
      // 3. Address fields
      else if (header.includes('address') || header.includes('street') || header.includes('location')) {
        company.address = val;
      }
      else if (header.includes('city') || header.includes('town')) {
        company.city = val;
      }
      else if (header.includes('state') || header.includes('province') || header.includes('region')) {
        company.state = val;
      }
      else if (header.includes('zip') || header.includes('postal') || header.includes('code')) {
        company.zip = val;
      }
      // 4. Contact fields
      else if (header.includes('phone') || header.includes('tel') || header.includes('mobile') || header.includes('cell')) {
        company.phone = val;
      }
      else if (header.includes('email') || header.includes('mail')) {
        company.email = val;
      }
      else if (header.includes('web') || header.includes('url') || header.includes('site') || header.includes('link')) {
        company.website = val;
      }
      // 5. Other details
      else if (header.includes('rat') || header.includes('star')) {
        company.rating = parseFloat(val) || 0;
      }
      else if (header.includes('service') || header.includes('offer')) {
        company.services = val.split(/[;,]/).map(s => s.trim()).filter(s => s.length > 0);
      }
      else {
        company[header] = val; // Store extra fields
      }
    });

    // Fallback/Cleanup
    if (!company.name || company.name.length === 0) {
       company.name = `Company ${i}`;
    }
    
    // Ensure services is an array
    if (!company.services || !Array.isArray(company.services) || company.services.length === 0) {
      company.services = ["Gutter Installation", "Gutter Cleaning", "Repair"];
    }
    
    companies.push(company as Company);
  }

  return companies;
};

export const getSampleCSV = () => {
  return `Company Name,City,State,Phone,Website,Rating,Services,Description
"Elite Gutter Pros","Austin","TX","(512) 555-0101","www.elitegutterpros.com",4.8,"Installation;Cleaning;Guards","Top-rated gutter services in Austin."
"Chicago Gutter Works","Chicago","IL","(312) 555-0102","www.chicagogutters.com",4.5,"Seamless Gutters;Repair","Family owned business serving Chicago for 20 years."
"Sunshine State Gutters","Miami","FL","(305) 555-0103","www.sunshinegutters.com",4.9,"Copper Gutters;Installation","Premium copper and aluminum gutter systems."
"RainFlow Systems","Seattle","WA","(206) 555-0104","www.rainflow.com",4.7,"Maintenance;Cleaning","Specializing in heavy rain drainage solutions."`;
};