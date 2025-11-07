'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange } from '@/lib/auth';

interface ProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Protected route component
 * Redirects to /login if user is not authenticated
 *
 * @example
 * ```tsx
 * <Protected>
 *   <AdminDashboard />
 * </Protected>
 * ```
 */
export default function Protected({ children, fallback }: ProtectedProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
        // Redirect to login if not authenticated
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          </div>
        </div>
      )
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

