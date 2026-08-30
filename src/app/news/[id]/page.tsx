import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchStoryById } from '@/lib/api';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTimeSincePublished } from '@/lib/utils';
import { ExternalLink, Calendar, Shield, ArrowLeft, Newspaper } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 300; // Cache article pages for 5 minutes

// Generate dynamic metadata for search engines (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) {
    return {
      title: 'Story Not Found',
      description: 'The requested news story is no longer available on Nepal Decoded.',
    };
  }
  const story = await fetchStoryById(id);

  if (!story) {
    return {
      title: 'Story Not Found',
      description: 'The requested news story is no longer available on Nepal Decoded.',
    };
  }

  const cleanHeadline = story.headline.replace(/"/g, "'");

  return {
    title: story.headline,
    description: `Read the headline and access full coverage links for: "${cleanHeadline}". Aggregated from ${story.sources.length} portals on Nepal Decoded.`,
    openGraph: {
      title: `${story.headline} | Nepal Decoded`,
      description: `Read the headline and view original sources. Aggregated from ${story.sources.length} portals on Nepal Decoded.`,
      url: `https://thenepaldecoded.com/news/${resolvedParams.id}`,
      type: 'article',
      publishedTime: story.publishedTime,
      tags: [story.category, 'Nepal News', 'Aggregator'],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.headline,
      description: `Access original coverage links. Aggregated on Nepal Decoded.`,
    },
    alternates: {
      canonical: `https://thenepaldecoded.com/news/${resolvedParams.id}`,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) {
    return (
      <div className="text-center py-20">Story ID is missing.</div>
    );
  }
  const story = await fetchStoryById(id);

  // Handle case where news story is not found or has expired (>15 days cleanup)
  if (!story) {
    return (
      <>
        <Header />
        <Navigation />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-md">
            <div className="mx-auto w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-display">News Story Unavailable</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This news headline is no longer indexable or has expired. Nepal Decoded automatically cleanses data older than 15 days to maintain a fast, dynamic pipeline.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-brand-red dark:hover:bg-brand-red dark:hover:text-white transition-colors duration-300 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayCategory = story.category || 'General';

  const hasMultipleSources = story.sources.length > 1;

  return (
    <>
      <Header />
      <Navigation />

      <main className="flex-grow w-full bg-slate-50 dark:bg-[#0a0f1a] min-h-screen">
        <div className="max-w-3xl mx-auto w-full px-4 py-8 md:py-12">

          {/* BACK LINK */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-red uppercase tracking-wider mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Headlines
          </Link>

          {/* MAIN CARD */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">

            {/* TOP ACCENT BAR */}
            <div className="h-1 w-full bg-brand-red" />

            <div className="p-6 md:p-10">

              {/* CATEGORY + DATE */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-brand-red/10 text-brand-red text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  {displayCategory}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-medium" suppressHydrationWarning>
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(story.publishedTime).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* HEADLINE */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-display tracking-tight mb-8">
                {story.headline}
              </h1>

              {/* DIVIDER */}
              <div className="border-t border-slate-100 dark:border-slate-800 mb-8" />

              {/* SOURCES SECTION */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-4 h-4 text-brand-red" />
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {hasMultipleSources
                      ? `Read Full Coverage — ${story.sources.length} Sources`
                      : 'Read Original Article'}
                  </span>
                </div>

                {story.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between gap-4 w-full p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      index === 0
                        ? 'bg-brand-red border-brand-red text-white hover:bg-red-700 hover:border-red-700 shadow-md shadow-red-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-brand-red dark:hover:border-brand-red hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Source favicon - safe approach */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        index === 0 ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {source.name?.charAt(0)?.toUpperCase() || 'N'}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${index === 0 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {source.name}
                        </p>
                        {source.publishedTime && (
                          <p className={`text-xs mt-0.5 ${index === 0 ? 'text-red-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            Published {getTimeSincePublished(source.publishedTime)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 font-bold text-sm shrink-0 ${
                      index === 0 ? 'text-white' : 'text-brand-red'
                    }`}>
                      {index === 0 ? 'Read Article' : 'Read'}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>

              {/* SHARE ROW */}
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(story.headline)}&url=${encodeURIComponent(`https://thenepaldecoded.com/news/${id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-xs font-semibold transition-all duration-200"
                >
                  Twitter / X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://thenepaldecoded.com/news/${id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-semibold transition-all duration-200"
                >
                  Facebook
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${story.headline} - https://thenepaldecoded.com/news/${id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-xs font-semibold transition-all duration-200"
                >
                  WhatsApp
                </a>
              </div>

            </div>
          </div>

          {/* POLICY NOTICE — subtle, at the bottom */}
          <div className="flex items-start gap-2.5 mt-6 px-1 text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed">
            <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-300 dark:text-slate-700" />
            <p>
              <span className="font-semibold text-slate-500 dark:text-slate-500">Nepal Decoded Neutral Aggregating Policy — </span>
              We do not copy, translate, or paraphrase news articles. Nepal Decoded is a headline indexer that redirects readers to the primary publisher for full journalistic content.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
