import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourportfolio.com'), // TODO: Update with your production domain
  title: {
    default: 'Iarfhlaith Feeney — Portfolio & Blog',
    template: '%s | Iarfhlaith Feeney',
  },
  description:
    "Software Developer from Ireland. Also known online as 'Jarlarex'. Building clean web apps, tinkering with data, and writing about code and cars.",
  keywords: [
    'Iarfhlaith Feeney',
    'Jarlarex',
    'software developer',
    'Ireland',
    'web development',
    'next.js',
    'react',
    'typescript',
    'data',
    'motorsport',
  ],
  authors: [{ name: 'Iarfhlaith Feeney', url: 'https://x.com/ifeeney32' }],
  creator: 'Iarfhlaith Feeney',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourportfolio.com',
    title: 'Iarfhlaith Feeney — Portfolio & Blog',
    description:
      "Software Developer from Ireland. Also known online as 'Jarlarex'. Building clean web apps, tinkering with data, and writing about code and cars.",
    siteName: 'Iarfhlaith Feeney — Portfolio & Blog',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Iarfhlaith Feeney — Portfolio & Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iarfhlaith Feeney — Portfolio & Blog',
    description:
      "Software Developer from Ireland. Also known online as 'Jarlarex'. Building clean web apps, tinkering with data, and writing about code and cars.",
    images: ['/images/og-default.jpg'],
    creator: '@ifeeney32',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
