import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Cloud, ShieldCheck, Heart, Github, ExternalLink } from "lucide-react";

export const Footer = ({ onOpenFirebaseSetup }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">FoodShare</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A cloud-powered platform bridging the gap between food donors and community receivers to eliminate food wastage and nourish people in need.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-950/60 text-primary-400 border border-primary-800/80">
                <Cloud className="w-3.5 h-3.5" />
                Cloud Computing Project MVP
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/discover" className="hover:text-primary-400 transition-colors">
                  Browse Food Available
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-primary-400 transition-colors">
                  Donate Surplus Meals
                </Link>
              </li>
              <li>
                <Link to="/donor/dashboard" className="hover:text-primary-400 transition-colors">
                  Donor Hub
                </Link>
              </li>
              <li>
                <Link to="/receiver/dashboard" className="hover:text-primary-400 transition-colors">
                  Receiver Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Cloud Architecture */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Cloud Stack</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Google Cloud Firestore (NoSQL)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Firebase Authentication</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Firebase Cloud Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Firebase Security Rules</span>
              </li>
              <li className="pt-1">
                <Link to="/cloud-architecture" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-xs font-semibold">
                  View Full Cloud Diagram & Specs &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Configuration & Actions */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Config</h3>
            <p className="text-xs text-slate-400 mb-3">
              Configure or verify your Firebase project credentials or test the end-to-end workflow.
            </p>
            <button
              onClick={onOpenFirebaseSetup}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <Cloud className="w-4 h-4 text-accent-400" />
              Configure Cloud Credentials
            </button>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-500">
              <p>College Cloud Computing Project</p>
              <p className="mt-1">Built with React, Vite, Tailwind CSS & Firebase</p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} FoodShare Platform. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
            <span>for community hunger relief</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
