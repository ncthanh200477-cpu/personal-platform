'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(`Lỗi Supabase: ${authError.message}`);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] px-6 text-white">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#112240] p-8 shadow-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
          Admin Control Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold">Đăng nhập Quản trị</h1>
        <p className="mt-2 text-sm text-slate-400">
          Khu vực quản lý nội dung, giáo trình, thư viện và hồ sơ cá nhân.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Email quản trị
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#0A192F] px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#0A192F] px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
          >
            {loading ? 'Đang xác thực...' : 'Truy cập Hệ thống Quản trị'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white">
            &larr; Quay lại Trang chủ công khai
          </Link>
        </div>
      </div>
    </div>
  );
}