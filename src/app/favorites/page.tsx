'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Home, Trash2, ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    fetch('/api/favorites')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login?redirect=/favorites');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setFavorites(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, [router]);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Favorites</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950">Saved Properties & Projects</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revisit your shortlisted homes, compare specs, and contact advisors for site visits.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Loading your saved shortlist...</div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-950 mb-2">No Saved Properties Yet</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Click the heart icon on any property card or detail page to curate your personal shortlist.
            </p>
            <Link
              href="/properties"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-2"
            >
              <span>Explore Verified Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              if (fav.property) {
                return (
                  <PropertyCard
                    key={fav.id}
                    property={fav.property}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
