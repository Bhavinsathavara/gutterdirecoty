
import { Company, ViewState } from '../types';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// --- FIREBASE CONFIGURATION ---
// AAPKO YAHAN APNI FIREBASE KEYS DALNI HAIN
// 1. Go to console.firebase.google.com
// 2. Create Project -> Add Web App -> Copy Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (Only if config is set)
let db: any = null;
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (e) {
    console.error("Firebase init error:", e);
  }
}

const STORAGE_KEY = 'gutter_pros_db';
const VIEW_KEY = 'gutter_pros_view';
const SELECTED_ID_KEY = 'gutter_pros_selected_id';

interface AppState {
  companies: Company[];
  viewState: ViewState;
  selectedCompanyId: string | null;
}

// Default Data (Hardcoded fallback)
const DEFAULT_COMPANIES: Company[] = [
  {
    id: "comp-default-1",
    name: "LeafGuard Gutters",
    website: "https://www.leafguard.com",
    email: "info@leafguard.com",
    phone: "+1-800-290-6106",
    address: "1595 Georgetown Rd",
    city: "Hudson",
    state: "OH",
    zip: "",
    locationLabel: "Hudson, Ohio, USA",
    facebookUrl: "https://www.facebook.com/LeafGuard",
    instagramUrl: "https://www.instagram.com/leafguard",
    linkedinUrl: "https://www.linkedin.com/company/leafguard",
    twitterUrl: "",
    description: "LeafGuard Gutters is a nationally recognized gutter installation company in the United States, best known for its patented one-piece seamless gutter system. The company focuses on preventing clogging caused by leaves, debris, and standing water, helping homeowners protect roofs, foundations, and landscaping from water damage. LeafGuard serves residential customers through a wide network of authorized dealers across multiple states. Their services include full gutter replacement, gutter guards, downspout optimization, and water management solutions. LeafGuard also offers warranties on materials and workmanship, providing long-term peace of mind for homeowners.",
    services: ["Gutter Replacement", "Gutter Guards", "Downspout Optimization", "Water Management"],
    rating: 4.8
  },
  {
    id: "comp-default-2",
    name: "Gutter Helmet",
    website: "https://www.gutterhelmet.com",
    email: "info@gutterhelmet.com",
    phone: "+1-800-824-3773",
    address: "1515 E Main St",
    city: "Tipp City",
    state: "OH",
    zip: "",
    locationLabel: "Tipp City, Ohio, USA",
    facebookUrl: "https://www.facebook.com/GutterHelmet",
    instagramUrl: "",
    linkedinUrl: "https://www.linkedin.com/company/gutter-helmet",
    twitterUrl: "",
    description: "Gutter Helmet is a U.S.-based gutter protection company specializing in engineered gutter guard systems designed to handle heavy rainfall and debris. The company offers aluminum gutter covers that fit over existing gutters to prevent clogging while maintaining proper water flow. Gutter Helmet serves homeowners nationwide through professional installation services. Their products are tested for extreme weather conditions and are suitable for diverse climates. The company focuses on long-term performance, reduced maintenance, and customer satisfaction.",
    services: ["Gutter Guard Systems", "Gutter Protection", "Professional Installation"],
    rating: 4.7
  },
  {
    id: "comp-default-3",
    name: "The Brothers That Just Do Gutters",
    website: "https://www.brothersgutters.com",
    email: "info@brothersgutters.com",
    phone: "+1-844-276-8837",
    address: "1120 Rt 73",
    city: "Mount Laurel",
    state: "NJ",
    zip: "",
    locationLabel: "Mount Laurel, New Jersey, USA",
    facebookUrl: "https://www.facebook.com/BrothersGut",
    instagramUrl: "https://www.instagram.com/brothersgutters",
    linkedinUrl: "https://www.linkedin.com/company/the-brothers-that-just-do-gutters",
    twitterUrl: "",
    description: "The Brothers That Just Do Gutters is a U.S.-based gutter services franchise focused exclusively on gutter installation, repair, cleaning, and gutter guard solutions. The company operates through a nationwide franchise model, allowing local service delivery while maintaining consistent quality standards. They emphasize professionalism, transparency, and customer education. Their team provides customized gutter solutions based on roof structure and drainage needs, making them a trusted name in residential gutter services.",
    services: ["Gutter Installation", "Gutter Repair", "Gutter Cleaning", "Gutter Guards"],
    rating: 4.9
  },
  {
    id: "comp-default-4",
    name: "ABC Seamless",
    website: "https://www.abcseamless.com",
    email: "info@abcseamless.com",
    phone: "+1-800-767-8880",
    address: "2510 E Main St",
    city: "Fargo",
    state: "ND",
    zip: "",
    locationLabel: "Fargo, North Dakota, USA",
    facebookUrl: "https://www.facebook.com/ABCSeamless",
    instagramUrl: "",
    linkedinUrl: "https://www.linkedin.com/company/abc-seamless",
    twitterUrl: "",
    description: "ABC Seamless is a U.S.-based home improvement company known for its custom-fit seamless steel siding and gutter systems. The company provides on-site manufactured seamless gutters designed to reduce leaks and improve water drainage efficiency. ABC Seamless operates through a dealer network across multiple states, serving residential homeowners. Their focus on durability, low maintenance, and professional installation has helped them build a strong reputation in the gutter and exterior remodeling industry.",
    services: ["Seamless Steel Gutters", "Siding", "Downspouts", "Water Drainage"],
    rating: 4.6
  },
  {
    id: "comp-default-5",
    name: "Englert Inc.",
    website: "https://www.englertinc.com",
    email: "info@englertinc.com",
    phone: "+1-800-255-4702",
    address: "1200 Amboy Ave",
    city: "Perth Amboy",
    state: "NJ",
    zip: "",
    locationLabel: "Perth Amboy, New Jersey, USA",
    facebookUrl: "https://www.facebook.com/EnglertInc",
    instagramUrl: "https://www.instagram.com/englertinc",
    linkedinUrl: "https://www.linkedin.com/company/englert",
    twitterUrl: "",
    description: "Englert Inc. is a long-established American manufacturer of metal roofing and gutter systems for residential and commercial applications. The company offers custom-formed seamless gutters, downspouts, and rainwater management products distributed nationwide. Englert focuses on engineering precision, material quality, and long-term performance. With decades of industry experience, the company is recognized for innovation, reliability, and contractor-focused support.",
    services: ["Metal Roofing", "Seamless Gutters", "Rainwater Management", "Commercial Gutters"],
    rating: 4.8
  }
];

