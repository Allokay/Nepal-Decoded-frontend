import { MetadataRoute } from 'next';
import { fetchCategoryArticles } from '@/lib/api';

export const revalidate = 3600; // Regenerate sitemap every hour - no need to be more frequent

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thenepaldecoded.com';

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
    changeFrequency: 'always' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch from ALL categories so every article URL gets submitted to Google
  const categories = ['home', 'politics', 'business', 'sports', 'health', 'world'];
  const seenIds = new Set<string>();

  try {
    const allArticleArrays = await Promise.all(
      categories.map((cat) => fetchCategoryArticles(cat).catch(() => []))
    );

    const dynamicNewsRoutes: MetadataRoute.Sitemap = [];
    for (const articles of allArticleArrays) {
      for (const article of articles) {
        const id = String(article.id);
        if (!seenIds.has(id)) {
          seenIds.add(id);
          dynamicNewsRoutes.push({
            url: `${baseUrl}/news/${id}`,
            lastModified: new Date(article.publishedAt || Date.now()),
            changeFrequency: 'hourly' as const,
            priority: 0.7,
          });
        }
      }
    }

    return [...staticRoutes, ...dynamicNewsRoutes];
  } catch (error) {
    console.error('Error generating sitemap dynamic routes:', error);
    return staticRoutes;
  }
}
