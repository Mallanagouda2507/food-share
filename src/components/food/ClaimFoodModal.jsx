import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Loader2
} from "lucide-react";

export const ClaimFoodModal = ({
  donation,
  isOpen,
  onClose,
  onConfirmClaim,
  currentUser,
}) => {
  if (!isOpen || !donation) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receiverPhone, setReceiverPhone] = useState(currentUser?.phone || "");
  const [success, setSuccess] = useState(false);

  const isOwner = donation.donorId === currentUser?.uid;

  const handleClaim = async (e) => {
    e.preventDefault();
    setError(null);

    if (isOwner) {
      setError("Cloud Policy: You cannot claim your own food donation.");
      return;
    }

    if (!receiverPhone || receiverPhone.trim().length < 7) {
      setError("Please provide a valid contact phone number for pickup coordination.");
      return;
    }

    setLoading(true);
    try {
      await onConfirmClaim(donation, {
        ...currentUser,
        phone: receiverPhone,
      });

      setSuccess(true);
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#f97316", "#047857"],
        });
      } catch (err) {
        // ignore confetti errors
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2200);
    } catch (err) {
      setError(err.message || "Failed to submit food claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-primary-200 hover:text-white hover:bg-primary-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Claim Food Donation</h3>
              <p className="text-xs text-primary-100 mt-0.5">Community Redistribution Order</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-800">Claim Confirmed!</h4>
            <p className="text-sm text-slate-600">
              You have claimed <strong>{donation.foodName}</strong>. The donor has been notified, and details are saved to your Receiver Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaim} className="p-6 space-y-4">
            
            {/* Error banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Donation Summary Box */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-800 text-sm">{donation.foodName}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 font-bold text-[10px]">
                  {donation.category}
                </span>
              </div>
              <p className="text-slate-600">
                <strong>Servings:</strong> {donation.servings} people ({donation.quantity})
              </p>
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <span className="truncate">{donation.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <span>Donor Contact: {donation.contact || "Provided after claim"}</span>
              </div>
            </div>

            {/* Receiver Contact Confirmation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Contact Phone Number (Required for Donor Coordination)
              </label>
              <input
                type="tel"
                required
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The donor will use this number if pickup instructions or timings need updating.
              </p>
            </div>

            {/* Policy Check */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Redistribution Terms:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>I commit to picking up the food before the expiry deadline.</li>
                <li>Food will be distributed to individuals, families or shelters in need.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isOwner}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-primary-600/25 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Claim...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Claim Food</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
