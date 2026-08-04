import { MetadataRoute } from 'next';
import { fetchCategoryArticles } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nepaldecoded.com';

  // 1. Static and category routes
  const staticRoutes = [
    '',
    '/politics',
    '/business',
    '/sports',
    '/health',
    '/world',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'always' as const, // Re-index very frequently for news
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch recent stories from the database to append to the sitemap
  try {
    const recentArticles = await fetchCategoryArticles('home');
    
    const dynamicNewsRoutes = recentArticles.map((article) => ({
      url: `${baseUrl}/news/${article.id}`,
      lastModified: new Date(article.publishedAt || Date.now()),
      changeFrequency: 'hourly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicNewsRoutes];
  } catch (error) {
    console.error('Error generating sitemap dynamic routes:', error);
    return staticRoutes; // Failback to static routes
  }
}
