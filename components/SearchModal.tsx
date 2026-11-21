'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-[#112240] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm khóa học, dự án, tài liệu kỹ thuật..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="ml-3 rounded border border-slate-700 px-2 py-0.5 font-mono text-xs text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">Đang tìm kiếm...</p>
          ) : !query.trim() ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Nhập từ khóa bất kỳ (ví dụ: composite, taguchi, giáo trình...)
            </p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Không tìm thấy kết quả phù hợp cho “{query}”.
            </p>
          ) : (
            <ul className="space-y-2">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-lg border border-transparent bg-[#0A192F]/70 p-3.5 transition hover:border-amber-400/50"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                      {item.type}
                    </span>
                    <p className="mt-1 font-semibold text-white">{item.title}</p>
                    {item.subtitle && (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">{item.subtitle}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}