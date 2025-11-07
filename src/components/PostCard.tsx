import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/posts';
import { formatDate, getReadingTimeText } from '@/lib/time';
import TagChip from './TagChip';

interface PostCardProps {
  post: Post;
}

/**
 * Blog post card component for listing pages
 */
export default function PostCard({ post }: PostCardProps) {
  const publishedDate = formatDate(post.createdAt.toDate(), 'MMM dd, yyyy');
  const readingTime = post.readingTime
    ? getReadingTimeText(post.readingTime)
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* Cover Image */}
      {post.coverImageUrl && (
        <Link href={`/blog/${post.slug}`} className="relative aspect-video">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
            {post.tags.length > 3 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-gray-600 dark:text-gray-400">
          {post.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <time dateTime={post.createdAt.toDate().toISOString()}>
            {publishedDate}
          </time>
          {readingTime && <span>{readingTime}</span>}
        </div>
      </div>
    </article>
  );
}

