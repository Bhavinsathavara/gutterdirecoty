
export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  locationLabel?: string; // Stores the "Location" column (e.g. "Hudson, Ohio, USA")
  rating?: number;
  services?: string[];
  description?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  [key: string]: any; // Allow other CSV columns
}

export enum ViewState {
  UPLOAD = 'UPLOAD',
  DIRECTORY = 'DIRECTORY',
  PROFILE = 'PROFILE'
}

export type SortOption = 'name' | 'rating' | 'city';
