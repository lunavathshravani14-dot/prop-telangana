import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompareFloatingBar from '@/components/CompareFloatingBar';

export const metadata: Metadata = {
  title: 'PropTelangana | Verified Real Estate, High-Rise Apartments & Plots in Hyderabad',
  description:
    'Discover 100% TG-RERA and HMDA approved luxury apartments, gated community villas, open plots, and commercial spaces across Hyderabad, Kokapet, Tellapur, and Telangana.',
  keywords: [
    'PropTelangana',
    'Hyderabad Real Estate',
    'Kokapet Neopolis Flats',
    'Tellapur Villas',
    'Mokila HMDA Plots',
    'Financial District Commercial',
    'Telangana RERA Approved Properties',
    'Luxury Apartments Hyderabad',
  ],
  authors: [{ name: 'PropTelangana Editorial Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://proptelangana.com'),
  openGraph: {
    title: 'PropTelangana - Telangana’s Premier Real Estate Portal',
    description: 'Explore verified residential & commercial properties with transparent pricing and RERA verification.',
    url: 'https://proptelangana.com',
    siteName: 'PropTelangana',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropTelangana | Premium Telangana Real Estate',
    description: 'Find verified apartments, villas, and plots across Hyderabad and Telangana.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <CompareFloatingBar />
        <Footer />
      </body>
    </html>
  );
}
