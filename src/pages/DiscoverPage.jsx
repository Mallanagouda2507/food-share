import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Utensils,
  Sparkles,
  RefreshCw,
  PlusCircle,
  SlidersHorizontal,
  X
} from "lucide-react";
import { getDonations, claimDonation } from "../services/donationService";
import { FoodCard } from "../components/food/FoodCard";
import { FoodDetailsModal } from "../components/food/FoodDetailsModal";
import { ClaimFoodModal } from "../components/food/ClaimFoodModal";
import { SeedDemoDataBtn } from "../components/food/SeedDemoDataBtn";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All", "Cooked Food", "Fruits", "Vegetables", "Bakery", "Packaged Food"];

export const DiscoverPage = () => {
  const { currentUser, role } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claimingDonation, setClaimingDonation] = useState(null);

  useEffect(() => {
    fetchAvailableDonations();
  }, [selectedCategory]);

  const fetchAvailableDonations = async () => {
    setLoading(true);
    try {
      const data = await getDonations({
        status: "available",
        category: selectedCategory,
        searchQuery,
        location: locationFilter,
      });
      setDonations(data);
    } catch (err) {
      console.error("Error fetching available donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAvailableDonations();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setLocationFilter("");
    setTimeout(() => {
      fetchAvailableDonations();
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Community Food Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Available Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time surplus food listings ready for pickup. Claim meals to redirect them to community members in need.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SeedDemoDataBtn onSeeded={fetchAvailableDonations} />
          <Link
            to={currentUser ? "/donate" : "/login?redirect=/donate"}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs shadow-md shadow-accent-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Food</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-card space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by food name, description, or ingredients..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Location Filter */}
          <div className="relative w-full md:w-64">
            <MapPin className="w-4 h-4 text-accent-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by city / area..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          {(searchQuery || locationFilter || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold flex items-center gap-1"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-primary-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Listings Grid */}
      {loading ? (
        <LoadingSpinner text="Querying available donations from Firestore database..." size="lg" />
      ) : donations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Showing {donations.length} available food donations</span>
            <button
              onClick={fetchAvailableDonations}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh listings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((item) => (
              <FoodCard
                key={item.id || item.donationId}
                donation={item}
                onViewDetails={(d) => setSelectedDonation(d)}
                onClaim={(d) => setClaimingDonation(d)}
                currentUserId={currentUser?.uid}
                userRole={role}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-card max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-primary-600 mx-auto flex items-center justify-center">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Food Donations Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchQuery || locationFilter || selectedCategory !== "All"
              ? "No available food matches your current search criteria. Try resetting filters."
              : "There are currently no active food listings in this database."}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SeedDemoDataBtn onSeeded={fetchAvailableDonations} />
            <Link
              to="/donate"
              className="px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold shadow-md"
            >
              Post a Food Donation
            </Link>
          </div>
        </div>
      )}

      {/* Modals */}
      <FoodDetailsModal
        isOpen={Boolean(selectedDonation)}
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onClaim={(item) => setClaimingDonation(item)}
        currentUserId={currentUser?.uid}
        userRole={role}
      />

      <ClaimFoodModal
        isOpen={Boolean(claimingDonation)}
        donation={claimingDonation}
        onClose={() => setClaimingDonation(null)}
        onConfirmClaim={async (item, receiverInfo) => {
          await claimDonation(item.id || item.donationId, receiverInfo);
          await fetchAvailableDonations();
        }}
        currentUser={currentUser}
      />

    </div>
  );
};
