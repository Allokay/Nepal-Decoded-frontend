'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRefresh({ intervalMinutes = 15 }: { intervalMinutes?: number }) {
  const router = useRouter();

  useEffect(() => {
    // Set up an interval to refresh the page data
    const intervalId = setInterval(() => {
      // router.refresh() re-fetches the Server Components for the current route
      // without doing a hard browser reload, bringing in fresh news data seamlessly.
      router.refresh();
    }, intervalMinutes * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [router, intervalMinutes]);

  return null;
}
