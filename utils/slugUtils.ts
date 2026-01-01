import { Company } from '../types';

export const generateSlug = (company: Company): string => {
  // Combine Name, City, State for a unique, SEO-rich URL
  const rawString = `${company.name}-${company.city}-${company.state}`;
  return rawString
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens
};

export const getCompanyFromSlug = (companies: Company[], slug: string | null): Company | undefined => {
  if (!slug) return undefined;
  return companies.find(c => generateSlug(c) === slug);
};