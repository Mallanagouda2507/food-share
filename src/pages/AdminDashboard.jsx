import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Utensils,
  CheckCircle,
  Clock,
  Sparkles,
  Trash2,
  RefreshCw,
  Search,
  Database,
  ExternalLink,
  Tag
} from "lucide-react";
import { getDonations, getCloudStats, deleteDonation } from "../services/donationService";
import { SeedDemoDataBtn } from "../components/food/SeedDemoDataBtn";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { getCategoryBadgeStyle } from "../components/food/FoodCard";
import { useAuth } from "../context/AuthContext";

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    available: 0,
    claimed: 0,
    completed: 0,
    totalServings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allDonations, cloudStats] = await Promise.all([
        getDonations({ status: "all" }),
        getCloudStats(),
      ]);
      setDonations(allDonations);
      setStats(cloudStats);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm("Admin Action: Delete this donation record from the database?")) {
      try {
        await deleteDonation(id, currentUser?.uid);
        await loadData();
      } catch (err) {
        alert("Failed to delete record: " + err.message);
      }
    }
  };

  const filtered = donations.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.foodName?.toLowerCase().includes(q) ||
      d.donorName?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Cloud Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin & Cloud Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Monitor real-time Firestore activity, track redistributed food metrics, and manage system database records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeedDemoDataBtn onSeeded={loadData} />
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Cloud Sync</span>
          </button>
        </div>
      </div>

      {/* Cloud Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</p>
          <p className="text-[10px] text-slate-500">Donors & Receivers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Total Donations</span>
            <Utensils className="w-4 h-4 text-primary-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalDonations}</p>
          <p className="text-[10px] text-slate-500">{stats.totalServings} Servings total</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Available Food</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{stats.available}</p>
          <p className="text-[10px] text-emerald-700">Open listings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600">
            <span>Claimed</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{stats.claimed}</p>
          <p className="text-[10px] text-amber-700">Pending pickup</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Completed</span>
            <CheckCircle className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{stats.completed}</p>
          <p className="text-[10px] text-slate-500">Successfully delivered</p>
        </div>

      </div>

      {/* Database Records Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">All Database Donations</h2>

          {/* Search filter */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food, donor, location..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving all collections..." />
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Servings / Qty</th>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id || item.donationId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.foodName}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeStyle(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {item.servings} people ({item.quantity})
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.donorName || "Community Member"}</p>
                      <p className="text-[10px] text-slate-400">{item.contact}</p>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === "available" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Available
                        </span>
                      )}
                      {item.status === "claimed" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Claimed ({item.claimantInfo?.name || "Receiver"})
                        </span>
                      )}
                      {item.status === "completed" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteDonation(item.id || item.donationId)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Delete from database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No records matched your search query.
          </div>
        )}
      </div>

    </div>
  );
};
