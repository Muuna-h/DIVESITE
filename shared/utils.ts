/**
 * Creates a URL-friendly slug from a string
 * @param str - The string to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove hyphens from start
    .replace(/-+$/, ''); // Remove hyphens from end
}

/**
 * Truncates a string to a specified length and adds an ellipsis if truncated
 * @param str - The string to truncate
 * @param length - The maximum length of the string
 * @returns The truncated string
 */
export function truncateText(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param date - The date to format
 * @returns A relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return then.toLocaleDateString();
  } else if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'just now';
  }
}

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a random string of specified length
 * @param length - The length of the string to generate
 * @returns A random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
