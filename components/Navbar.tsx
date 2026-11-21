'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';

interface NavbarProps {
  brandName: string;
}

const NAV_ITEMS = [
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Khóa học', href: '/courses' },
  { label: 'Lộ trình', href: '/roadmap' },
  { label: 'Thư viện', href: '/library' },
  { label: 'Insights', href: '/insights' },
  { label: 'Dự án', href: '/projects' },
  { label: 'Liên hệ', href: '/contact' },
];

export default function Navbar({ brandName }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0A192F]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-white transition hover:text-amber-400"
          >
            {brandName || 'Personal Platform'}
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 transition hover:text-amber-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-md border border-slate-700 bg-[#112240]/70 px-3 py-1.5 text-xs text-slate-300 transition hover:border-amber-400/60 hover:text-white"
            >
              <span>Tìm kiếm</span>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Chuyển giao diện Sáng/Tối"
              className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-amber-400/60 hover:text-white"
            >
              {darkMode ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}