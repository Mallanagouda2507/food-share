import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sparkles
} from "lucide-react";

/**
 * Calculates distance between two coordinates in km/meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
};

export const LocationMap = ({
  latitude,
  longitude,
  address,
  title,
  height = "h-64",
  zoom = 15,
  showDirectionsButton = true,
}) => {
  // Fallback default coordinates if not provided (Bangalore central coordinates)
  const lat = Number(latitude) || 12.9716;
  const lng = Number(longitude) || 77.5946;

  // OpenStreetMap embed URL with bounding box around coordinates
  const delta = 0.008;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Google Maps navigation link
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card flex flex-col">
      {/* Map Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight truncate max-w-xs">
              {title || "Live Pickup Location"}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              GPS: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        {showDirectionsButton && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Maps</span>
          </a>
        )}
      </div>

      {/* Embedded OpenStreetMap View */}
      <div className={`relative w-full ${height} bg-slate-100 overflow-hidden`}>
        <iframe
          title="Live Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={embedUrl}
          className="w-full h-full border-0 filter saturate-105"
        />

        {/* Live Location Marker Overlay Pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-xs">{address || "Real-Time Donor Location"}</span>
        </div>
      </div>

      {/* Map Footer Information */}
      <div className="p-3.5 bg-cream-50 border-t border-cream-200/80 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0" />
          <span className="truncate font-medium">{address}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>OpenStreetMap &bull; High Precision GPS</span>
        </div>
      </div>
    </div>
  );
};
