import Link from 'next/link';
import { getAboutData } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const { profile, domains, roadmap } = await getAboutData();

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 border-b border-slate-800 pb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Biography &amp; Academic Trajectory
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {profile?.full_name || 'Hồ sơ Chuyên gia'}
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            {profile?.professional_title}
          </p>
          {profile?.philosophy_quote && (
            <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 italic text-slate-300">
              “{profile.philosophy_quote}”
            </blockquote>
          )}
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-white">Hành trình &amp; Triết lý Chuyên môn</h2>
            <div className="whitespace-pre-line leading-relaxed text-slate-300">
              {profile?.full_biography || profile?.short_bio}
            </div>
          </div>

          <aside className="space-y-6 rounded-xl border border-slate-800 bg-[#112240] p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-amber-400">
              Trụ cột Nghiên cứu
            </h3>
            {domains.length === 0 ? (
              <p className="text-sm text-slate-400">Chưa có lĩnh vực nào được cập nhật trong CMS.</p>
            ) : (
              <ul className="space-y-4">
                {domains.map((domain: any) => (
                  <li key={domain.id} className="border-b border-slate-800 pb-3 last:border-none">
                    <span className="font-mono text-xs text-amber-400">{domain.code}</span>
                    <p className="font-medium text-white">{domain.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{domain.description}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-2">
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-amber-400 px-4 py-2.5 text-center text-sm font-semibold text-[#0A192F] transition hover:bg-amber-300"
              >
                Kết nối &amp; Hợp tác
              </Link>
            </div>
          </aside>
        </div>

        {roadmap.length > 0 && (
          <section className="mt-16 border-t border-slate-800 pt-12">
            <h2 className="text-2xl font-bold text-white">Các cột mốc phát triển tiêu biểu</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {roadmap.slice(0, 4).map((item: any) => (
                <div key={item.id} className="rounded-xl border border-slate-800 bg-[#112240] p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span>{item.phase_code}</span>
                    <span>{item.target_date || item.status}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}