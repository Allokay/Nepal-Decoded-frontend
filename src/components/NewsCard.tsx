import Link from 'next/link';
import { getTimeSincePublished } from '@/lib/utils';
import { ArticleImage } from './ArticleImage';

interface NewsSource {
  name: string;
  url: string;
}

interface NewsCardProps {
  id: string;
  title: string;
  sourceCount: number;
  sources: NewsSource[];
  publishedAt: string;
  category?: string;
  showCategory?: boolean;
}

export function NewsCard({ id, title, sourceCount, sources, publishedAt, category, showCategory = false }: NewsCardProps) {
  const mainSource = sources[0]?.name || 'Unknown Source';
  const articleUrl = sources[0]?.url;

  return (
    <Link href={`/news/${id}`} className="block group h-full">
      <div className="news-card-hover p-4 md:p-5 h-full flex flex-col cursor-pointer rounded-none bg-transparent relative">
        
        {/* News Thumbnail */}
        <div className="w-full aspect-[16/9] mb-4 overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
          <ArticleImage 
            articleUrl={articleUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        <div className="flex-grow flex flex-col">
          {showCategory && category && (
            <div className="mb-2">
              <span className="inline-block text-brand-red dark:text-brand-red text-[10px] font-bold uppercase tracking-widest font-sans select-none">
                {category}
              </span>
            </div>
          )}
          <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-3 group-hover:text-brand-red transition-colors font-display leading-snug">
            {title}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-4 font-sans pt-3 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {sourceCount === 1 ? mainSource : `${mainSource}`}
          </span>
          <div className="flex items-center gap-2">
            {sourceCount > 1 && (
              <span className="inline-flex items-center gap-1 text-slate-400 font-medium select-none">
                +{sourceCount - 1} Sources
              </span>
            )}
            <span suppressHydrationWarning>{getTimeSincePublished(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
