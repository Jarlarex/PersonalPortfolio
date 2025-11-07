import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourportfolio.com'),
  title: {
    default: 'Personal Portfolio',
    template: '%s | Personal Portfolio',
  },
  description:
    'A modern portfolio website showcasing my projects, blog posts, and professional experience.',
  keywords: ['portfolio', 'web development', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourportfolio.com',
    title: 'Personal Portfolio',
    description:
      'A modern portfolio website showcasing my projects, blog posts, and professional experience.',
    siteName: 'Personal Portfolio',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Personal Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Portfolio',
    description:
      'A modern portfolio website showcasing my projects, blog posts, and professional experience.',
    images: ['/images/og-default.jpg'],
    creator: '@yourusername',
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
