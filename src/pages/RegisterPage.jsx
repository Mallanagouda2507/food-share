import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartHandshake,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UtensilsCrossed,
  Heart,
  Loader2
} from "lucide-react";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("Donor"); // 'Donor' or 'Receiver'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        phone,
        password,
        role,
      });

      // Redirect to appropriate dashboard
      if (role === "Donor") {
        navigate("/donor/dashboard");
      } else {
        navigate("/receiver/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      let msg = "Failed to register. Please check your information.";
      if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        msg = "The password is too weak. Please use at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-card">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md shadow-primary-500/25">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
              FoodShare
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="text-xs text-slate-500">
            Join our cloud-powered network to eliminate food waste and support families
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Choose Your Primary Role</label>
          <div className="grid grid-cols-2 gap-4">
            
            <button
              type="button"
              onClick={() => setRole("Donor")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "Donor"
                  ? "bg-primary-50 border-primary-500 ring-2 ring-primary-500/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${role === "Donor" ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                {role === "Donor" && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
              </div>
              <h4 className="font-bold text-sm text-slate-900">Food Donor</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Restaurants, caterers, bakeries & individuals with surplus meals to give.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("Receiver")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "Receiver"
                  ? "bg-accent-50 border-accent-500 ring-2 ring-accent-500/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${role === "Receiver" ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Heart className="w-5 h-5" />
                </div>
                {role === "Receiver" && <CheckCircle2 className="w-5 h-5 text-accent-600" />}
              </div>
              <h4 className="font-bold text-sm text-slate-900">Food Receiver</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Shelters, NGOs, food pantries & individuals seeking food assistance.
              </p>
            </button>

          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name / Organization
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Green Community Kitchen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@kitchen.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary-600/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Cloud Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration ({role})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};
