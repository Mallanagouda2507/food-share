import React, { useState } from "react";
import {
  Cloud,
  Database,
  Lock,
  HardDrive,
  Globe,
  ShieldCheck,
  Server,
  Layers,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";

export const CloudArchitecturePage = () => {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    // Users collection: only owner can edit profile
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
    }

    // Donations: public read; donors manage their items; receivers claim
    match /donations/{donationId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.donorId == request.auth.uid;
      allow update: if isAuthenticated() && (
        resource.data.donorId == request.auth.uid ||
        (resource.data.status == 'available' && request.resource.data.status == 'claimed' && resource.data.donorId != request.auth.uid) ||
        (resource.data.status == 'claimed')
      );
      allow delete: if isAuthenticated() && resource.data.donorId == request.auth.uid;
    }

    // Claims: participant access only
    match /claims/{claimId} {
      allow read: if isAuthenticated() && (resource.data.receiverId == request.auth.uid || resource.data.donorId == request.auth.uid);
      allow create: if isAuthenticated() && request.resource.data.receiverId == request.auth.uid && request.resource.data.donorId != request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.receiverId == request.auth.uid || resource.data.donorId == request.auth.uid);
    }
  }
}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold">
          <Cloud className="w-4 h-4 text-primary-600" />
          <span>College Cloud Computing Project Specification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cloud Architecture & System Design
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Comprehensive technical documentation detailing the multi-tier serverless cloud architecture, NoSQL Firestore collections, and security constraints of <strong>FoodShare</strong>.
        </p>
      </div>

      {/* Cloud Architecture Diagram Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Client Tier */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">1. Client / Frontend Tier</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built with <strong>React + Vite</strong> and styled using <strong>Tailwind CSS</strong>. Hosted on <strong>Firebase Hosting</strong> with global CDN edge caching, SSL termination, and sub-second asset delivery.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-slate-500 space-y-1">
            <p>&bull; SPA Client-side routing</p>
            <p>&bull; Responsive mobile/desktop UI</p>
            <p>&bull; Real-time optimistic state updates</p>
          </div>
        </div>

        {/* Identity & Security */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">2. Cloud Identity & RBAC</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Managed via <strong>Firebase Authentication</strong>. Employs JSON Web Tokens (JWT) for secure session management and role-based access control (Donor, Receiver, Admin).
          </p>
          <div className="pt-2 text-[11px] font-semibold text-slate-500 space-y-1">
            <p>&bull; Secure email & password auth</p>
            <p>&bull; Granular Firestore Security Rules</p>
            <p>&bull; Protected route interceptors</p>
          </div>
        </div>

        {/* Cloud Database Tier */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">3. Serverless Cloud NoSQL</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Google Cloud Firestore</strong> provides an elastic, high-concurrency document database with ACID transactions for race-condition-free meal claims.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-slate-500 space-y-1">
            <p>&bull; Multi-region replication</p>
            <p>&bull; Indexed queries & compound filters</p>
            <p>&bull; Atomic claim transactions</p>
          </div>
        </div>

      </div>

      {/* Database Schema Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" />
            <span>Cloud Firestore Collections & Document Models</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Normalized relational mapping within a NoSQL document database structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Users Schema */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-primary-700 text-sm">users/{'{uid}'}</h4>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono">
{`{
  uid: string,
  name: string,
  email: string,
  phone: string,
  role: "Donor" | "Receiver" | "Admin",
  createdAt: timestamp
}`}
            </pre>
            <p className="text-slate-500 text-[11px]">User profile and role credentials.</p>
          </div>

          {/* Donations Schema */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-accent-700 text-sm">donations/{'{donationId}'}</h4>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono">
{`{
  donationId: string,
  donorId: string,
  donorName: string,
  foodName: string,
  description: string,
  category: string,
  quantity: string,
  servings: number,
  imageUrl: string,
  location: string,
  contact: string,
  preparedAt: timestamp,
  expiryAt: timestamp,
  status: "available" | "claimed" | "completed",
  claimedBy?: string,
  claimId?: string,
  createdAt: timestamp
}`}
            </pre>
            <p className="text-slate-500 text-[11px]">Primary inventory of surplus food.</p>
          </div>

          {/* Claims Schema */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-emerald-700 text-sm">claims/{'{claimId}'}</h4>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono">
{`{
  claimId: string,
  donationId: string,
  donorId: string,
  donorName: string,
  donorContact: string,
  receiverId: string,
  receiverName: string,
  receiverPhone: string,
  pickupLocation: string,
  status: "active" | "completed" | "cancelled",
  claimedAt: timestamp,
  completedAt?: timestamp
}`}
            </pre>
            <p className="text-slate-500 text-[11px]">Redistribution claim audit trail.</p>
          </div>

        </div>
      </div>

      {/* Cloud Security Rules Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Cloud Security & Permission Rules</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enforced at the cloud engine layer to prevent unauthorized data access or race conditions.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(firestoreRulesText, "rules")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
          >
            {copiedSection === "rules" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "rules" ? "Copied!" : "Copy Rules"}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-emerald-300 rounded-2xl overflow-x-auto text-xs leading-relaxed font-mono">
          {firestoreRulesText}
        </pre>
      </div>

      {/* Deployment Instructions */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Server className="w-5 h-5 text-primary-400" />
          <span>Firebase Hosting Deployment Instructions</span>
        </h2>
        <p className="text-xs text-slate-300">
          To deploy this project to live Google Cloud Firebase Hosting:
        </p>

        <div className="p-4 bg-slate-950 rounded-2xl font-mono text-xs text-primary-300 space-y-2">
          <p># 1. Install Firebase CLI globally</p>
          <p className="text-white">npm install -g firebase-tools</p>
          <p># 2. Login to your Google account</p>
          <p className="text-white">firebase login</p>
          <p># 3. Build optimized production bundle</p>
          <p className="text-white">npm run build</p>
          <p># 4. Deploy hosting, rules and cloud configuration</p>
          <p className="text-white">firebase deploy</p>
        </div>
      </div>

    </div>
  );
};
