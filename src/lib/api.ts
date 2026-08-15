export const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://nepal-decoded-backend.onrender.com')
  : '';

export interface NewsSource {
  name: string;
  url: string;
  publishedTime?: string;
}

export interface NewsData {
  id: string;
  title: string;
  category: string;
  sourceCount: number;
  publishedAt: string;
  sources: NewsSource[];
  sourceName?: string;  // Compatible with single source formatting
  articleUrl?: string;  // Compatible with single source formatting
}

export interface StoryDetail {
  id: number;
  headline: string;
  category: string;
  trending: boolean;
  publishedTime: string;
  sources: NewsSource[];
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

export interface MetalPrices {
  gold: { price: number; currency: string; unit: string };
  silver: { price: number; currency: string; unit: string };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
  type: 'short' | 'long';
}

// Fetch articles by category
export const fetchCategoryArticles = async (category: string): Promise<NewsData[]> => {
  try {
    const backendCategoryMap: Record<string, string> = {
      'business': 'business',
      'politics': 'politics',
      'sports': 'sports',
      'health': 'health',
      'world': 'world'
    };

    const backendCategory = backendCategoryMap[category] || category;
    const isHome = category === 'home' || !category;
    
    // Express backend endpoints:
    // Home shows /api/stories
    // Categories show /api/news/:category
    const endpoint = isHome ? '/api/stories' : `/api/news/${backendCategory}`;
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      next: { revalidate: 60 } // Refresh every 60 seconds - fresh but CPU-efficient
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data.stories)) {
      return data.data.stories.map((story: any) => ({
        id: story.id || story.newsId,
        title: story.title || story.headline,
        category: story.category,
        sourceCount: story.sourceCount,
        publishedAt: story.publishedAt,
        sources: story.sources || [],
        sourceName: story.sourceName,
        articleUrl: story.articleUrl
      }));
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error(`Error fetching ${category} articles:`, error);
    // Return mock data for development / fallback
    return getMockArticlesByCategory(category);
  }
};

// Fetch dynamic weather data
export const fetchWeather = async (): Promise<WeatherData | null> => {
  try {
    // Fetch directly from Open-Meteo to bypass broken backend
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=27.7017&longitude=85.3206&current=temperature_2m,weather_code', {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!response.ok) throw new Error('Weather API error');
    
    const data = await response.json();
    
    if (data && data.current) {
      const code = data.current.weather_code;
      let condition = 'clear';
      if (code >= 1 && code <= 3) condition = 'cloudy';
      if (code >= 51 && code <= 67) condition = 'rain';
      if (code >= 71 && code <= 77) condition = 'snow';
      if (code >= 95) condition = 'thunderstorm';

      return {
        temperature: Math.round(data.current.temperature_2m),
        condition: condition,
        location: 'Kathmandu'
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching weather directly:', error);
    return null;
  }
};

// Fetch dynamic metal prices (Gold & Silver)
export const fetchMetals = async (): Promise<MetalPrices | null> => {
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json', { next: { revalidate: 3600 } }),
      fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xag.json', { next: { revalidate: 3600 } })
    ]);

    if (!goldRes.ok || !silverRes.ok) throw new Error('Metals API error');

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const nprPerXau = goldData.xau.npr;
    const nprPerXag = silverData.xag.npr;

    // Convert Troy Ounce to Tola (1 Troy Ounce = ~2.66666 Tolas)
    const tolasPerOunce = 31.1034768 / 11.6638;

    const goldPerTola = nprPerXau / tolasPerOunce;
    const silverPerTola = nprPerXag / tolasPerOunce;

    return {
      gold: { price: goldPerTola, currency: 'NPR', unit: 'tola' },
      silver: { price: silverPerTola, currency: 'NPR', unit: 'tola' }
    };
  } catch (error) {
    console.error('Error fetching metals directly:', error);
    return null;
  }
};

