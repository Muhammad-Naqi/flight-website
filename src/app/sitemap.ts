import { MetadataRoute } from 'next';
import { apiClient } from '@/lib';

// Helper function to fetch blogs with timeout
async function fetchBlogsWithTimeout(timeoutMs: number = 10000): Promise<any[]> {
  return Promise.race([
    apiClient.getBlogs(1, 100, true).then((response) => response.data),
    new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs)),
  ]).catch((error) => {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flight-travel-agency.com';

  // Get all published blogs with timeout
  const blogs = await fetchBlogsWithTimeout(10000);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.id}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
