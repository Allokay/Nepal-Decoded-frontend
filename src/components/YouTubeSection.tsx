'use client';

import { useEffect, useState } from 'react';
import { fetchYouTubeVideos, YouTubeVideo } from '@/lib/api';
import { Video, Sparkles, VolumeX } from 'lucide-react';

export function YouTubeSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const fetched = await fetchYouTubeVideos();
        setVideos(fetched);
      } catch (err: any) {
        console.error('Error in YouTubeSection load:', err);
        setError(err.message || 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const longVideos = videos
    .filter(v => v.type === 'long')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  const shortVideos = videos
    .filter(v => v.type === 'short')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[9/16] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !videos.length) {
    // Graceful hide/fallback if API fails or YouTube credentials are missing
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 space-y-10 border-t border-slate-200/50 dark:border-slate-800/40">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">
          Trending Videos & Shorts
        </h2>
      </div>

      {/* SHORTS */}
      {shortVideos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Latest YouTube Shorts
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {shortVideos.map((v, index) => (
              <div key={v.id || index} className="relative group overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                <iframe
                  className="w-full aspect-[9/16]"
                  src={`https://www.youtube.com/embed/${v.id}?playsinline=1&controls=1&rel=0${
                    index === 0 ? '&autoplay=1&mute=1' : ''
                  }`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />

                {/* Custom unmute overlay ONLY for autoplay short */}
                {index === 0 && (
                  <button
                    onClick={(e) => {
                      const iframe = e.currentTarget.previousElementSibling as HTMLIFrameElement;
                      iframe.src = `https://www.youtube.com/embed/${v.id}?playsinline=1&controls=1&rel=0`;
                      e.currentTarget.remove();
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white text-xs font-semibold hover:bg-black/60 transition-colors gap-2 cursor-pointer"
                  >
                    <VolumeX className="w-5 h-5 animate-bounce" />
                    <span>Tap to unmute</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LONG FORMAT VIDEOS */}
      {longVideos.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Detailed Coverage
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {longVideos.map((v, index) => (
              <div key={v.id || index} className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${v.id}?autoplay=${
                    index === 0 ? 1 : 0
                  }&mute=1&rel=0`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
