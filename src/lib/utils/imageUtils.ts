import { apiClient } from '../api/client';

/**
 * Utility functions for handling images through the API
 */

/**
 * Get image URL through API proxy
 * @param imageUrl - The original image URL
 * @returns The proxied image URL
 */
export function getImageUrl(imageUrl: string | undefined | null): string {
  return apiClient.getImageUrl(imageUrl);
}

/**
 * Get direct image URL (bypasses API)
 * @param imageUrl - The image URL
 * @returns The original URL or placeholder
 */
export function getDirectImageUrl(imageUrl: string | undefined | null): string {
  return apiClient.getDirectImageUrl(imageUrl);
}

/**
 * Fetch image blob through API
 * @param imageUrl - The URL of the image to fetch
 * @returns Promise that resolves to image Blob
 */
export async function fetchImageBlob(imageUrl: string): Promise<Blob> {
  return apiClient.fetchImageByUrl(imageUrl);
}

/**
 * Create object URL from image blob
 * @param imageUrl - The URL of the image
 * @returns Promise that resolves to object URL string
 */
export async function getImageObjectUrl(imageUrl: string): Promise<string> {
  const blob = await fetchImageBlob(imageUrl);
  return URL.createObjectURL(blob);
}
