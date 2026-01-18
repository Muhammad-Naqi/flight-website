import { useMemo } from 'react';
import { apiClient } from '@/lib';

/**
 * Hook to get image URL through the backend API
 * @param imageUrl - The original image URL
 * @param useDirect - If true, bypasses API and uses direct URL
 * @returns The processed image URL
 */
export function useImageUrl(imageUrl: string | undefined | null, useDirect = false): string {
  return useMemo(() => {
    if (useDirect) {
      return apiClient.getDirectImageUrl(imageUrl);
    }
    return apiClient.getImageUrl(imageUrl);
  }, [imageUrl, useDirect]);
}
