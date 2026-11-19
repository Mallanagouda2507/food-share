import React from "react";
import {
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Phone,
  Tag
} from "lucide-react";

export const getCategoryBadgeStyle = (category) => {
  switch (category) {
    case "Cooked Food":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Fruits":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Vegetables":
      return "bg-green-100 text-green-800 border-green-200";
    case "Bakery":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Packaged Food":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export const FoodCard = ({
  donation,
  onViewDetails,
  onClaim,
  onEdit,
  onDelete,
  onComplete,
  currentUserId,
  userRole,
}) => {
  const isOwner = donation.donorId === currentUserId;
  const isAvailable = donation.status === "available";
  const isClaimed = donation.status === "claimed";
  const isCompleted = donation.status === "completed";

  // Format expiry deadline
  const formatDeadline = (isoString) => {
    if (!isoString) return "Pickup ASAP";
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = date - now;
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      if (diffHours < 0) return "Expired";
      if (diffHours === 0) return "Expires in <1 hour";
      if (diffHours < 24) return `Expires in ${diffHours} hr${diffHours > 1 ? "s" : ""}`;
      const diffDays = Math.round(diffHours / 24);
      return `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } catch {
      return "Pickup ASAP";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col group">
      
      {/* Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={
            donation.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
          }
          alt={donation.foodName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${getCategoryBadgeStyle(
              donation.category
            )}`}
          >
            {donation.category}
          </span>

          {donation.isDemo && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Demo Data
            </span>
          )}
        </div>

        {/* Bottom Image Overlay: Servings & Status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-accent-400" />
            <span>Serves {donation.servings || 1} people</span>
          </span>

          {/* Status Badge */}
          {isAvailable && (
            <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Available
            </span>
          )}
          {isClaimed && (
            <span className="bg-amber-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Claimed
            </span>
          )}
          {isCompleted && (
            <span className="bg-slate-700/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold text-white flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Handed Over
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-primary-700 transition-colors line-clamp-1">
              {donation.foodName}
            </h3>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {donation.description || "Fresh surplus food ready for immediate community redistribution."}
          </p>

          {/* Quantity & Location Meta */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-cream-200/60 pt-3">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700">Qty:</span>
              <span className="truncate">{donation.quantity}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0" />
              <span className="truncate" title={donation.location}>
                {donation.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary-600 shrink-0" />
              <span className="font-semibold text-slate-700">Deadline:</span>
              <span className="text-primary-700 font-medium">{formatDeadline(donation.expiryAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-cream-200/80 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(donation)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* If receiver and available -> Claim Button */}
          {isAvailable && !isOwner && onClaim && (
            <button
              onClick={() => onClaim(donation)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-md shadow-primary-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <span>Claim Food</span>
            </button>
          )}

          {/* If owner and available -> Edit / Delete */}
          {isOwner && isAvailable && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(donation)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium"
                  title="Edit Donation"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(donation.id || donation.donationId)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium"
                  title="Delete Donation"
                >
                  Delete
                </button>
              )}
            </div>
          )}

          {/* If owner and claimed -> Mark as Handed Over */}
          {isOwner && isClaimed && onComplete && (
            <button
              onClick={() => onComplete(donation)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-md shadow-accent-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Handed Over</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
