import React, { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { seedDemoDonations } from "../../services/donationService";
import { useAuth } from "../../context/AuthContext";

export const SeedDemoDataBtn = ({ onSeeded, className = "" }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedDemoDonations(currentUser);
      setSuccess(true);
      if (onSeeded) onSeeded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Seeding error:", err);
      alert("Failed to seed demo data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      title="Populate the 4 official demo food donations into Cloud Firestore"
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
        success
          ? "bg-emerald-600 text-white"
          : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
      } ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Seeding Demo Records...</span>
        </>
      ) : success ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Demo Data Loaded!</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Seed 4 Demo Donations</span>
        </>
      )}
    </button>
  );
};
