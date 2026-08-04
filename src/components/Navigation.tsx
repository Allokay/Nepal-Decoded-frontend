'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const categories = [
    { name: 'Politics', slug: 'politics', path: '/politics' },
    { name: 'Business', slug: 'business', path: '/business' },
    { name: 'Sports', slug: 'sports', path: '/sports' },
    { name: 'Health', slug: 'health', path: '/health' },
    { name: 'World', slug: 'world', path: '/world' },
  ];

  const isHomeActive = pathname === '/';

  const getButtonStyles = (isActive: boolean) => {
    return `font-display font-semibold px-5 py-2 rounded-md transition-all duration-300 text-sm tracking-wide ${
      isActive
        ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;
  };

  const getMobileButtonStyles = (isActive: boolean) => {
    return `block w-full text-left px-5 py-2.5 font-display font-semibold transition-colors text-sm border-l-4 ${
      isActive
        ? 'bg-brand-red/10 text-brand-red border-brand-red'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
    }`;
  };

  return (
    <nav className="sticky top-[140px] md:top-[128px] z-30 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* DESKTOP MENU */}
        <div className="flex items-center justify-center py-2.5 hidden md:flex">
          <div className="flex items-center gap-1">
            <Link href="/" className={getButtonStyles(isHomeActive)}>
              Home
            </Link>

            {categories.map((category) => {
              const isActive = pathname === category.path;
              return (
                <Link
                  key={category.slug}
                  href={category.path}
                  className={getButtonStyles(isActive)}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="md:hidden flex items-center justify-between py-2">
          <Link href="/" className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 px-3">
            Menu
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#090d16] animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={getMobileButtonStyles(isHomeActive)}
            >
              Home
            </Link>

            {categories.map((category) => {
              const isActive = pathname === category.path;
              return (
                <Link
                  key={category.slug}
                  href={category.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={getMobileButtonStyles(isActive)}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
