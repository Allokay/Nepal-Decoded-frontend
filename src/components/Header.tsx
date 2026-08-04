'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cloud, Sun, Moon, CloudRain, Snowflake, TrendingUp } from 'lucide-react';
import { fetchWeather, fetchMetals, WeatherData, MetalPrices } from '@/lib/api';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [metals, setMetals] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);

    // 1. Clock timer
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // 2. Fetch API data (Weather and Metals)
    const loadDynamicData = async () => {
      try {
        const [weatherData, metalsData] = await Promise.all([
          fetchWeather(),
          fetchMetals()
        ]);
        setWeather(weatherData);
        setMetals(metalsData);
      } catch (err) {
        console.error('Failed to load header dynamic data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDynamicData();

    // 3. Initialize current theme state from HTML class
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className="w-4 h-4 text-blue-400" />;
    if (cond.includes('snow') || cond.includes('hail')) return <Snowflake className="w-4 h-4 text-slate-300" />;
    if (cond.includes('clear') || cond.includes('sun')) return <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />;
    return <Cloud className="w-4 h-4 text-slate-400" />;
  };

  return (
    <header className="bg-white/80 dark:bg-[#090d16]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-45">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* METADATA BAR (DATE, TIME, WEATHER, METALS) - MOVED TO TOP */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[11px] md:text-xs border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 gap-2.5 font-medium text-slate-600 dark:text-slate-400 transition-colors">
          {/* Clock - prevent hydration mismatch via mounted check */}
          <div className="flex items-center gap-1.5 order-2 md:order-1">
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[9px] select-none">
              Live
            </span>
            {mounted ? (
              <div className="flex items-center gap-1.5">
                <span>{formatDate(currentTime)}</span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{formatTime(currentTime)}</span>
              </div>
            ) : (
              <div className="w-32 h-3.5 bg-slate-200 dark:bg-slate-800/80 animate-pulse rounded"></div>
            )}
          </div>

          {/* Dynamic weather & gold rates */}
          <div className="flex flex-wrap items-center justify-center gap-4 order-1 md:order-2">
            {/* Weather widget */}
            {weather ? (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 transition-colors">
                {getWeatherIcon(weather.condition)}
                <span>{weather.location.split(',')[0]}:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{weather.temperature}°C</span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] capitalize">({weather.condition})</span>
              </div>
            ) : (
              loading && (
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
              )
            )}

            {/* Metals Price widget */}
            {metals ? (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 transition-colors">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Market:
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 font-semibold">Gold:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    Rs. {Math.round(metals.gold.price).toLocaleString('en-IN')}/tola
                  </span>
                </div>
                <span className="text-slate-400 dark:text-slate-700 select-none">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold">Silver:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    Rs. {Math.round(metals.silver.price).toLocaleString('en-IN')}/tola
                  </span>
                </div>
              </div>
            ) : (
              loading && (
                <div className="w-36 h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
              )
            )}
          </div>
        </div>

        {/* LOGO & THEME SWITCHER ROW */}
        <div className="flex items-center justify-between md:justify-center relative w-full pt-1">
          {/* Spacing alignment on desktop */}
          <div className="hidden md:block w-10"></div>

          <Link href="/" className="flex flex-col items-center group mx-auto md:mx-0">
            <div className="relative">
              <span className="font-display font-extrabold text-3xl md:text-5xl tracking-wider text-slate-900 dark:text-white uppercase transition-colors">
                NEPAL <span className="text-brand-red">DECODED</span>
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-brand-red group-hover:w-full transition-all duration-300 rounded"></div>
            </div>
            <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest font-semibold font-display">
              Neutral News Aggregator & Headline Indexer
            </p>
          </Link>

          {/* Sophisticated light/dark toggle */}
          <div className="md:absolute md:right-0">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-red/30 dark:hover:border-brand-red/30 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:text-brand-red dark:hover:text-brand-red transition-all duration-300 cursor-pointer shadow-sm relative group"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-12" />
              )}
              {/* Optional tooltip */}
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 dark:bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow font-sans font-bold whitespace-nowrap -translate-x-1/2 left-1/2">
                Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
