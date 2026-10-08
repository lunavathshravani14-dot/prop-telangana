'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Heart, Scale, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setUser(data.data.user);
          setName(data.data.user.name || '');
          setPhone(data.data.user.phone || '');
        } else {
          router.push('/login?redirect=/my-account');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pt-32 pb-20 text-center text-sm font-semibold text-slate-500">Loading your profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">My Account</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950">User Profile & Account</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Overview Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-extrabold mb-4 shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-extrabold text-lg text-navy-950">{user.name}</h3>
            <p className="text-xs text-slate-500 truncate max-w-full">{user.email}</p>
            <span className="mt-2 inline-block px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-brand-200">
              Role: {user.role}
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-2 text-left">
              <Link
                href="/favorites"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Saved Properties
                </span>
                <span>→</span>
              </Link>
              <Link
                href="/compare"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-600" /> Comparison
                </span>
                <span>→</span>
              </Link>
              {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'AGENT') && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-brand-50 text-xs font-bold text-brand-800 transition-colors"
                >
                  <span>Admin Management Panel</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Edit Details Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-extrabold text-navy-950 mb-4">Edit Profile Information</h2>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">Email address is tied to your login identity.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
