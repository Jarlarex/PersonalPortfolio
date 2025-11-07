import { z } from 'zod';

/**
 * Post validation schemas using Zod
 * These schemas validate blog post data for create/update operations
 */

// Base post schema with common fields
export const postBaseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase alphanumeric with hyphens'
    )
    .trim(),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(300, 'Description must be 300 characters or less')
    .trim(),

  content: z
    .string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be 50000 characters or less'),

  excerpt: z
    .string()
    .max(500, 'Excerpt must be 500 characters or less')
    .optional(),

  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),

  published: z.boolean().default(false),

  featured: z.boolean().default(false),

  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .nullable(),

  readingTime: z.number().int().positive().optional(),
});

// Schema for creating a new post (server-side)
export const createPostSchema = postBaseSchema.extend({
  authorId: z.string().min(1, 'Author ID is required'),

  createdAt: z.date().default(() => new Date()),

  updatedAt: z.date().default(() => new Date()),
});

// Schema for updating an existing post
export const updatePostSchema = postBaseSchema
  .partial()
  .extend({
    updatedAt: z.date().default(() => new Date()),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field must be provided for update',
  });

// Schema for client-side post creation (without server-managed fields)
export const clientPostSchema = postBaseSchema.omit({
  readingTime: true,
});

// Schema for post metadata (lightweight version for lists)
export const postMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()),
  published: z.boolean(),
  featured: z.boolean(),
  coverImage: z.string().nullable().optional(),
  readingTime: z.number().optional(),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type exports for TypeScript
export type PostBase = z.infer<typeof postBaseSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type ClientPost = z.infer<typeof clientPostSchema>;
export type PostMetadata = z.infer<typeof postMetadataSchema>;

/**
 * Helper function to validate post data
 */
export function validatePost<T>(data: unknown, schema: z.ZodSchema<T>) {
  try {
    return {
      success: true as const,
      data: schema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        data: null,
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false as const,
      data: null,
      errors: [{ path: 'unknown', message: 'Validation failed' }],
    };
  }
}

