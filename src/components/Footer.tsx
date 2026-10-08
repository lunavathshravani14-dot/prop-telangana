import React from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                PROP<span className="text-brand-500">TELANGANA</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Telangana’s most trusted verified real estate discovery platform. Empowering home seekers and institutional investors with 100% TG-RERA and HMDA certified properties, transparent pricing, and expert advisory across Hyderabad and growth corridors.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Level 5, Cyber Crest, HITEC City, Hyderabad, Telangana 500081</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 70138 73126</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:jbinfra.sales25@gmail.com" className="hover:text-brand-400 transition-colors">jbinfra.sales25@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Prime Locations */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Prime Hotspots
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/locations/kokapet" className="hover:text-brand-400 transition-colors">
                  Properties in Kokapet
                </Link>
              </li>
              <li>
                <Link href="/locations/tellapur" className="hover:text-brand-400 transition-colors">
                  Villas in Tellapur
                </Link>
              </li>
              <li>
                <Link href="/locations/financial-district" className="hover:text-brand-400 transition-colors">
                  Flats in Financial District
                </Link>
              </li>
              <li>
                <Link href="/locations/gachibowli" className="hover:text-brand-400 transition-colors">
                  Apartments in Gachibowli
                </Link>
              </li>
              <li>
                <Link href="/locations/mokila" className="hover:text-brand-400 transition-colors">
                  HMDA Plots in Mokila
                </Link>
              </li>
              <li>
                <Link href="/locations/jubilee-hills" className="hover:text-brand-400 transition-colors">
                  Luxury Homes in Jubilee Hills
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Property Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Property Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/residential" className="hover:text-brand-400 transition-colors">
                  Residential Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=VILLA" className="hover:text-brand-400 transition-colors">
                  Gated Community Villas
                </Link>
              </li>
              <li>
                <Link href="/plots" className="hover:text-brand-400 transition-colors">
                  HMDA & DTCP Open Plots
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-brand-400 transition-colors">
                  Commercial Tech Spaces
                </Link>
              </li>
              <li>
                <Link href="/land" className="hover:text-brand-400 transition-colors">
                  Agricultural & Growth Land
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand-400 transition-colors">
                  New Project Launches
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Legal */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  About PropTelangana
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-brand-400 transition-colors">
                  Verified Developers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-400 transition-colors">
                  Market Insights & News
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-brand-400 transition-colors">
                  RERA Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
            <span>
              Telangana RERA Authorized Portal (TG-RERA Registration Facilitator). All property specs verified directly from sanctioned plans.
            </span>
          </div>
          <p>© {new Date().getFullYear()} PropTelangana.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