// Fetch a single story by ID (for news detail page)
export const fetchStoryById = async (id: string): Promise<StoryDetail | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/news/story/${id}`, {
      next: { revalidate: 300 } // Cache story pages for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      return {
        id: data.data.id,
        headline: data.data.headline,
        category: data.data.category,
        trending: data.data.trending,
        publishedTime: data.data.publishedTime,
        sources: data.data.sources.map((src: any) => ({
          name: src.name,
          url: src.url,
          publishedTime: src.publishedTime
        }))
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    // Generate mock fallback for development
    return getMockStoryById(id);
  }
};

// Fetch YouTube video feed from backend
export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/youtube`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!response.ok) throw new Error('YouTube API error');
    const data = await response.json();
    return data.success ? data.videos : [];
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

// Mock fallback generator
const getMockStoryById = (id: string): StoryDetail | null => {
  const allArticles = getMockArticles();
  const matched = allArticles.find(a => a.id === id);
  if (!matched) return null;

  return {
    id: parseInt(matched.id.replace('story-', '') || '0'),
    headline: matched.title,
    category: matched.category,
    trending: matched.sourceCount >= 3,
    publishedTime: matched.publishedAt,
    sources: matched.sources
  };
};

const getMockArticlesByCategory = (category: string): NewsData[] => {
  const allArticles = getMockArticles();
  if (category === 'home' || !category) return allArticles;
  
  const backendCategoryMap: Record<string, string> = {
    'business': 'business',
    'politics': 'politics',
    'sports': 'sports',
    'health': 'health',
    'world': 'world'
  };
  const targetCategory = backendCategoryMap[category] || category;
  return allArticles.filter(a => a.category.toLowerCase() === targetCategory.toLowerCase());
};

const getMockArticles = (): NewsData[] => [
  {
    id: "story-1",
    title: "Nepal Development Projects Making Progress in Various Sectors",
    category: "world",
    sourceCount: 2,
    publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    sources: [
      { name: "BBC News", url: "https://www.bbc.com/news" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com" }
    ]
  },
  {
    id: "story-16",
    title: "Prime Minister Announces New Political Reforms",
    category: "politics",
    sourceCount: 3,
    publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    sources: [
      { name: "Nepal Government News", url: "https://www.nepal.gov.np" },
      { name: "Political Times", url: "https://www.politicaltimes.com" },
      { name: "Democracy Daily", url: "https://www.democracydaily.com" }
    ]
  },
  {
    id: "story-17",
    title: "Election Results Spark Political Debate",
    category: "politics",
    sourceCount: 1,
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    sources: [
      { name: "Election Commission", url: "https://www.election.gov.np" }
    ],
    sourceName: "Election Commission",
    articleUrl: "https://www.election.gov.np"
  },
  {
    id: "story-2",
    title: "नेपालका विभिन्न क्षेत्रमा विकास परियोजनाहरू अगाडि बढिरहेका छन्",
    category: "world",
    sourceCount: 2,
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sources: [
      { name: "नेपाल समाचार", url: "https://www.nepalnews.com" },
      { name: "Online Khabar", url: "https://www.onlinekhabar.com" }
    ]
  },
  {
    id: "story-4",
    title: "आर्थिक वृद्धिमा कृषि क्षेत्रको महत्वपूर्ण योगदान",
    category: "business",
    sourceCount: 3,
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    sources: [
      { name: "अर्थिक अभियान", url: "https://www.arthatimes.com" },
      { name: "Business Age", url: "https://www.businessage.com" },
      { name: "Financial Times", url: "https://www.ft.com" }
    ]
  },
  {
    id: "story-7",
    title: "स्वास्थ्य सेवामा गुणस्तर सुधारका प्रयासहरू",
    category: "health",
    sourceCount: 2,
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    sources: [
      { name: "स्वास्थ्य खबर", url: "https://www.healthnews.com" },
      { name: "Medical Times", url: "https://www.medicaltimes.com" }
    ]
  },
  {
    id: "story-13",
    title: "National Football Tournament in Kathmandu",
    category: "sports",
    sourceCount: 1,
    publishedAt: new Date(Date.now() - 55 * 60 * 60 * 1000).toISOString(),
    sources: [
      { name: "ESPN", url: "https://www.espn.com" }
    ],
    sourceName: "ESPN",
    articleUrl: "https://www.espn.com"
  }
];
