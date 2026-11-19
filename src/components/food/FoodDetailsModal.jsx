import React from "react";
import {
  X,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Building,
  Navigation
} from "lucide-react";
import { getCategoryBadgeStyle } from "./FoodCard";
import { LocationMap } from "../common/LocationMap";

export const FoodDetailsModal = ({
  donation,
  isOpen,
  onClose,
  onClaim,
  currentUserId,
  userRole,
}) => {
  if (!isOpen || !donation) return null;

  const isOwner = donation.donorId === currentUserId;
  const isAvailable = donation.status === "available";
  const isClaimed = donation.status === "claimed";
  const isCompleted = donation.status === "completed";

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Image Header */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={
              donation.imageUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
            }
            alt={donation.foodName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${getCategoryBadgeStyle(
                donation.category
              )}`}
            >
              {donation.category}
            </span>
            {donation.isDemo && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Demo Seed Data
              </span>
            )}
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              {donation.foodName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-slate-200">
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5 text-accent-400" />
                Serves {donation.servings || 1} people
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-primary-300" />
                Expires: {formatDate(donation.expiryAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Details Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Food Description & Quantity
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {donation.description || "No specific preparation details provided."}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 text-xs font-semibold text-slate-800 border border-cream-200">
              <span>Total Quantity:</span>
              <span className="text-primary-700 font-bold">{donation.quantity}</span>
            </div>
          </div>

          {/* Food Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pickup Location */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-accent-500" />
                <span>Pickup Location</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{donation.location}</p>
              <p className="text-[11px] text-slate-500">Pick up direct from donor facility</p>
            </div>

            {/* Timings */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-primary-600" />
                <span>Preparation & Expiry</span>
              </div>
              <p className="text-xs text-slate-700">
                <span className="font-semibold">Prepared:</span> {formatDate(donation.preparedAt)}
              </p>
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-rose-600">Must pickup by:</span>{" "}
                {formatDate(donation.expiryAt)}
              </p>
            </div>

          </div>

          {/* Real-time Map & Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-500" />
              <span>Real-Time Map & Pickup Directions</span>
            </h4>
            <LocationMap
              latitude={donation.latitude || 12.9716}
              longitude={donation.longitude || 77.5946}
              address={donation.location}
              title={`Pickup: ${donation.foodName}`}
              height="h-52"
            />
          </div>

          {/* Donor Information */}
          <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100 space-y-2">
            <h4 className="text-xs font-bold text-primary-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary-600" />
              Donor Organization & Contact
            </h4>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
              <div>
                <p className="font-bold text-slate-800 text-sm">{donation.donorName || "Community Donor"}</p>
                <p className="text-slate-500">{donation.donorEmail || "Verified Cloud Contributor"}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${donation.contact}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{donation.contact || "Call Donor"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* If Claimed: Show Claimant Details */}
          {donation.claimantInfo && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1 text-xs text-amber-900">
              <p className="font-bold flex items-center gap-1.5 text-amber-800">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                Claimed by Community Receiver
              </p>
              <p>
                <strong>Receiver:</strong> {donation.claimantInfo.name} ({donation.claimantInfo.email})
              </p>
              <p>
                <strong>Phone:</strong> {donation.claimantInfo.phone || "N/A"}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            Close
          </button>

          {isAvailable && (
            <>
              {isOwner ? (
                <span className="text-xs font-semibold text-slate-500 italic">
                  This is your own donation listing.
                </span>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    if (onClaim) onClaim(donation);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-md shadow-primary-600/25 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Proceed to Claim Food</span>
                </button>
              )}
            </>
          )}

          {isClaimed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              <Clock className="w-3.5 h-3.5" />
              Claimed – Pending Pickup
            </span>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed & Handed Over
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
