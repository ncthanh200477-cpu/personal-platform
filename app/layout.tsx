import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Nguyễn Công Thành | Kỹ sư Cơ khí & Portfolio Kỹ thuật',
  description: 'Hệ thống khóa học CAD/CAM, Thiết kế ngược và Nghiên cứu Vật liệu Composite.',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .limit(1)
    .single();

  const brandName = profile?.full_name || 'NGUYỄN CÔNG THÀNH';

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar brandName={brandName} />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-sky-400/15 bg-[#020813]/90 py-8 text-xs text-slate-400">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
            <p className="font-mono">
              © {new Date().getFullYear()} {brandName} • Mechanical Engineering Portfolio
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="transition hover:text-sky-400">
                Hồ sơ
              </Link>
              <Link href="/courses" className="transition hover:text-sky-400">
                Khóa học
              </Link>
              <Link href="/projects" className="transition hover:text-sky-400">
                Dự án &amp; 3D
              </Link>
              <Link href="/contact" className="transition hover:text-sky-400">
                Liên hệ
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}