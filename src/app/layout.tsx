import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Personal Portfolio',
    template: '%s | Personal Portfolio',
  },
  description:
    'A modern portfolio website showcasing my projects, blog posts, and professional experience.',
  keywords: [
    'portfolio',
    'web development',
    'next.js',
    'react',
    'typescript',
  ],
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
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
            <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <a href="/" className="text-xl font-bold">
                  Portfolio
                </a>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="/blog"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Blog
                </a>
                <a
                  href="/projects"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Projects
                </a>
              </div>
            </nav>
          </header>
          <main className="flex-1">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <footer className="border-t border-gray-200 py-8 dark:border-gray-800">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Personal Portfolio. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

