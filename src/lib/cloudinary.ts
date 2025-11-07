/**
 * Cloudinary Image Upload Utilities
 *
 * Uses Cloudinary's unsigned upload preset for free image hosting.
 * Includes a dev-only fallback to data URLs for small images (<200KB).
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Maximum file size for fallback (200KB)
const MAX_FALLBACK_SIZE = 200 * 1024;

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(CLOUD_NAME && UPLOAD_PRESET);
}

/**
 * Convert file to data URL (fallback for dev/small images)
 * ⚠️ NOT recommended for production use
 */
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to Cloudinary
 *
 * @param file - Image file to upload
 * @returns Promise resolving to the secure URL of the uploaded image
 *
 * @example
 * ```typescript
 * const file = event.target.files[0];
 * const url = await uploadToCloudinary(file);
 * console.log('Uploaded to:', url);
 * ```
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  // Check if Cloudinary is configured
  if (!isCloudinaryConfigured()) {
    console.warn(
      '⚠️  Cloudinary not configured. Using fallback data URL.\n' +
        'Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local\n' +
        'This fallback is only suitable for development with small images (<200KB).'
    );

    // Fallback for development: use data URL for small images
    if (file.size <= MAX_FALLBACK_SIZE) {
      try {
        const dataURL = await fileToDataURL(file);
        return dataURL;
      } catch (error) {
        console.error('Error converting file to data URL:', error);
        throw new Error('Failed to process image (Cloudinary not configured)');
      }
    } else {
      throw new Error(
        `Image too large for fallback (${(file.size / 1024).toFixed(1)}KB). ` +
          'Please configure Cloudinary or use images smaller than 200KB.'
      );
    }
  }

  // Upload to Cloudinary
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    // Fallback to data URL if upload fails and file is small enough
    if (file.size <= MAX_FALLBACK_SIZE) {
      console.warn('Falling back to data URL due to upload error');
      try {
        return await fileToDataURL(file);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }

    throw new Error(
      error instanceof Error
        ? `Failed to upload image: ${error.message}`
        : 'Failed to upload image'
    );
  }
}

/**
 * Validate image file
 *
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): string | null {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file';
  }

  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `Image size must be less than ${maxSizeMB}MB`;
  }

  // Warn if using fallback with large file
  if (!isCloudinaryConfigured() && file.size > MAX_FALLBACK_SIZE) {
    return `Image too large for fallback mode (${(file.size / 1024).toFixed(1)}KB). Configure Cloudinary or use images < 200KB`;
  }

  return null;
}

/**
 * Get optimized image URL from Cloudinary
 * Applies transformations for performance
 *
 * @param url - Cloudinary image URL
 * @param width - Target width
 * @param height - Target height (optional)
 * @returns Optimized URL with transformations
 *
 * @example
 * ```typescript
 * const optimized = getOptimizedImageUrl(originalUrl, 800, 600);
 * ```
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  height?: number
): string {
  // Only apply transformations to Cloudinary URLs
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/upload/');

    if (pathParts.length !== 2) {
      return url;
    }

    // Build transformation string
    const transforms = [`w_${width}`, 'c_limit', 'q_auto', 'f_auto'];
    if (height) {
      transforms.push(`h_${height}`);
    }

    const transformString = transforms.join(',');
    return `${pathParts[0]}/upload/${transformString}/${pathParts[1]}`;
  } catch {
    return url;
  }
}

