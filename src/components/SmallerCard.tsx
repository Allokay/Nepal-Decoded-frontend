import Link from 'next/link';
import { getTimeSincePublished } from '@/lib/utils';

interface NewsSource {
  name: string;
  url: string;
}

interface SmallerCardProps {
  id: string;
  title: string;
  sourceCount: number;
  sources: NewsSource[];
  publishedAt: string;
  category?: string;
  showCategory?: boolean;
}

export function SmallerCard({ id, title, sourceCount, sources, publishedAt, category, showCategory = false }: SmallerCardProps) {
  const mainSource = sources[0]?.name || 'Unknown Source';

  return (
    <Link href={`/news/${id}`} className="block group">
      <div className="news-card-hover p-3 md:p-4 h-full flex flex-col justify-between cursor-pointer rounded-none bg-transparent">
        <div>
          {showCategory && category && (
            <div className="mb-1.5">
              <span className="inline-block text-brand-red dark:text-brand-red text-[9px] font-bold uppercase tracking-widest font-sans select-none">
                {category}
              </span>
            </div>
          )}
          <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-3 group-hover:text-brand-red transition-colors font-display leading-snug">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-sans">
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[80px] md:max-w-[120px]">
            {mainSource}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {sourceCount > 1 && (
              <span className="text-slate-400 font-medium select-none">
                +{sourceCount - 1}
              </span>
            )}
            <span className="text-slate-300 dark:text-slate-700 font-sans">•</span>
            <span suppressHydrationWarning>{getTimeSincePublished(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
