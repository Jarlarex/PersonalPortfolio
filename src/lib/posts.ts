import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  WhereFilterOp,
} from 'firebase/firestore';
import { db } from './firebase';
import { calculateReadingTime } from './time';
import { slugify } from './slug';

/**
 * Post document structure in Firestore
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  tags: string[];
  authorId: string;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readingTime?: number;
}

/**
 * Post data for creation (without id and timestamps)
 */
export interface CreatePostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  tags: string[];
  published: boolean;
}

/**
 * Post data for updates (all fields optional except updatedAt)
 */
export interface UpdatePostData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  tags?: string[];
  published?: boolean;
}

/**
 * Options for listing published posts
 */
export interface ListPostsOptions {
  limit?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
  tag?: string;
  search?: string;
}

/**
 * Result from listing posts with pagination
 */
export interface ListPostsResult {
  posts: Post[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * Adjacent posts (previous and next)
 */
export interface AdjacentPosts {
  previous: Post | null;
  next: Post | null;
}

/**
 * Error thrown when database is not initialized
 */
class DatabaseNotInitializedError extends Error {
  constructor() {
    super('Firestore database is not initialized. Check Firebase configuration.');
    this.name = 'DatabaseNotInitializedError';
  }
}

/**
 * Error thrown when a post is not found
 */
class PostNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Post not found: ${identifier}`);
    this.name = 'PostNotFoundError';
  }
}

/**
 * Check if Firestore is initialized
 */
function ensureDbInitialized(): void {
  if (!db) {
    throw new DatabaseNotInitializedError();
  }
}

/**
 * Convert Firestore document to Post object
 */
function docToPost(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): Post {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    coverImageUrl: data.coverImageUrl,
    tags: data.tags || [],
    authorId: data.authorId || '',
    published: data.published || false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    readingTime: data.readingTime,
  };
}

/**
 * List published posts with optional filtering and pagination
 *
 * @param options - Options for filtering and pagination
 * @param options.limit - Maximum number of posts to return (default: 10)
 * @param options.cursor - Firestore document snapshot to start after for pagination
 * @param options.tag - Filter by tag (case-sensitive)
 * @param options.search - Search in title and excerpt (case-insensitive)
 * @returns Promise resolving to list of posts with pagination info
 *
 * @example
 * ```typescript
 * const result = await listPublishedPosts({ limit: 10, tag: 'nextjs' });
 * console.log(result.posts);
 * if (result.hasMore) {
 *   const nextPage = await listPublishedPosts({ cursor: result.lastDoc });
 * }
 * ```
 */
export async function listPublishedPosts(
  options: ListPostsOptions = {}
): Promise<ListPostsResult> {
  ensureDbInitialized();

  const {
    limit: limitCount = 10,
    cursor,
    tag,
    search,
  } = options;

  try {
    const postsRef = collection(db!, 'posts');
    const constraints = [];

    // Filter by published status
    constraints.push(where('published', '==', true));

    // Filter by tag if provided
    if (tag) {
      constraints.push(where('tags', 'array-contains', tag));
    }

    // Order by createdAt descending (newest first)
    constraints.push(orderBy('createdAt', 'desc'));

    // Add pagination cursor
    if (cursor) {
      constraints.push(startAfter(cursor));
    }

    // Add limit (fetch one extra to check if there are more)
    constraints.push(firestoreLimit(limitCount + 1));

    const q = query(postsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let posts = querySnapshot.docs.map(docToPost);

    // Client-side search filtering (Firestore doesn't support full-text search)
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
      );
    }

    // Check if there are more results
    const hasMore = posts.length > limitCount;

    // Remove the extra document if we have more than limit
    if (hasMore) {
      posts = posts.slice(0, limitCount);
    }

    // Get the last document for pagination
    const lastDoc = posts.length > 0 
      ? querySnapshot.docs[posts.length - 1] 
      : null;

    return {
      posts,
      lastDoc,
      hasMore,
    };
  } catch (error) {
    console.error('Error listing published posts:', error);
    throw new Error(`Failed to list published posts: ${(error as Error).message}`);
  }
}

/**
 * Get a single post by its slug
 *
 * @param slug - The URL slug of the post
 * @returns Promise resolving to the post or null if not found
 *
 * @example
 * ```typescript
 * const post = await getPostBySlug('my-first-post');
 * if (post) {
 *   console.log(post.title);
 * }
 * ```
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureDbInitialized();

  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug provided');
  }

  try {
    const postsRef = collection(db!, 'posts');
    const q = query(postsRef, where('slug', '==', slug), firestoreLimit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return docToPost(querySnapshot.docs[0]);
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw new Error(`Failed to get post by slug: ${(error as Error).message}`);
  }
}

/**
 * Get adjacent posts (previous and next) for navigation
 * Orders by createdAt, so "previous" is older and "next" is newer
 *
 * @param slug - The slug of the current post
 * @returns Promise resolving to previous and next posts
 *
 * @example
 * ```typescript
 * const { previous, next } = await getAdjacentPosts('current-post-slug');
 * ```
 */
export async function getAdjacentPosts(slug: string): Promise<AdjacentPosts> {
  ensureDbInitialized();

  try {
    // First, get the current post to know its createdAt
    const currentPost = await getPostBySlug(slug);
    if (!currentPost) {
      throw new PostNotFoundError(slug);
    }

    const postsRef = collection(db!, 'posts');

    // Get previous post (older, created before current)
    const previousQuery = query(
      postsRef,
      where('published', '==', true),
      where('createdAt', '<', currentPost.createdAt),
      orderBy('createdAt', 'desc'),
      firestoreLimit(1)
    );
    const previousSnapshot = await getDocs(previousQuery);
    const previous = previousSnapshot.empty
      ? null
      : docToPost(previousSnapshot.docs[0]);

    // Get next post (newer, created after current)
    const nextQuery = query(
      postsRef,
      where('published', '==', true),
      where('createdAt', '>', currentPost.createdAt),
      orderBy('createdAt', 'asc'),
      firestoreLimit(1)
    );
    const nextSnapshot = await getDocs(nextQuery);
    const next = nextSnapshot.empty ? null : docToPost(nextSnapshot.docs[0]);

    return { previous, next };
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      throw error;
    }
    console.error('Error getting adjacent posts:', error);
    throw new Error(`Failed to get adjacent posts: ${(error as Error).message}`);
  }
}

/**
 * Create a new blog post
 *
 * @param data - The post data (without id and timestamps)
 * @param userId - The ID of the user creating the post
 * @returns Promise resolving to the created post with its ID
 *
 * @example
 * ```typescript
 * const newPost = await createPost({
 *   title: 'My First Post',
 *   slug: 'my-first-post',
 *   excerpt: 'This is my first post',
 *   content: '# Hello World',
 *   tags: ['intro', 'hello'],
 *   published: true
 * }, 'user123');
 * ```
 */
export async function createPost(
  data: CreatePostData,
  userId: string
): Promise<Post> {
  ensureDbInitialized();

  if (!userId) {
    throw new Error('User ID is required to create a post');
  }

  // Validate required fields
  if (!data.title || !data.slug || !data.excerpt || !data.content) {
    throw new Error('Missing required fields: title, slug, excerpt, and content are required');
  }

  // Check if slug already exists
  const existingPost = await getPostBySlug(data.slug);
  if (existingPost) {
    throw new Error(`A post with slug "${data.slug}" already exists`);
  }

  try {
    const now = Timestamp.now();
    const readingTime = calculateReadingTime(data.content);

    const postData = {
      ...data,
      authorId: userId,
      readingTime,
      createdAt: now,
      updatedAt: now,
    };

    const postsRef = collection(db!, 'posts');
    const docRef = await addDoc(postsRef, postData);

    return {
      id: docRef.id,
      ...postData,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(`Failed to create post: ${(error as Error).message}`);
  }
}

/**
 * Update an existing blog post
 *
 * @param id - The ID of the post to update
 * @param data - The fields to update (all optional)
 * @returns Promise resolving to the updated post
 *
 * @example
 * ```typescript
 * const updated = await updatePost('post123', {
 *   title: 'Updated Title',
 *   published: true
 * });
 * ```
 */
export async function updatePost(
  id: string,
  data: UpdatePostData
): Promise<Post> {
  ensureDbInitialized();

  if (!id) {
    throw new Error('Post ID is required');
  }

  if (Object.keys(data).length === 0) {
    throw new Error('At least one field must be provided for update');
  }

  try {
    const postRef = doc(db!, 'posts', id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new PostNotFoundError(id);
    }

    // If slug is being updated, check it doesn't conflict
    if (data.slug && data.slug !== postSnap.data().slug) {
      const existingPost = await getPostBySlug(data.slug);
      if (existingPost && existingPost.id !== id) {
        throw new Error(`A post with slug "${data.slug}" already exists`);
      }
    }

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    // Recalculate reading time if content is updated
    if (data.content) {
      updateData.readingTime = calculateReadingTime(data.content);
    }

    await updateDoc(postRef, updateData);

    // Fetch and return the updated document
    const updatedSnap = await getDoc(postRef);
    return docToPost(updatedSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      throw error;
    }
    console.error('Error updating post:', error);
    throw new Error(`Failed to update post: ${(error as Error).message}`);
  }
}

/**
 * Delete a blog post
 *
 * @param id - The ID of the post to delete
 * @returns Promise resolving when the post is deleted
 *
 * @example
 * ```typescript
 * await deletePost('post123');
 * ```
 */
export async function deletePost(id: string): Promise<void> {
  ensureDbInitialized();

  if (!id) {
    throw new Error('Post ID is required');
  }

  try {
    const postRef = doc(db!, 'posts', id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new PostNotFoundError(id);
    }

    await deleteDoc(postRef);
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      throw error;
    }
    console.error('Error deleting post:', error);
    throw new Error(`Failed to delete post: ${(error as Error).message}`);
  }
}

/**
 * List all posts by a specific user (both published and unpublished)
 *
 * @param userId - The ID of the user whose posts to fetch
 * @param options - Optional filtering and pagination options
 * @returns Promise resolving to list of user's posts
 *
 * @example
 * ```typescript
 * const myPosts = await listAllMyPosts('user123');
 * ```
 */
export async function listAllMyPosts(
  userId: string,
  options: { limit?: number; cursor?: QueryDocumentSnapshot<DocumentData> } = {}
): Promise<ListPostsResult> {
  ensureDbInitialized();

  if (!userId) {
    throw new Error('User ID is required');
  }

  const { limit: limitCount = 50, cursor } = options;

  try {
    const postsRef = collection(db!, 'posts');
    const constraints = [];

    // Filter by author
    constraints.push(where('authorId', '==', userId));

    // Order by updatedAt descending (most recently updated first)
    constraints.push(orderBy('updatedAt', 'desc'));

    // Add pagination cursor
    if (cursor) {
      constraints.push(startAfter(cursor));
    }

    // Add limit (fetch one extra to check if there are more)
    constraints.push(firestoreLimit(limitCount + 1));

    const q = query(postsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let posts = querySnapshot.docs.map(docToPost);

    // Check if there are more results
    const hasMore = posts.length > limitCount;

    // Remove the extra document if we have more than limit
    if (hasMore) {
      posts = posts.slice(0, limitCount);
    }

    // Get the last document for pagination
    const lastDoc = posts.length > 0
      ? querySnapshot.docs[posts.length - 1]
      : null;

    return {
      posts,
      lastDoc,
      hasMore,
    };
  } catch (error) {
    console.error('Error listing user posts:', error);
    throw new Error(`Failed to list user posts: ${(error as Error).message}`);
  }
}

/**
 * Export custom error classes for external use
 */
export { DatabaseNotInitializedError, PostNotFoundError };

