import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Utensils,
  PlusCircle,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createDonation, updateDonation, getDonationById } from "../services/donationService";
import { FOOD_PRESETS } from "../services/seedData";

const CATEGORIES = ["Cooked Food", "Fruits", "Vegetables", "Bakery", "Packaged Food"];

export const AddDonationPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    category: "Cooked Food",
    quantity: "",
    servings: 10,
    imageUrl: FOOD_PRESETS[0].imageUrl,
    location: "",
    contact: currentUser?.phone || "",
    preparedAt: new Date().toISOString().slice(0, 16),
    expiryAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const [customImageMode, setCustomImageMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(Boolean(editId));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load existing donation if in edit mode
  useEffect(() => {
    if (editId) {
      loadExisting(editId);
    }
  }, [editId]);

  const loadExisting = async (id) => {
    try {
      const data = await getDonationById(id);
      if (data) {
        if (data.donorId !== currentUser?.uid && currentUser?.role !== "Admin") {
          setError("You do not have permission to edit this donation.");
          return;
        }
        setFormData({
          foodName: data.foodName || "",
          description: data.description || "",
          category: data.category || "Cooked Food",
          quantity: data.quantity || "",
          servings: data.servings || 10,
          imageUrl: data.imageUrl || FOOD_PRESETS[0].imageUrl,
          location: data.location || "",
          contact: data.contact || "",
          preparedAt: data.preparedAt ? new Date(data.preparedAt).toISOString().slice(0, 16) : "",
          expiryAt: data.expiryAt ? new Date(data.expiryAt).toISOString().slice(0, 16) : "",
        });
      }
    } catch (err) {
      setError("Failed to load donation details for editing.");
    } finally {
      setFetchingEdit(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Preset image selection
  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: preset.imageUrl,
      category: preset.category,
    }));
  };

  // Image file upload handler (simulates Cloud Storage or handles data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!formData.foodName.trim()) {
      setError("Please specify the food name.");
      return;
    }
    if (!formData.quantity.trim()) {
      setError("Please specify the quantity (e.g. 15 meal boxes, 2 large trays).");
      return;
    }
    if (Number(formData.servings) <= 0) {
      setError("Number of servings must be at least 1 person.");
      return;
    }
    if (!formData.location.trim()) {
      setError("Please provide a pickup location address.");
      return;
    }
    if (!formData.contact.trim()) {
      setError("Please provide a contact phone number.");
      return;
    }
    if (!formData.expiryAt) {
      setError("Please specify a pickup deadline / best-before time.");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await updateDonation(editId, formData, currentUser?.uid);
        setSuccess(true);
        setTimeout(() => navigate("/donor/dashboard"), 1500);
      } else {
        await createDonation(formData, currentUser);
        setSuccess(true);
        setTimeout(() => navigate("/donor/dashboard"), 1500);
      }
    } catch (err) {
      console.error("Donation submission error:", err);
      setError(err.message || "Failed to save donation to Firestore. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEdit) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to previous page</span>
      </button>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 text-white p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {editId ? "Update Food Donation" : "List New Food Donation"}
              </h1>
              <p className="text-xs sm:text-sm text-primary-100 mt-1">
                Save to Cloud Firestore database for immediate community redistribution
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="m-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">
                {editId ? "Donation successfully updated!" : "Food donation submitted to the cloud!"}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Redirecting to your Donor Dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Section: Basic Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              1. Food Item Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Name / Dish Title *
                </label>
                <input
                  type="text"
                  required
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Vegetable Meals, Steamed Rice & Lentils, Artisan Breads"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of People It Can Serve *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="1"
                    required
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity Description *
                </label>
                <input
                  type="text"
                  required
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 20 sealed meal containers, 4 crates, 15 loaves"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Description & Ingredients
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Include details on packaging, dietary information (vegetarian, vegan, contains nuts), temperature conditions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

            </div>
          </div>

          {/* Section: Food Image Selection & Cloud Storage Upload */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <span className="w-2 h-2 rounded-full bg-accent-500" />
              2. Food Photograph & Visuals
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select from Curated Food Presets or Upload Custom Photo:
              </label>

              {/* Preset Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {FOOD_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative h-24 rounded-2xl overflow-hidden border-2 text-left transition-all group ${
                      formData.imageUrl === preset.imageUrl
                        ? "border-primary-500 ring-2 ring-primary-500/20 shadow-md"
                        : "border-slate-200 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Image URL or File Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Custom Image Options (Cloud Storage):</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs font-semibold">
                    <Upload className="w-3.5 h-3.5 text-primary-600" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Or enter direct image URL (e.g. Unsplash / Firebase Storage URL)"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Logistics, Timings & Contact */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              3. Pickup Location & Deadlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pickup Location Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-accent-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Community Kitchen, 42 Market Street, Entrance B"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preparation Date & Time *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="datetime-local"
                    required
                    name="preparedAt"
                    value={formData.preparedAt}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Best-Before / Pickup Deadline *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-rose-500 absolute left-3.5 top-3" />
                  <input
                    type="datetime-local"
                    required
                    name="expiryAt"
                    value={formData.expiryAt}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="+1 (555) 234-5678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  This contact number will be provided to verified receivers upon claiming this donation.
                </p>
              </div>

            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary-600/25 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Cloud Database...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>{editId ? "Update Donation" : "Submit Food Donation"}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
