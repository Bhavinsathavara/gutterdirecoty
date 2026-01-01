import { Company, ViewState } from '../types';

const STORAGE_KEY = 'gutter_pros_db';
const VIEW_KEY = 'gutter_pros_view';
const SELECTED_ID_KEY = 'gutter_pros_selected_id';

interface AppState {
  companies: Company[];
  viewState: ViewState;
  selectedCompanyId: string | null;
}

// This service acts as your "Backend" interface
export const DataService = {
  // Save entire application state
  saveState: (companies: Company[], view: ViewState, selectedId: string | null) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
      localStorage.setItem(VIEW_KEY, view);
      if (selectedId) {
        localStorage.setItem(SELECTED_ID_KEY, selectedId);
      } else {
        localStorage.removeItem(SELECTED_ID_KEY);
      }
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  },

  // Load state on startup
  loadState: (): AppState => {
    try {
      const storedCompanies = localStorage.getItem(STORAGE_KEY);
      const storedView = localStorage.getItem(VIEW_KEY);
      const storedSelectedId = localStorage.getItem(SELECTED_ID_KEY);

      const companies: Company[] = storedCompanies ? JSON.parse(storedCompanies) : [];
      
      // Default to UPLOAD if no data, otherwise restore view or default to DIRECTORY
      let viewState: ViewState = ViewState.UPLOAD;
      if (companies.length > 0) {
        viewState = (storedView as ViewState) || ViewState.DIRECTORY;
      }

      return {
        companies,
        viewState,
        selectedCompanyId: storedSelectedId || null
      };
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return { companies: [], viewState: ViewState.UPLOAD, selectedCompanyId: null };
    }
  },

  // Clear data (Reset)
  clearData: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VIEW_KEY);
    localStorage.removeItem(SELECTED_ID_KEY);
  },

  // Find a specific company by ID
  getCompanyById: (companies: Company[], id: string): Company | undefined => {
    return companies.find(c => c.id === id);
  }
};