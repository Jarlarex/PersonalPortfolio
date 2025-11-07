'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import Protected from '@/components/Protected';
import { getCurrentUser } from '@/lib/auth';

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email || 'Unknown');
    }
  }, []);

  return (
    <Protected>
      <Container as="main" id="main-content" className="py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Signed in as:{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {userEmail}
              </span>
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Posts Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Blog Posts
                </h2>
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Manage your blog posts, create new content, and edit existing
                articles.
              </p>
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                Manage Posts
              </button>
            </div>

            {/* Projects Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Projects
                </h2>
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Add new projects to your portfolio and update existing ones.
              </p>
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                Manage Projects
              </button>
            </div>

            {/* Settings Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Settings
                </h2>
                <svg
                  className="h-8 w-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Configure your site settings and preferences.
              </p>
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                View Settings
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:border-gray-800 dark:from-blue-950 dark:to-purple-950">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Quick Stats
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Posts
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  0
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Published
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  0
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Drafts
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  0
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to your admin dashboard! This is a protected route that
              requires authentication.
            </p>
          </div>
        </div>
      </Container>
    </Protected>
  );
}

