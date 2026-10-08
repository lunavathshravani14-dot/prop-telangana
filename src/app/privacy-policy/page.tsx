import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | PropTelangana',
  description: 'PropTelangana user privacy, data protection, and lead information confidentiality policy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-navy-950 mb-6">Privacy Policy</h1>
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            Effective Date: January 1, 2026. PropTelangana (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy and personal data.
          </p>
          <h2 className="text-lg font-bold text-navy-950">1. Information We Collect</h2>
          <p>
            When you submit an enquiry, register for an account, or request a site visit, we collect contact details including your name, email address, phone number, and property preferences.
          </p>
          <h2 className="text-lg font-bold text-navy-950">2. How We Use Your Information</h2>
          <p>
            Information collected is strictly utilized to facilitate verified property advisory, schedule builder site tours, provide RERA documentation, and respond to your direct queries. We do not sell or rent user contact numbers to third-party telemarketers.
          </p>
          <h2 className="text-lg font-bold text-navy-950">3. Data Security & Storage</h2>
          <p>
            All account authentication utilizes industry-grade bcrypt encryption and secure session cookies. Communication is encrypted via SSL/TLS.
          </p>
          <h2 className="text-lg font-bold text-navy-950">4. Contact Us</h2>
          <p>
            For data protection inquiries or to request deletion of your saved preferences, contact us at <a href="mailto:privacy@proptelangana.com" className="text-brand-600 underline">privacy@proptelangana.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
