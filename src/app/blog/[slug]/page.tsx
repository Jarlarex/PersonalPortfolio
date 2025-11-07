import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TagChip from '@/components/TagChip';
import ReadingProgress from '@/components/ReadingProgress';
import { getPostBySlug, getAdjacentPosts } from '@/lib/posts';
import { formatDate, getReadingTimeText } from '@/lib/time';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toDate().toISOString(),
      modifiedTime: post.updatedAt.toDate().toISOString(),
      authors: [post.authorId],
      tags: post.tags,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch the post
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Fetch adjacent posts for navigation
  let adjacentPosts: {
    previous: typeof post | null;
    next: typeof post | null;
  } = { previous: null, next: null };
  try {
    adjacentPosts = await getAdjacentPosts(slug);
  } catch (error) {
    console.error('Error fetching adjacent posts:', error);
  }

  const publishedDate = formatDate(post.createdAt.toDate(), 'MMMM dd, yyyy');
  const readingTime = post.readingTime
    ? getReadingTimeText(post.readingTime)
    : null;

  return (
    <>
      <ReadingProgress />
      <Container as="article" id="main-content" className="py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
              {post.title}
            </h1>

            {/* Metadata */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
              <time dateTime={post.createdAt.toDate().toISOString()}>
                {publishedDate}
              </time>
              {readingTime && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{readingTime}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                  />
                ))}
              </div>
            )}

            {/* Cover Image */}
            {post.coverImageUrl && (
              <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* Post Content */}
          <MarkdownRenderer content={post.content} />

          {/* Post Footer */}
          <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            {/* Share Section (optional placeholder) */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Share this post:
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Previous/Next Navigation */}
            {(adjacentPosts.previous || adjacentPosts.next) && (
              <nav
                className="grid gap-4 sm:grid-cols-2"
                aria-label="Post navigation"
              >
                {/* Previous Post */}
                {adjacentPosts.previous ? (
                  <Link
                    href={`/blog/${adjacentPosts.previous.slug}`}
                    className="group rounded-xl border border-gray-200 p-6 transition-colors hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-500"
                  >
                    <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      ← Previous Post
                    </p>
                    <p className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {adjacentPosts.previous.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}

                {/* Next Post */}
                {adjacentPosts.next && (
                  <Link
                    href={`/blog/${adjacentPosts.next.slug}`}
                    className="group rounded-xl border border-gray-200 p-6 text-right transition-colors hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-500"
                  >
                    <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Next Post →
                    </p>
                    <p className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {adjacentPosts.next.title}
                    </p>
                  </Link>
                )}
              </nav>
            )}
          </footer>
        </div>
      </Container>
    </>
  );
}
