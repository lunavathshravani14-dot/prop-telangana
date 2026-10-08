'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Home,
  LayoutDashboard,
  Building,
  Users,
  Contact,
  FileText,
  UserCheck,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          const role = data.data.user.role;
          if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'AGENT' || role === 'EDITOR') {
            setUser(data.data.user);
          } else {
            router.push('/');
          }
        } else {
          router.push('/login?redirect=/admin');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Properties', href: '/admin/properties', icon: Home },
    { label: 'Projects', href: '/admin/projects', icon: Building },
    { label: 'Developers', href: '/admin/developers', icon: Building2 },
    { label: 'Leads CRM', href: '/admin/leads', icon: Contact },
    { label: 'Consultants / Agents', href: '/admin/agents', icon: UserCheck },
    { label: 'Blog & Articles', href: '/admin/blog', icon: FileText },
    { label: 'Users & Roles', href: '/admin/users', icon: Users },
    { label: 'Audit Trail', href: '/admin/audit-logs', icon: History },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-navy-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">PROP<span className="text-brand-500">TELANGANA</span></span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold -mt-0.5">Control Center</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Site Link */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Public Website
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">View</span>
          </Link>

          <div className="flex items-center justify-between px-3 pt-2">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-brand-400 font-semibold">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-extrabold text-base">PropTelangana Admin</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
