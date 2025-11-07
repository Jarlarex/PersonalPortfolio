import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-gray-200 dark:text-gray-800">
          404
        </h1>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

