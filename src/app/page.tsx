import { fetchCategoryArticles } from '@/lib/api';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { TrendingCard } from '@/components/TrendingCard';
import { SmallerCard } from '@/components/SmallerCard';
import { NewsCard } from '@/components/NewsCard';
import { PictureSection } from '@/components/PictureSection';
import { YouTubeSection } from '@/components/YouTubeSection';
import { Footer } from '@/components/Footer';

// Ensure the homepage dynamically fetches articles and updates (SSR/ISR)
export const runtime = 'edge';
export const revalidate = 300;

export default async function HomePage() {
  const articles = await fetchCategoryArticles('home');

  // Organize articles: trending card + 4 smaller cards + remaining cards
  const trendingArticle = articles[0];
  const smallerArticles = articles.slice(1, 5);
  const remainingArticles = articles.slice(5);

  return (
    <>
      <Header />
      <Navigation />

      <main className="flex-grow bg-white dark:bg-[#090d16]">
        {/* LATEST NEWS HERO DASHBOARD */}
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          
          <div className="mb-8 border-b-4 border-slate-900 dark:border-slate-100 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest font-display leading-none">
              Top Stories
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold font-sans tracking-widest uppercase">
              Updated every 15 minutes
            </span>
          </div>

          {articles.length > 0 ? (
            <div className="space-y-12">
              
              {/* Top Section: Asymmetrical Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Side: Main Hero */}
                <div className="lg:col-span-8">
                  {trendingArticle && (
                    <TrendingCard
                      id={trendingArticle.id}
                      title={trendingArticle.title}
                      sourceCount={trendingArticle.sourceCount}
                      sources={trendingArticle.sources}
                      publishedAt={trendingArticle.publishedAt}
                    />
                  )}
                </div>
                
                {/* Right Side: Sidebar of Smaller Cards */}
                {smallerArticles.length > 0 && (
                  <div className="lg:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
                    <h3 className="text-[10px] font-black text-brand-red dark:text-brand-red uppercase tracking-[0.2em] mb-4 font-sans">
                      Also in the news
                    </h3>
                    <div className="flex flex-col">
                      {smallerArticles.map((article, index) => (
                        <div key={article.id || `${article.title}-${index}`} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0 pb-1 pt-1 first:pt-0">
                          <SmallerCard
                            id={article.id}
                            title={article.title}
                            sourceCount={article.sourceCount}
                            sources={article.sources}
                            publishedAt={article.publishedAt}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of all remaining aggregated articles */}
              {remainingArticles.length > 0 && (
                <div className="pt-10 border-t-2 border-slate-900 dark:border-slate-100">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider font-display mb-6">
                    More Headlines
                  </h3>
                  {/* Strict Newspaper Grid with 1px borders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-200 dark:border-slate-800">
                    {remainingArticles.map((article, index) => (
                      <div key={article.id || `${article.title}-${index}`} className="border-r border-b border-slate-200 dark:border-slate-800 h-full">
                        <NewsCard
                          id={article.id}
                          title={article.title}
                          sourceCount={article.sourceCount}
                          sources={article.sources}
                          publishedAt={article.publishedAt}
                          showCategory
                          category={article.category}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              No news articles available at the moment.
            </div>
          )}
        </section>

        {/* Dynamic Interactive Widgets */}
        <PictureSection articles={articles} />
        <YouTubeSection />
      </main>

      <Footer />
    </>
  );
}
