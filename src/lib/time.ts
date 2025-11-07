import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Time and date utility functions
 */

/**
 * Calculate reading time based on word count
 * Assumes average reading speed of 200 words per minute
 *
 * @param text - The text content to analyze
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 *
 * @example
 * calculateReadingTime("Hello world") // 1
 * calculateReadingTime("Lorem ipsum...") // 5
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute = 200
): number {
  // Remove HTML tags and extra whitespace
  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Count words (split by whitespace)
  const wordCount = cleanText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate reading time in minutes (minimum 1 minute)
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readingTime);
}

/**
 * Format a date to a human-readable string
 *
 * @param date - The date to format (Date object, ISO string, or timestamp)
 * @param formatString - The format string (default: "MMMM d, yyyy")
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date()) // "November 7, 2025"
 * formatDate(new Date(), "MMM dd, yyyy") // "Nov 07, 2025"
 */
export function formatDate(
  date: Date | string | number,
  formatString = 'MMMM d, yyyy'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 *
 * @param date - The date to format (Date object, ISO string, or timestamp)
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date()) // "less than a minute ago"
 * formatRelativeTime(Date.now() - 86400000) // "1 day ago"
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Get reading time text with proper pluralization
 *
 * @param minutes - Reading time in minutes
 * @returns Reading time text (e.g., "5 min read")
 *
 * @example
 * getReadingTimeText(1) // "1 min read"
 * getReadingTimeText(5) // "5 min read"
 */
export function getReadingTimeText(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min read';
  }
  return `${minutes} min read`;
}

/**
 * Format a date for SEO/metadata (ISO 8601 format)
 *
 * @param date - The date to format (Date object, ISO string, or timestamp)
 * @returns ISO 8601 formatted date string
 *
 * @example
 * formatDateForSEO(new Date()) // "2025-11-07T00:00:00.000Z"
 */
export function formatDateForSEO(date: Date | string | number): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error formatting date for SEO:', error);
    return new Date().toISOString();
  }
}

/**
 * Check if a date is within a certain number of days
 *
 * @param date - The date to check
 * @param days - Number of days to check within
 * @returns True if date is within the specified number of days
 *
 * @example
 * isWithinDays(new Date(), 7) // true
 * isWithinDays(Date.now() - 86400000 * 10, 7) // false
 */
export function isWithinDays(
  date: Date | string | number,
  days: number
): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= days;
  } catch (error) {
    console.error('Error checking date range:', error);
    return false;
  }
}

/**
 * Parse a Firestore Timestamp to Date
 *
 * @param timestamp - Firestore Timestamp object with seconds and nanoseconds
 * @returns Date object
 */
export function parseFirestoreTimestamp(timestamp: {
  seconds: number;
  nanoseconds: number;
}): Date {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}
