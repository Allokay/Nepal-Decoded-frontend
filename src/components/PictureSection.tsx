'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTimeSincePublished } from '@/lib/utils';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface NewsSource {
  name: string;
  url: string;
}

interface NewsData {
  id: string;
  title: string;
  category: string;
  sourceCount: number;
  publishedAt: string;
  sources: NewsSource[];
  articleUrl?: string;
}

interface PictureSectionProps {
  articles: NewsData[];
}

export function PictureSection({ articles }: PictureSectionProps) {
  // Take top 3 articles for featured spotlight
  const featuredArticles = articles.slice(0, 3);

  if (featuredArticles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200/50 dark:border-slate-800/40">
      <div className="mb-8 border-b-4 border-slate-900 dark:border-slate-100 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest font-display leading-none">
          Spotlight & In Focus
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold font-sans tracking-widest uppercase">
          Dynamic Visuals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article) => (
          <FeaturedCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

// Sub-component to isolate client-side image fetching
function FeaturedCard({ article }: { article: NewsData }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const articleUrl = article.articleUrl || article.sources[0]?.url || '';

  useEffect(() => {
    let active = true;

    const loadOgImage = async () => {
      if (!articleUrl) {
        setImageUrl('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/og-image?url=${encodeURIComponent(articleUrl)}`);
        const data = await res.json();
        if (active) {
          setImageUrl(data.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop');
        }
      } catch (err) {
        console.error('Failed to load OG image:', err);
        if (active) {
          setImageUrl('https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800&h=600&fit=crop');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOgImage();

    return () => {
      active = false;
    };
  }, [articleUrl]);

  return (
    <Link href={`/news/${article.id}`} className="block h-full">
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-brand-red/30 dark:hover:border-brand-red/30 transition-all duration-300 bg-slate-900 aspect-[4/3] w-full cursor-pointer flex flex-col justify-end">
        {/* Background Image */}
        {loading ? (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900 animate-pulse flex items-center justify-center rounded-2xl">
            <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-700 animate-bounce" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end pointer-events-none">
          <div className="space-y-2">
            <span className="inline-block bg-brand-red text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
              {article.category || 'General'}
            </span>
            <p className="text-white font-extrabold text-base leading-snug group-hover:text-brand-red transition-colors duration-300 font-display line-clamp-2">
              {article.title}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium pt-1 border-t border-white/10 mt-1">
              <span>{article.sources[0]?.name || 'Nepal News'}</span>
              <span suppressHydrationWarning>{getTimeSincePublished(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
