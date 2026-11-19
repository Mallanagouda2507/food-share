import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { FirebaseSetupModal } from "./components/common/FirebaseSetupModal";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { AddDonationPage } from "./pages/AddDonationPage";
import { DonorDashboard } from "./pages/DonorDashboard";
import { ReceiverDashboard } from "./pages/ReceiverDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CloudArchitecturePage } from "./pages/CloudArchitecturePage";

// Banner for Firebase config status
import { isFirebaseLive } from "./services/firebase";
import { Cloud, ArrowRight, X } from "lucide-react";

export function App() {
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const isConnected = isFirebaseLive();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-slate-800">
          
          {/* Cloud Status Banner if not connected to live Firebase */}
          {!isConnected && !bannerDismissed && (
            <aside aria-label="Cloud Configuration Notice" className="bg-gradient-to-r from-amber-500 via-amber-600 to-accent-600 text-white px-4 py-2.5 text-xs font-semibold shadow-inner">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-100 shrink-0" />
                  <span>
                    <strong>Cloud Computing Project Notice:</strong> Currently running in <strong>Interactive Sandbox Preview Mode</strong>. Connect your Firebase credentials anytime for live cloud sync.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSetupModalOpen(true)}
                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-sm transition-all flex items-center gap-1 text-[11px]"
                  >
                    <span>Cloud Setup</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setBannerDismissed(true)}
                    className="p-1 rounded hover:bg-white/10 text-white/80"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* Navigation Bar */}
          <Navbar onOpenFirebaseSetup={() => setSetupModalOpen(true)} />

          {/* Main Route Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage onOpenFirebaseSetup={() => setSetupModalOpen(true)} />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/login" element={<LoginPage onOpenFirebaseSetup={() => setSetupModalOpen(true)} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cloud-architecture" element={<CloudArchitecturePage />} />

              {/* Protected Routes */}
              <Route
                path="/donate"
                element={
                  <ProtectedRoute allowedRoles={["Donor", "Receiver", "Admin"]}>
                    <AddDonationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Donor", "Admin"]}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receiver/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Receiver", "Admin"]}>
                    <ReceiverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer onOpenFirebaseSetup={() => setSetupModalOpen(true)} />

          {/* Firebase Setup & Architecture Modal */}
          <FirebaseSetupModal
            isOpen={setupModalOpen}
            onClose={() => setSetupModalOpen(false)}
          />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
