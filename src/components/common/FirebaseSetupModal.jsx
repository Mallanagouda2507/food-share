import React, { useState } from "react";
import {
  X,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Save,
  Trash2,
  Database,
  Lock,
  HardDrive
} from "lucide-react";
import {
  getActiveFirebaseConfig,
  saveFirebaseConfig,
  clearCustomFirebaseConfig,
  isFirebaseLive
} from "../../services/firebase";

export const FirebaseSetupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const current = getActiveFirebaseConfig();
  const isConnected = isFirebaseLive();

  const [formData, setFormData] = useState({
    apiKey: current.config.apiKey || "",
    authDomain: current.config.authDomain || "",
    projectId: current.config.projectId || "",
    storageBucket: current.config.storageBucket || "",
    messagingSenderId: current.config.messagingSenderId || "",
    appId: current.config.appId || "",
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(isConnected ? "status" : "config");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.apiKey || !formData.projectId) {
      alert("Please provide at least the Firebase API Key and Project ID.");
      return;
    }
    saveFirebaseConfig(formData);
  };

  const handleClear = () => {
    if (window.confirm("Remove saved custom credentials and revert to defaults?")) {
      clearCustomFirebaseConfig();
    }
  };

  const copyEnvSnippet = () => {
    const snippet = `VITE_FIREBASE_API_KEY=${formData.apiKey || "your_api_key"}
VITE_FIREBASE_AUTH_DOMAIN=${formData.authDomain || "your_project.firebaseapp.com"}
VITE_FIREBASE_PROJECT_ID=${formData.projectId || "your_project_id"}
VITE_FIREBASE_STORAGE_BUCKET=${formData.storageBucket || "your_project.appspot.com"}
VITE_FIREBASE_MESSAGING_SENDER_ID=${formData.messagingSenderId || "1234567890"}
VITE_FIREBASE_APP_ID=${formData.appId || "1:1234567890:web:abcdef"}`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Firebase Cloud Setup & Diagnostics</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                FoodShare Cloud Computing Project Configuration
              </p>
            </div>
          </div>

          {/* Status Pill */}
          <div className="mt-4 flex items-center gap-2">
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Cloud Mode Active (Connected to Firestore & Auth)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                Local Sandbox Mode Active (Credentials Needed for Live Cloud)
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5 border-b border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("status")}
              className={`pb-2.5 px-1 border-b-2 transition-colors ${
                activeTab === "status"
                  ? "border-primary-400 text-primary-300"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Cloud Overview & Architecture
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`pb-2.5 px-1 border-b-2 transition-colors ${
                activeTab === "config"
                  ? "border-primary-400 text-primary-300"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Enter Credentials (.env / Live)
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`pb-2.5 px-1 border-b-2 transition-colors ${
                activeTab === "guide"
                  ? "border-primary-400 text-primary-300"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Step-by-Step Setup Guide
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "status" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary-600" />
                  Cloud Database & Backend Services
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  FoodShare integrates Google Cloud Firestore NoSQL, Firebase Authentication for role-based access control, and Firebase Storage for donation images.
                </p>
                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <Lock className="w-4 h-4 text-primary-600 mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-slate-700">Firebase Auth</p>
                    <p className="text-[10px] text-slate-500">Donor / Receiver Roles</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <Database className="w-4 h-4 text-primary-600 mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-slate-700">Cloud Firestore</p>
                    <p className="text-[10px] text-slate-500">users, donations, claims</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <HardDrive className="w-4 h-4 text-primary-600 mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-slate-700">Cloud Storage</p>
                    <p className="text-[10px] text-slate-500">Food item photographs</p>
                  </div>
                </div>
              </div>

              {!isConnected && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    Why are credentials needed?
                  </div>
                  <p>
                    Per college project guidelines, when Firebase credentials are not yet supplied in the `.env` file, FoodShare runs in an interactive <strong>Sandbox Preview Mode</strong>. You can fully test adding donations, claiming meals, and tracking statistics locally.
                  </p>
                  <p>
                    To switch to <strong>Live Cloud Mode</strong>, simply paste your Firebase web app keys in the <em>"Enter Credentials"</em> tab or write them into <code>.env</code>.
                  </p>
                </div>
              )}

              {isConnected && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    Live Cloud Backend Connected
                  </p>
                  <p className="mt-1">
                    Your application is currently communicating directly with your live Google Cloud Firestore project (<code>{current.config.projectId}</code>). All user profiles, donations, and claims will persist in the cloud database.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "config" && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b">
                <span>Configure directly or write to <code>.env</code> file</span>
                <button
                  type="button"
                  onClick={copyEnvSnippet}
                  className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied .env template!" : "Copy .env snippet"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">API Key (apiKey)</label>
                  <input
                    type="text"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project ID (projectId)</label>
                  <input
                    type="text"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    placeholder="foodshare-project-123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Auth Domain (authDomain)</label>
                  <input
                    type="text"
                    name="authDomain"
                    value={formData.authDomain}
                    onChange={handleChange}
                    placeholder="foodshare-project.firebaseapp.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Storage Bucket (storageBucket)</label>
                  <input
                    type="text"
                    name="storageBucket"
                    value={formData.storageBucket}
                    onChange={handleChange}
                    placeholder="foodshare-project.appspot.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Messaging Sender ID</label>
                  <input
                    type="text"
                    name="messagingSenderId"
                    value={formData.messagingSenderId}
                    onChange={handleChange}
                    placeholder="123456789012"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">App ID (appId)</label>
                  <input
                    type="text"
                    name="appId"
                    value={formData.appId}
                    onChange={handleChange}
                    placeholder="1:1234567890:web:abcdef"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t">
                {current.source === "localStorage" ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset Custom Credentials
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-md shadow-primary-600/25 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save & Connect Firebase Live
                </button>
              </div>
            </form>
          )}

          {activeTab === "guide" && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Create a Firebase Project</h4>
                  <p className="mt-0.5">
                    Visit the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-primary-600 underline font-semibold">Firebase Console</a>, sign in with your Google Account, and click <strong>Add project</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Enable Authentication</h4>
                  <p className="mt-0.5">
                    Go to <strong>Build &gt; Authentication</strong> &gt; Get started &gt; Enable <strong>Email/Password</strong> sign-in method.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Create Cloud Firestore Database</h4>
                  <p className="mt-0.5">
                    Navigate to <strong>Build &gt; Firestore Database</strong> &gt; Create Database (Start in test mode or paste our provided <code>firestore.rules</code> file).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Register Web App & Copy Keys</h4>
                  <p className="mt-0.5">
                    Click the Web icon <code>&lt;/&gt;</code> in Project Settings &gt; Register App &gt; Copy <code>firebaseConfig</code> values into this modal or your <code>.env</code> file.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>College Cloud Computing Project MVP</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
