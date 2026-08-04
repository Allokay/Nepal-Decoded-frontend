import Link from 'next/link';
import { getTimeSincePublished } from '@/lib/utils';
import { ArticleImage } from './ArticleImage';

interface NewsSource {
  name: string;
  url: string;
}

interface TrendingCardProps {
  id: string;
  title: string;
  sourceCount: number;
  sources: NewsSource[];
  publishedAt: string;
  category?: string;
  showCategory?: boolean;
}

export function TrendingCard({ id, title, sourceCount, sources, publishedAt, category, showCategory = false }: TrendingCardProps) {
  const mainSource = sources[0]?.name || 'Unknown Source';
  const articleUrl = sources[0]?.url;

  return (
    <Link href={`/news/${id}`} className="block group">
      <div className="bg-transparent border-b border-slate-200 dark:border-slate-800 pb-8 pt-4 news-card-hover rounded-none px-4 md:px-6">
        
        {/* Massive Hero Image */}
        <div className="w-full aspect-video md:aspect-[2/1] bg-slate-100 dark:bg-slate-900 mb-6 overflow-hidden border border-slate-200 dark:border-slate-800">
          <ArticleImage 
            articleUrl={articleUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            priority={true}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center text-brand-red text-xs font-bold tracking-widest uppercase font-sans">
            Trending Now
          </span>
          {showCategory && category && (
            <>
              <span className="text-slate-300 dark:text-slate-700 font-sans">•</span>
              <span className="inline-block text-slate-800 dark:text-slate-300 text-xs font-bold uppercase tracking-widest font-sans">
                {category}
              </span>
            </>
          )}
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 leading-tight font-display group-hover:text-brand-red transition-colors duration-200">
          {title}
        </h2>

        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-sans mt-2">
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {sourceCount === 1 ? mainSource : `${mainSource}`}
          </span>
          {sourceCount > 1 && (
            <span className="text-slate-400 dark:text-slate-500">
              and {sourceCount - 1} other {sourceCount - 1 === 1 ? 'source' : 'sources'}
            </span>
          )}
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span suppressHydrationWarning>{getTimeSincePublished(publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
