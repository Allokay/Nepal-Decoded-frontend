'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ArticleImageProps {
  articleUrl?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ArticleImage({ articleUrl, alt, className = '', priority = false }: ArticleImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOgImage = async () => {
      if (!articleUrl) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/og-image?url=${encodeURIComponent(articleUrl)}`);
        const data = await res.json();
        if (active) {
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        }
      } catch (err) {
        console.error('Failed to load OG image:', err);
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

  if (loading) {
    return (
      <div className={`bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center ${className}`}>
        <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-600 opacity-50" />
      </div>
    );
  }

  if (!imageUrl) {
    // If no image is found, return nothing or a minimal placeholder depending on usage
    return null; 
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover transition-opacity duration-500 opacity-0 ${className}`}
      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}
