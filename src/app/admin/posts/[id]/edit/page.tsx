'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/Container';
import Protected from '@/components/Protected';
import MarkdownEditor from '@/components/MarkdownEditor';
import { getCurrentUser } from '@/lib/auth';
import { getPostById, updatePost } from '@/lib/posts';
import { isValidSlug } from '@/lib/slug';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  coverImageUrl: string;
  published: boolean;
}

interface FormErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  tags?: string;
  coverImage?: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [originalSlug, setOriginalSlug] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    coverImageUrl: '',
    published: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get current user
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const post = await getPostById(postId);

        if (!post) {
          setNotFound(true);
          return;
        }

        // Check if user is the author
        const user = getCurrentUser();
        if (user && post.authorId !== user.uid) {
          alert('You do not have permission to edit this post');
          router.push('/admin');
          return;
        }

        // Populate form with post data
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags.join(', '),
          coverImageUrl: post.coverImageUrl || '',
          published: post.published,
        });
        setOriginalSlug(post.slug);
      } catch (error) {
        console.error('Error loading post:', error);
        alert('Failed to load post');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, router]);

  // Auto-save draft every 10 seconds
  useEffect(() => {
    if (!userId || !postId || !formData.title || !formData.content) return;

    const interval = setInterval(async () => {
      try {
        setAutoSaving(true);
        // Save to localStorage with post ID
        localStorage.setItem(
          `draft-edit-post-${postId}`,
          JSON.stringify(formData)
        );
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setAutoSaving(false);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [userId, postId, formData]);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!postId) return;

    const draft = localStorage.getItem(`draft-edit-post-${postId}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        // Only load draft if it's more recent than the loaded post
        const shouldLoadDraft = window.confirm(
          'A draft was found. Would you like to restore it?'
        );
        if (shouldLoadDraft) {
          setFormData(parsed);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [postId]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors((prev) => ({
        ...prev,
        coverImage: validationError,
      }));
      return;
    }

    setUploadingCover(true);
    setErrors((prev) => ({ ...prev, coverImage: undefined }));

    try {
      const downloadURL = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, coverImageUrl: downloadURL }));
    } catch (error) {
      console.error('Error uploading cover image:', error);
      setErrors((prev) => ({
        ...prev,
        coverImage:
          error instanceof Error ? error.message : 'Failed to upload cover image',
      }));
    } finally {
      setUploadingCover(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Slug validation
    if (!formData.slug) {
      newErrors.slug = 'Slug is required';
    } else if (!isValidSlug(formData.slug)) {
      newErrors.slug =
        'Slug must be URL-safe (lowercase, numbers, hyphens only)';
    }

    // Content validation
    if (!formData.content || formData.content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    // Excerpt validation (optional but recommended)
    if (formData.excerpt && formData.excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt should be under 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent, publish?: boolean) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!userId || !postId) {
      alert('Invalid request');
      return;
    }

    setSubmitting(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Update post data
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt:
          formData.excerpt.trim() ||
          formData.content.substring(0, 150).trim() + '...',
        content: formData.content.trim(),
        tags: tagsArray,
        coverImageUrl: formData.coverImageUrl || undefined,
        published: publish !== undefined ? publish : formData.published,
      };

      await updatePost(postId, postData);

      // Clear draft from localStorage
      localStorage.removeItem(`draft-edit-post-${postId}`);

      // Redirect to admin or the updated post
      if (postData.published) {
        router.push(`/blog/${postData.slug}`);
      } else {
        router.push('/admin');
      }
    } catch (error: unknown) {
      console.error('Error updating post:', error);
      if (error instanceof Error) {
        alert(`Failed to update post: ${error.message}`);
      } else {
        alert('Failed to update post');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Protected>
        <Container as="main" id="main-content" className="py-12">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading post...
              </p>
            </div>
          </div>
        </Container>
      </Protected>
    );
  }

  if (notFound) {
    return (
      <Protected>
        <Container as="main" id="main-content" className="py-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Post Not Found
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              The post you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push('/admin')}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Back to Admin
            </button>
          </div>
        </Container>
      </Protected>
    );
  }

  return (
    <Protected>
      <Container as="main" id="main-content" className="py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Edit Post
            </h1>
            {lastSaved && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {autoSaving
                  ? 'Saving...'
                  : `Last saved at ${lastSaved.toLocaleTimeString()}`}
              </p>
            )}
          </div>

          <form onSubmit={(e) => handleSubmit(e)}>
            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.title
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100`}
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="mb-6">
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.slug
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white px-4 py-3 font-mono text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100`}
                placeholder="url-safe-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.slug}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use lowercase, numbers, and hyphens only. Changing this will
                change the URL.
              </p>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={3}
                className={`w-full rounded-lg border ${
                  errors.excerpt
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100`}
                placeholder="Short summary of the post (optional, will use first 150 chars if empty)"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.excerpt}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                placeholder="nextjs, react, typescript (comma-separated)"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate tags with commas
              </p>
            </div>

            {/* Cover Image */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image
              </label>
              <div className="flex items-start gap-4">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                  {uploadingCover ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    disabled={uploadingCover}
                    className="hidden"
                  />
                </label>
                {formData.coverImageUrl && (
                  <div className="flex-1">
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover preview"
                      className="h-32 w-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.coverImage}
                </p>
              )}
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content *
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => handleChange('content', value)}
                placeholder="Write your post content in Markdown..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.content}
                </p>
              )}
            </div>

            {/* Published Toggle */}
            <div className="mb-8">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Published
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              {formData.published && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {submitting ? 'Unpublishing...' : 'Unpublish'}
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>

              {!formData.published && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={submitting}
                  className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Now'}
                </button>
              )}
            </div>
          </form>
        </div>
      </Container>
    </Protected>
  );
}
