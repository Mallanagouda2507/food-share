import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Utensils,
  PlusCircle,
  Clock,
  CheckCircle,
  Trash2,
  Edit3,
  User,
  Phone,
  Mail,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  MapPin,
  Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getUserDonations,
  deleteDonation,
  completeDonation
} from "../services/donationService";
import { SeedDemoDataBtn } from "../components/food/SeedDemoDataBtn";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { getCategoryBadgeStyle } from "../components/food/FoodCard";

export const DonorDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'available', 'claimed', 'completed'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      loadDonations();
    }
  }, [currentUser]);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await getUserDonations(currentUser?.uid);
      setDonations(data);
    } catch (err) {
      console.error("Error loading donor donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food donation?")) {
      try {
        setActionLoading(true);
        await deleteDonation(id, currentUser.uid);
        await loadDonations();
      } catch (err) {
        alert(err.message || "Failed to delete donation.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleMarkCompleted = async (donation) => {
    if (window.confirm(`Confirm handover of "${donation.foodName}" to the receiver?`)) {
      try {
        setActionLoading(true);
        await completeDonation(
          donation.id || donation.donationId,
          donation.claimId,
          currentUser.uid
        );
        await loadDonations();
      } catch (err) {
        alert(err.message || "Failed to update donation status.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Compute stat metrics
  const totalDonations = donations.length;
  const availableCount = donations.filter((d) => d.status === "available").length;
  const claimedCount = donations.filter((d) => d.status === "claimed").length;
  const completedCount = donations.filter((d) => d.status === "completed").length;
  const totalServingsGiven = donations.reduce((sum, d) => sum + (Number(d.servings) || 0), 0);

  // Filtered view
  const displayedDonations = donations.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            <span>Donor Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {userProfile?.name || currentUser?.displayName || "Community Donor"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track your surplus food contributions, manage active listings, and coordinate handovers with community receivers in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SeedDemoDataBtn onSeeded={loadDonations} />
          <Link
            to="/donate"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Food Donation</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Donations */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Donations</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalDonations}</p>
          <p className="text-[11px] text-slate-500 font-medium">Lifetime contributions</p>
        </div>

        {/* Available */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Available Now</p>
          <p className="text-3xl font-extrabold text-emerald-600">{availableCount}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Ready for pickup</p>
        </div>

        {/* Claimed */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Claimed / Pending</p>
          <p className="text-3xl font-extrabold text-amber-600">{claimedCount}</p>
          <p className="text-[11px] text-amber-700 font-medium">Awaiting receiver arrival</p>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-card space-y-1">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Completed Pickups</p>
          <p className="text-3xl font-extrabold text-slate-700">{completedCount}</p>
          <p className="text-[11px] text-slate-500 font-medium">{totalServingsGiven} servings delivered</p>
        </div>

      </div>

      {/* Filter Tabs & Donation Management */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        
        {/* Table / List Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">My Food Donations</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {displayedDonations.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({totalDonations})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "available"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter("claimed")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "claimed" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Claimed ({claimedCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === "completed" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <LoadingSpinner text="Retrieving donor records from Firestore..." />
        ) : displayedDonations.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {displayedDonations.map((item) => {
              const isAvailable = item.status === "available";
              const isClaimed = item.status === "claimed";
              const isCompleted = item.status === "completed";

              return (
                <div
                  key={item.id || item.donationId}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={item.foodName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeStyle(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>

                        {/* Status tag */}
                        {isAvailable && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Available
                          </span>
                        )}
                        {isClaimed && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Claimed
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-slate-600" />
                            Completed
                          </span>
                        )}

                        {item.isDemo && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Demo Seed
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {item.foodName}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-accent-500" />
                          <strong>Serves {item.servings}</strong> ({item.quantity})
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      </div>

                      {/* Claimant Information Box if Claimed */}
                      {isClaimed && item.claimantInfo && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <p className="font-bold flex items-center gap-1.5 text-amber-800">
                            <User className="w-3.5 h-3.5" />
                            <span>Claimant Details:</span>
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="font-semibold">Name:</span> {item.claimantInfo.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-700" />
                              <a href={`tel:${item.claimantInfo.phone}`} className="underline font-semibold">
                                {item.claimantInfo.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap md:flex-col items-end justify-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    
                    {/* Mark as Handed Over CTA */}
                    {isClaimed && (
                      <button
                        onClick={() => handleMarkCompleted(item)}
                        disabled={actionLoading}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Handover</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      {isAvailable && (
                        <button
                          onClick={() => navigate(`/donate?edit=${item.id || item.donationId}`)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit</span>
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => handleDelete(item.id || item.donationId)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Donations in this View</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not posted any food donations matching this status filter yet.
            </p>
            <div className="pt-2">
              <Link
                to="/donate"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Food Donation</span>
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
