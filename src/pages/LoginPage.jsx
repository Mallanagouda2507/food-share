import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartHandshake,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Loader2,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export const LoginPage = ({ onOpenFirebaseSetup }) => {
  const { login, loginAsDemo, isFirebaseLive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      // Navigate to destination or role-appropriate dashboard
      if (redirectPath) {
        navigate(redirectPath);
      } else if (user.role === "Donor") {
        navigate("/donor/dashboard");
      } else if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/receiver/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      let msg = "Invalid email or password. Please verify credentials.";
      if (err.code === "auth/user-not-found") msg = "No user found with this email.";
      if (err.code === "auth/wrong-password") msg = "Incorrect password.";
      if (err.code === "auth/invalid-credential") msg = "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role) => {
    const account = loginAsDemo(role);
    if (redirectPath) {
      navigate(redirectPath);
    } else if (role === "Donor") {
      navigate("/donor/dashboard");
    } else if (role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/receiver/dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-card">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md shadow-primary-500/25">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
              FoodShare
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Sign in to manage food donations and community claims
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span className="flex items-center gap-1 text-primary-700">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Demo Evaluator Logins:
            </span>
            <span className="text-[10px] text-slate-400 font-normal">1-Click Auth</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("Donor")}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-primary-50 border border-primary-200 text-primary-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs text-center"
            >
              Demo Donor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("Receiver")}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-accent-50 border border-accent-200 text-accent-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs text-center"
            >
              Demo Receiver
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("Admin")}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary-600/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to FoodShare</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
            Register as Donor or Receiver
          </Link>
        </div>

      </div>
    </div>
  );
};
