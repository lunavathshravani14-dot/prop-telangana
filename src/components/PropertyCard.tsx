'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Scale,
  Phone,
  MessageCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface PropertyCardProps {
  property: any;
  onEnquire?: (property: any) => void;
  onCompareToggle?: (propertyId: string) => void;
  isCompared?: boolean;
}

export default function PropertyCard({
  property,
  onEnquire,
  onCompareToggle,
  isCompared = false,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const coverImage =
    property.images?.find((img: any) => img.isCover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFavorite(data.data.isFavorite);
      } else if (res.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(property.id);
    } else {
      // LocalStorage toggle
      const existing = JSON.parse(localStorage.getItem('compare_props') || '[]');
      let updated;
      if (existing.includes(property.id)) {
        updated = existing.filter((id: string) => id !== property.id);
      } else {
        if (existing.length >= 4) {
          alert('You can compare a maximum of 4 properties at a time.');
          return;
        }
        updated = [...existing, property.id];
      }
      localStorage.setItem('compare_props', JSON.stringify(updated));
      window.dispatchEvent(new Event('compare_updated'));
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello PropTelangana! I am interested in "${property.title}" (${property.propertyId}) priced at ${property.priceDisplay || '₹ ' + property.price}. Please share brochure and site visit details.`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link href={`/properties/${property.slug}`}>
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {property.featured && (
            <span className="bg-amber-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
              Featured
            </span>
          )}
          <span className="bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
            {property.propertyType}
          </span>
          <span className="bg-brand-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            For {property.listingType}
          </span>
        </div>

        {/* Quick action icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-md ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-red-500'
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleCompareClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-md ${
              isCompared
                ? 'bg-brand-600 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-brand-600'
            }`}
            title="Compare Property"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom image overlay with Price */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent p-3 pt-8 flex items-end justify-between text-white">
          <div>
            <p className="text-[11px] text-slate-300 font-medium">Price</p>
            <p className="text-xl font-extrabold tracking-tight text-white">
              {property.priceDisplay || `₹ ${(property.price / 10000000).toFixed(2)} Cr`}
            </p>
          </div>
          {property.reraNumber && (
            <div className="flex items-center gap-1 text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>RERA Registered</span>
            </div>
          )}
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Developer */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 font-semibold text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>
            {property.developer?.name && (
              <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                By {property.developer.name}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/properties/${property.slug}`}>
            <h3 className="font-bold text-navy-950 text-base leading-snug line-clamp-2 hover:text-brand-600 transition-colors mb-3">
              {property.title}
            </h3>
          </Link>

          {/* Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-slate-700 text-xs mb-3">
            {property.bedrooms ? (
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{property.bedrooms} BHK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{property.propertyType}</span>
              </div>
            )}

            {property.bathrooms ? (
              <div className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{property.bathrooms} Baths</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-500">
                <span>{property.facing || 'East'} Facing</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 justify-end">
              <span className="font-bold text-slate-800">
                {property.area} {property.areaUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <a
            href={`https://wa.me/917013873126?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => (onEnquire ? onEnquire(property) : (window.location.href = `/properties/${property.slug}#enquire`))}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
}
