/**
 * Utility functions for generating URL-safe slugs
 */

/**
 * Convert a string to a URL-safe slug
 * - Converts to lowercase
 * - Removes special characters
 * - Replaces spaces and underscores with hyphens
 * - Removes consecutive hyphens
 * - Trims hyphens from start and end
 *
 * @param text - The text to slugify
 * @returns A URL-safe slug
 *
 * @example
 * slugify("Hello World!") // "hello-world"
 * slugify("My Awesome Post 2024") // "my-awesome-post-2024"
 * slugify("Special@#$Characters") // "specialcharacters"
 */
export function slugify(text: string): string {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // Remove accents/diacritics
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove all non-word chars except hyphens
      .replace(/[^\w-]+/g, '')
      // Replace multiple hyphens with single hyphen
      .replace(/--+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * Generate a unique slug by appending a timestamp or counter
 *
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 *
 * @example
 * ensureUniqueSlug("hello-world", ["hello-world"]) // "hello-world-1"
 * ensureUniqueSlug("hello-world", ["hello-world", "hello-world-1"]) // "hello-world-2"
 */
export function ensureUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Generate a slug from a title and ensure it's URL-safe
 *
 * @param title - The title to convert to a slug
 * @param maxLength - Maximum length of the slug (default: 100)
 * @returns A URL-safe slug
 *
 * @example
 * generateSlug("My Awesome Blog Post") // "my-awesome-blog-post"
 * generateSlug("My Awesome Blog Post", 10) // "my-awesome"
 */
export function generateSlug(title: string, maxLength = 100): string {
  const slug = slugify(title);

  if (slug.length <= maxLength) {
    return slug;
  }

  // Truncate at the last hyphen before maxLength
  const truncated = slug.substring(0, maxLength);
  const lastHyphen = truncated.lastIndexOf('-');

  return lastHyphen > 0 ? truncated.substring(0, lastHyphen) : truncated;
}

/**
 * Validate if a string is a valid slug format
 *
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 *
 * @example
 * isValidSlug("hello-world") // true
 * isValidSlug("Hello World") // false
 * isValidSlug("hello_world") // false
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Extract a base slug from a slug with counter
 *
 * @param slug - The slug with potential counter
 * @returns The base slug without counter
 *
 * @example
 * extractBaseSlug("hello-world-1") // "hello-world"
 * extractBaseSlug("hello-world") // "hello-world"
 */
export function extractBaseSlug(slug: string): string {
  // Check if slug ends with -number pattern
  const match = slug.match(/^(.+)-(\d+)$/);
  return match ? match[1] : slug;
}

