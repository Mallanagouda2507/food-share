import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Search,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Calendar
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserClaims, cancelClaim } from "../services/donationService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { getCategoryBadgeStyle } from "../components/food/FoodCard";

export const ReceiverDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      loadClaims();
    }
  }, [currentUser]);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await getUserClaims(currentUser?.uid);
      setClaims(data);
    } catch (err) {
      console.error("Error loading receiver claims:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClaim = async (claim) => {
    if (window.confirm(`Cancel your claim for "${claim.foodName}"? This will make the food available for others to claim.`)) {
      try {
        setActionLoading(true);
        await cancelClaim(
          claim.donationId,
          claim.claimId || claim.id,
          currentUser.uid
        );
        await loadClaims();
      } catch (err) {
        alert(err.message || "Failed to cancel claim.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Metrics
  const totalClaims = claims.length;
  const activeClaims = claims.filter((c) => c.status === "active").length;
  const completedClaims = claims.filter((c) => c.status === "completed").length;
  const totalServingsReceived = claims
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + (Number(c.servings) || 0), 0);

  const displayedClaims = claims.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-accent-600 animate-pulse" />
            <span>Community Receiver Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {userProfile?.name || currentUser?.displayName || "Community Partner"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Manage your claimed food donations, coordinate pickup times, and view contact details for participating food donors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/discover"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/25 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Browse More Food</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Claims</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalClaims}</p>
          <p className="text-[11px] text-slate-500 font-medium">Orders placed</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Active Pickups</p>
          <p className="text-3xl font-extrabold text-amber-600">{activeClaims}</p>
          <p className="text-[11px] text-amber-700 font-medium">Pending collection</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed Pickups</p>
          <p className="text-3xl font-extrabold text-emerald-600">{completedClaims}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Successfully collected</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Community Servings</p>
          <p className="text-3xl font-extrabold text-slate-800">{totalServingsReceived}</p>
          <p className="text-[11px] text-slate-500 font-medium">Meals redistributed</p>
        </div>

      </div>

      {/* Claims List */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Claimed Food Items</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {displayedClaims.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({totalClaims})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "active" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Active ({activeClaims})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "completed" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Completed ({completedClaims})
            </button>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <LoadingSpinner text="Retrieving claimed donations from Firestore..." />
        ) : displayedClaims.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {displayedClaims.map((claim) => {
              const isActive = claim.status === "active";
              const isCompleted = claim.status === "completed";
              const isCancelled = claim.status === "cancelled";

              return (
                <div
                  key={claim.id || claim.claimId}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        claim.imageUrl ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={claim.foodName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {claim.category && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeStyle(
                              claim.category
                            )}`}
                          >
                            {claim.category}
                          </span>
                        )}

                        {/* Status badge */}
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Ready for Pickup
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Completed Pickup
                          </span>
                        )}
                        {isCancelled && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            Cancelled
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {claim.foodName}
                      </h3>

                      <p className="text-xs text-slate-600">
                        Servings: <strong>{claim.servings} people</strong> ({claim.quantity})
                      </p>

                      {/* Pickup location and contact information */}
                      <div className="p-3 rounded-2xl bg-cream-100 border border-cream-200 text-xs text-slate-700 space-y-1.5 mt-2">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>Pickup Location:</strong> {claim.pickupLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] pt-1 border-t border-cream-200/60">
                          <span>
                            <strong>Donor:</strong> {claim.donorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-primary-600" />
                            <a href={`tel:${claim.donorContact}`} className="font-bold underline text-primary-700">
                              {claim.donorContact}
                            </a>
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 pt-1">
                        Claimed on: {formatDate(claim.claimedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {isActive && (
                      <button
                        onClick={() => handleCancelClaim(claim)}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Cancel Claim</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Food Claims Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't claimed any surplus meals yet. Discover available food in your community.
            </p>
            <div className="pt-2">
              <Link
                to="/discover"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Browse Available Food</span>
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
