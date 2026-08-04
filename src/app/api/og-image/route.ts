import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Run on Cloudflare edge for global speed

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ success: false, error: 'Missing url parameter' }, { status: 400 });
    }

    // 1. Fetch the target news page HTML (with a timeout to prevent hanging)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      },
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch target URL: ${response.status}`);
    }

    const html = await response.text();

    // 2. Extract og:image content using regex
    const ogImageRegex = /<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i;
    const ogImageMatch = html.match(ogImageRegex);
    
    // Check alternative property syntax (name="og:image")
    const ogImageRegexAlt = /<meta\s+[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["']/i;
    const ogImageMatchAlt = html.match(ogImageRegexAlt);
    
    // Check twitter:image
    const twitterImageRegex = /<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i;
    const twitterImageMatch = html.match(twitterImageRegex);

    let imageUrl = '';
    if (ogImageMatch && ogImageMatch[1]) {
      imageUrl = ogImageMatch[1];
    } else if (ogImageMatchAlt && ogImageMatchAlt[1]) {
      imageUrl = ogImageMatchAlt[1];
    } else if (twitterImageMatch && twitterImageMatch[1]) {
      imageUrl = twitterImageMatch[1];
    }

    // Fallback if no Open Graph image is found
    if (!imageUrl) {
      // Standard Nepal scenery fallback to prevent empty cards
      imageUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop';
    }

    // 3. Return response with edge caching headers (Cache on Cloudflare CDN for 1 day)
    return new NextResponse(
      JSON.stringify({ success: true, imageUrl }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 1 day CDN caching
        },
      }
    );
  } catch (error: any) {
    console.error('Error in og-image scraper:', error.message);
    // Fallback image on error
    return new NextResponse(
      JSON.stringify({
        success: true,
        imageUrl: 'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800&h=600&fit=crop',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache error fallbacks for 1 hour only
        },
      }
    );
  }
}