export const DataService = {
  // Save State (Async)
  saveState: async (companies: Company[], view: ViewState, selectedId: string | null): Promise<boolean> => {
    // 1. Always save to LocalStorage for backup/offline
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
      localStorage.setItem(VIEW_KEY, view);
      if (selectedId) localStorage.setItem(SELECTED_ID_KEY, selectedId);
      else localStorage.removeItem(SELECTED_ID_KEY);
    } catch (e) {
      console.warn("Local storage limit reached.");
    }

    // 2. Save to Firebase if configured
    if (isFirebaseConfigured && db) {
      try {
        // Save companies to a single document 'directory/main'
        // In a large production app, you would save individual documents, 
        // but for <2000 records, a single JSON doc is faster and cheaper to read.
        await setDoc(doc(db, "directory", "main"), {
          companies: companies,
          lastUpdated: new Date().toISOString()
        });
        console.log("Saved to Firebase successfully");
        return true;
      } catch (e) {
        console.error("Failed to save to Firebase", e);
        return false;
      }
    }
    return true;
  },

  // Load State (Async)
  loadState: async (): Promise<AppState> => {
    let companies: Company[] = [];
    let viewState: ViewState = ViewState.UPLOAD;
    let selectedCompanyId: string | null = null;

    // 1. Try Loading from Firebase First
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "directory", "main");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.companies && Array.isArray(data.companies)) {
             companies = data.companies;
             console.log("Loaded data from Firebase");
          }
        }
      } catch (e) {
        console.error("Failed to load from Firebase, falling back to local", e);
      }
    }

    // 2. If Firebase Empty or Failed, Fallback to LocalStorage
    if (companies.length === 0) {
      try {
        const storedCompanies = localStorage.getItem(STORAGE_KEY);
        if (storedCompanies && JSON.parse(storedCompanies).length > 0) {
          companies = JSON.parse(storedCompanies);
        }
      } catch(e) { console.error("Local load error", e); }
    }

    // 3. If LocalStorage Empty, Use Default
    if (companies.length === 0) {
      companies = DEFAULT_COMPANIES;
    }

    // Load View State (from Local only, UI state shouldn't sync across devices typically)
    const storedView = localStorage.getItem(VIEW_KEY);
    const storedSelectedId = localStorage.getItem(SELECTED_ID_KEY);
    
    if (companies.length > 0) {
      viewState = (storedView as ViewState) || ViewState.DIRECTORY;
    }
    selectedCompanyId = storedSelectedId || null;

    return {
      companies,
      viewState,
      selectedCompanyId
    };
  },

  clearData: async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VIEW_KEY);
    localStorage.removeItem(SELECTED_ID_KEY);
    
    // Clear Firebase too if connected
    if (isFirebaseConfigured && db) {
       try {
         await setDoc(doc(db, "directory", "main"), { companies: [] });
       } catch (e) { console.error(e); }
    }
  },

  getCompanyById: (companies: Company[], id: string): Company | undefined => {
    return companies.find(c => c.id === id);
  }
};
