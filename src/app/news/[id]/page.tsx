import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchStoryById } from '@/lib/api';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTimeSincePublished } from '@/lib/utils';
import { ExternalLink, Calendar, Tag, Shield, ArrowLeft, Newspaper } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export const runtime = 'edge';
export const revalidate = 60;

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

  return (
    <>
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        {/* BACK LINK */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-red uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Headlines
        </Link>

        {/* MAIN ARTICLE HEADER */}
        <article className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              <Tag className="w-3 h-3 text-slate-400" /> {displayCategory}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1 text-slate-450 dark:text-slate-400 text-xs font-medium" suppressHydrationWarning>
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

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-display tracking-tight pb-3">
            {story.headline}
          </h1>

          {/* SHARE BUTTONS ROW */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(story.headline)}&url=${encodeURIComponent(`https://thenepaldecoded.com/news/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-950 dark:hover:bg-slate-800 hover:text-white dark:hover:text-white transition-all duration-200"
            >
              Twitter / X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://thenepaldecoded.com/news/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-200"
            >
              Facebook
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${story.headline} - https://thenepaldecoded.com/news/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all duration-200"
            >
              WhatsApp
            </a>
          </div>

          {/* SOURCES SECTION */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-brand-red" />
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Read Full Coverage ({story.sources.length} sources)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {story.sources.map((source, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-brand-red/30 dark:hover:border-brand-red/30 transition-all duration-300 group shadow-sm"
                >
                  <div className="space-y-1">
                    <h4 className="font-display font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-brand-red transition-colors duration-300">
                      {source.name}
                    </h4>
                    {source.publishedTime && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Published {getTimeSincePublished(source.publishedTime)}
                      </p>
                    )}
                  </div>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-red dark:hover:bg-brand-red text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-md"
                  >
                    Read Article <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* NEUTRAL INDEXER DISCLAIMER */}
          <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl flex items-start gap-3.5 text-xs text-slate-550 dark:text-slate-400 mt-10 leading-relaxed">
            <Shield className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Nepal Decoded Neutral Aggregating Policy</span>
              We do not copy, translate, or paraphrase news articles. Nepal Decoded is a headline indexer designed to redirect readers to the primary publisher website for full journalistic content. We protect intellectual property and support the media ecosystem by driving traffic directly to source news portals.
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
