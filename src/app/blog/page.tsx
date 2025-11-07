import { Suspense } from 'react';
import Container from '@/components/Container';
import BlogContent from './BlogContent';

export default function BlogPage() {
  return (
    <Container as="main" id="main-content" className="py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Thoughts, tutorials, and insights on web development
          </p>
        </div>

        {/* Blog Content with Suspense */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700"></div>
            </div>
          }
        >
          <BlogContent />
        </Suspense>
      </div>
    </Container>
  );
}
