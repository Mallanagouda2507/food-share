import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Storage key for user-configured Firebase credentials via the in-app setup modal
const LOCAL_FIREBASE_CONFIG_KEY = "foodshare_firebase_config";

// Read from environment variables or localStorage
export const getActiveFirebaseConfig = () => {
  const localSaved = localStorage.getItem(LOCAL_FIREBASE_CONFIG_KEY);
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed.apiKey && !parsed.apiKey.includes("your_api_key")) {
        return { config: parsed, source: "localStorage" };
      }
    } catch (e) {
      console.warn("Invalid saved firebase config:", e);
    }
  }

  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const isConfigured = Boolean(
    envConfig.apiKey &&
    !envConfig.apiKey.includes("your_api_key") &&
    envConfig.projectId &&
    !envConfig.projectId.includes("your_project_id")
  );

  return { config: envConfig, source: "env", isConfigured };
};

const active = getActiveFirebaseConfig();
let app = null;
let auth = null;
let db = null;
let storage = null;
let isConfigured = false;

if (active.isConfigured || (active.config.apiKey && !active.config.apiKey.includes("your_api_key"))) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(active.config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isConfigured = true;
    console.log("✅ Firebase initialized successfully with cloud configuration.");
  } catch (err) {
    console.error("❌ Firebase initialization error:", err);
    isConfigured = false;
  }
} else {
  console.info("ℹ️ Firebase credentials not detected. FoodShare will offer cloud setup and sandbox preview mode.");
}

export const isFirebaseLive = () => isConfigured;

export const saveFirebaseConfig = (newConfig) => {
  localStorage.setItem(LOCAL_FIREBASE_CONFIG_KEY, JSON.stringify(newConfig));
  window.location.reload();
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem(LOCAL_FIREBASE_CONFIG_KEY);
  window.location.reload();
};

export { app, auth, db, storage };
