import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HeartHandshake,
  PlusCircle,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X,
  Cloud,
  ChevronDown,
  Layers,
  Sparkles
} from "lucide-react";

export const Navbar = ({ onOpenFirebaseSetup }) => {
  const { currentUser, userProfile, role, isDonor, isReceiver, isAdmin, logout, isFirebaseLive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform duration-200">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 bg-clip-text text-transparent">
                  FoodShare
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 border border-primary-200">
                  Cloud
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Share More • Waste Less</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/discover"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive("/discover")
                  ? "bg-primary-50 text-primary-700 font-bold"
                  : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
              }`}
            >
              Browse Food
            </Link>

            {currentUser && isDonor && (
              <Link
                to="/donor/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/donor/dashboard")
                    ? "bg-primary-50 text-primary-700 font-bold"
                    : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
                }`}
              >
                Donor Dashboard
              </Link>
            )}

            {currentUser && isReceiver && (
              <Link
                to="/receiver/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/receiver/dashboard")
                    ? "bg-primary-50 text-primary-700 font-bold"
                    : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
                }`}
              >
                Receiver Dashboard
              </Link>
            )}

            {currentUser && isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/admin")
                    ? "bg-purple-50 text-purple-700 font-bold"
                    : "text-slate-600 hover:text-purple-600 hover:bg-slate-50"
                }`}
              >
                Admin Panel
              </Link>
            )}

            <Link
              to="/cloud-architecture"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive("/cloud-architecture")
                  ? "bg-amber-50 text-accent-700 font-bold"
                  : "text-slate-600 hover:text-accent-600 hover:bg-slate-50"
              }`}
            >
              <Cloud className="w-4 h-4 text-accent-500" />
              Cloud Architecture
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Cloud Status Indicator / Button */}
            <button
              onClick={onOpenFirebaseSetup}
              title="Click to view or edit Firebase Cloud Configuration"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isFirebaseLive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isFirebaseLive ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span>{isFirebaseLive ? "Firebase Connected" : "Cloud Setup (Ready)"}</span>
            </button>

            {/* Donate Food CTA Button */}
            <Link
              to={currentUser ? "/donate" : "/login?redirect=/donate"}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold text-sm shadow-md shadow-accent-500/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Food</span>
            </Link>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-xs">
                    {(userProfile?.name || currentUser.displayName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold leading-tight text-slate-800">
                      {userProfile?.name || currentUser.displayName || "User"}
                    </p>
                    <p className="text-[10px] text-primary-600 font-semibold">{role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onClick={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {userProfile?.name || currentUser.displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-primary-100 text-primary-700">
                        Role: {role}
                      </span>
                    </div>

                    <Link
                      to={isDonor ? "/donor/dashboard" : "/receiver/dashboard"}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={onOpenFirebaseSetup}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Cloud className="w-4 h-4 text-accent-500" />
                      Firebase Cloud Config
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 transition-all"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenFirebaseSetup}
              className={`p-1.5 rounded-lg border ${
                isFirebaseLive ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-800 bg-amber-50 border-amber-200"
              }`}
            >
              <Cloud className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700"
          >
            Browse Food
          </Link>
          <Link
            to="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-accent-600 hover:bg-accent-50"
          >
            Donate Food
          </Link>
          <Link
            to="/cloud-architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-primary-50"
          >
            Cloud Architecture
          </Link>
          {currentUser ? (
            <>
              <Link
                to={isDonor ? "/donor/dashboard" : "/receiver/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-primary-700 bg-primary-50"
              >
                My Dashboard ({role})
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-purple-700 bg-purple-50"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-primary-600 text-white font-semibold"
              >
                Join Us
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
