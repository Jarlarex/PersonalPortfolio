'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import TagChip from '@/components/TagChip';
import Pagination from '@/components/Pagination';
import { Post, listPublishedPosts } from '@/lib/posts';

export default function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [cursors, setCursors] = useState<
    Map<number, QueryDocumentSnapshot<DocumentData> | null>
  >(new Map());

  // Get filters from URL
  const searchQuery = searchParams.get('search') || '';
  const selectedTag = searchParams.get('tag') || '';
  const postsPerPage = 10;

  // Calculate total pages (approximate)
  const totalPages = Math.max(currentPage + (hasMore ? 1 : 0), 1);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cursor = cursors.get(currentPage) || undefined;

      const result = await listPublishedPosts({
        limit: postsPerPage,
        cursor: cursor,
        tag: selectedTag || undefined,
        search: searchQuery || undefined,
      });

      setPosts(result.posts);
      setHasMore(result.hasMore);

      // Store cursor for next page
      if (result.lastDoc && result.hasMore) {
        setCursors((prev) => new Map(prev).set(currentPage + 1, result.lastDoc));
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedTag, searchQuery, cursors]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle search
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/blog?${params.toString()}`);
    setCurrentPage(1);
    setCursors(new Map());
  };

  // Handle tag filter
  const handleTagFilter = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === selectedTag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    router.push(`/blog?${params.toString()}`);
    setCurrentPage(1);
    setCursors(new Map());
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get all unique tags from current posts
  const availableTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="search"
            placeholder="Search posts..."
            defaultValue={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
            aria-label="Search blog posts"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by tag:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  active={selectedTag === tag}
                  onClick={() => handleTagFilter(tag)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchQuery || selectedTag) && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Search: {searchQuery}
              </span>
            )}
            {selectedTag && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Tag: {selectedTag}
              </span>
            )}
            <button
              onClick={() => {
                router.push('/blog');
                setCurrentPage(1);
                setCursors(new Map());
              }}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <>
          <div className="mb-12 grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasMore={hasMore}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
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
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            No posts found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || selectedTag
              ? 'Try adjusting your search or filters'
              : 'Check back later for new content'}
          </p>
        </div>
      )}
    </>
  );
}

