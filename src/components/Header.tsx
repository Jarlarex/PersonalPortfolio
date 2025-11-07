'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChange, signOut as authSignOut } from '@/lib/auth';
import ThemeToggle from './ThemeToggle';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authSignOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <nav
          className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xl font-bold transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Go to homepage"
            >
              Portfolio
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/admin"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/admin'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                  }`}
                  aria-current={pathname === '/admin' ? 'page' : undefined}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
                >
                  {signingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
