import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PortraitFrame from '@/components/PortraitFrame';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  const [profileRes, coursesCountRes, lessonsCountRes, libraryCountRes, projectsCountRes] =
    await Promise.all([
      supabase.from('profiles').select('*').limit(1).single(),
      supabase.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('course_lessons').select('id', { count: 'exact', head: true }),
      supabase.from('library_resources').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
    ]);

  const profile = profileRes.data;

  return (
    <main className="min-h-screen text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-400">
              Personal Knowledge Platform
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              {profile?.full_name || 'NGUYỄN CÔNG THÀNH'}
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-200 sm:text-xl">
              {profile?.headline || 'Kỹ sư Cơ khí • Thiết kế Khuôn mẫu, Lập trình CAD/CAM & Nghiên cứu Vật liệu Composite'}
            </p>

            {profile?.philosophy_quote && (
              <blockquote className="mt-6 border-l-2 border-sky-400 pl-4 text-base leading-relaxed text-slate-200">
                {profile.philosophy_quote}
              </blockquote>
            )}

            <p className="mt-6 text-sm leading-relaxed text-slate-400 sm:text-base">
              {profile?.short_bio ||
                'Nền tảng quản trị tri thức cá nhân, hệ thống khóa học chuyên sâu, thư viện tài liệu và các dự án ứng dụng thực tế.'}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/roadmap"
                className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                Khám phá Lộ trình Học tập
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-sky-400/30 bg-[#061A38]/70 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
              >
                Hồ sơ Chuyên môn
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PortraitFrame
              imageUrl={profile?.avatar_url}
              altText={profile?.full_name || 'Nguyễn Công Thành'}
              frameStyle="tech-hud"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-6 border-t border-sky-400/15 pt-10 sm:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-white">{coursesCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Khóa học Hệ thống
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{lessonsCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Bài giảng Chuyên sâu
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{libraryCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Tài liệu Lưu trữ
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{projectsCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Dự án Thực chứng
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}