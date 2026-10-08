'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Scale,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setUser(data.data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Buy', href: '/properties?listingType=BUY' },
    { label: 'Rent', href: '/properties?listingType=RENT' },
    { label: 'Projects', href: '/projects' },
    { label: 'Plots', href: '/plots' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'Developers', href: '/developers' },
    { label: 'Locations', href: '/locations' },
    { label: 'Blog', href: '/blog' },
  ];

  const isHome = pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'glass-nav shadow-sm py-3'
          : 'bg-gradient-to-b from-navy-950/80 to-transparent py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className={`font-extrabold text-xl tracking-tight ${isScrolled || !isHome ? 'text-navy-950' : 'text-white'}`}>
                  PROP
                </span>
                <span className="font-extrabold text-xl text-brand-500 tracking-tight">
                  TELANGANA
                </span>
              </div>
              <p className={`text-[10px] tracking-wider uppercase font-semibold -mt-1 ${isScrolled || !isHome ? 'text-slate-500' : 'text-slate-300'}`}>
                Verified Real Estate
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-brand-500 ${
                    active
                      ? 'text-brand-500 font-bold'
                      : isScrolled || !isHome
                      ? 'text-slate-700'
                      : 'text-white/90'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Compare shortcut */}
            <Link
              href="/compare"
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${
                isScrolled || !isHome ? 'text-slate-600 hover:text-navy-900' : 'text-white/80 hover:bg-white/10'
              }`}
              title="Compare Properties"
            >
              <Scale className="w-5 h-5" />
            </Link>

            {/* Favorites shortcut */}
            <Link
              href="/favorites"
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${
                isScrolled || !isHome ? 'text-slate-600 hover:text-navy-900' : 'text-white/80 hover:bg-white/10'
              }`}
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* User Account / Admin CTA */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                    isScrolled || !isHome
                      ? 'border-slate-300 text-slate-800 hover:border-brand-500'
                      : 'border-white/30 text-white hover:border-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded bg-brand-100 text-brand-800">
                        {user.role}
                      </span>
                    </div>

                    {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'AGENT' || user.role === 'EDITOR') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 text-brand-700"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Portal
                      </Link>
                    )}

                    <Link
                      href="/my-account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50"
                    >
                      <User className="w-4 h-4" /> My Account
                    </Link>

                    <Link
                      href="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50"
                    >
                      <Heart className="w-4 h-4" /> Saved Properties
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-red-50 text-red-600 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                    isScrolled || !isHome
                      ? 'text-slate-700 hover:text-brand-600'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Enquire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isScrolled || !isHome ? 'text-slate-800' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 text-slate-800 shadow-xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex items-center justify-between px-3 py-2">
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <Heart className="w-4 h-4 text-red-500" /> Saved Properties
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <Scale className="w-4 h-4 text-brand-600" /> Compare
              </Link>
            </div>

            {user ? (
              <div className="pt-2">
                <Link
                  href="/my-account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-navy-900 bg-slate-100 rounded-lg"
                >
                  My Account ({user.name})
                </Link>
                {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'AGENT') && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 mt-1 text-sm font-bold text-brand-700 bg-brand-50 rounded-lg"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 mt-1 text-sm font-semibold text-red-600"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-brand-600 text-white text-sm font-bold shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
