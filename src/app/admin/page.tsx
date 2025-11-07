'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import Protected from '@/components/Protected';
import ConfirmDialog from '@/components/ConfirmDialog';
import TagChip from '@/components/TagChip';
import { getCurrentUser } from '@/lib/auth';
import { Post, listAllMyPosts, deletePost } from '@/lib/posts';
import { formatDate, getReadingTimeText } from '@/lib/time';
import { storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';

type FilterType = 'all' | 'published' | 'draft';

export default function AdminPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch user and posts
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email || 'Unknown');
      setUserId(user.uid);
      fetchPosts(user.uid);
    }
  }, []);

  // Filter posts when filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPosts(posts);
    } else if (filter === 'published') {
      setFilteredPosts(posts.filter((post) => post.published));
    } else {
      setFilteredPosts(posts.filter((post) => !post.published));
    }
  }, [filter, posts]);

  const fetchPosts = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await listAllMyPosts(uid);
      setPosts(result.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setDeleting(true);
    try {
      // Delete the Firestore document
      await deletePost(postToDelete.id);

      // Delete cover image from Storage if it exists
      if (postToDelete.coverImageUrl && storage) {
        try {
          // Extract the file path from the URL
          // Assuming format: https://firebasestorage.googleapis.com/.../{path}
          const url = new URL(postToDelete.coverImageUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const filePath = decodeURIComponent(pathMatch[1]);
            const imageRef = ref(storage, filePath);
            await deleteObject(imageRef);
          }
        } catch (imgError) {
          console.warn('Failed to delete cover image:', imgError);
          // Continue even if image deletion fails
        }
      }

      // Remove from local state
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.published).length,
    drafts: posts.filter((p) => !p.published).length,
  };

  return (
    <Protected>
      <Container as="main" id="main-content" className="py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
                Manage Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Signed in as:{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {userEmail}
                </span>
              </p>
            </div>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Post
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Posts
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.total}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Published
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.published}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Drafts
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.drafts}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'published'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'draft'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Drafts ({stats.drafts})
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700"></div>
            </div>
          )}

          {/* Posts List */}
          {!loading && filteredPosts.length > 0 && (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Post Info */}
                    <div className="flex-1">
                      <div className="mb-2 flex items-start gap-3">
                        <h2 className="flex-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            post.published
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <p className="mb-3 text-gray-600 dark:text-gray-400">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {post.tags.slice(0, 5).map((tag) => (
                            <TagChip key={tag} tag={tag} />
                          ))}
                          {post.tags.length > 5 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              +{post.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          Created:{' '}
                          {formatDate(post.createdAt.toDate(), 'MMM dd, yyyy')}
                        </span>
                        <span>
                          Updated:{' '}
                          {formatDate(post.updatedAt.toDate(), 'MMM dd, yyyy')}
                        </span>
                        {post.readingTime && (
                          <span>{getReadingTimeText(post.readingTime)}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                          title="View post"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        title="Edit post"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(post)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950"
                        title="Delete post"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
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
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {filter === 'all'
                  ? 'Create your first post to get started'
                  : `No ${filter} posts found`}
              </p>
              {filter === 'all' && (
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Create New Post
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Protected>
  );
}
