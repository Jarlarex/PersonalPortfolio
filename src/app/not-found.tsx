import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="max-w-2xl text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-gray-200 sm:text-[12rem] dark:text-gray-800">
            404
          </h1>
        </div>

        {/* Main Message */}
        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          Oops! Page Not Found
        </h2>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for seems to have wandered off into the
          digital wilderness. Don&apos;t worry though, let&apos;s get you back
          on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Browse Blog
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Or explore these pages
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              About
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link
              href="/projects"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Projects
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link
              href="/blog"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
