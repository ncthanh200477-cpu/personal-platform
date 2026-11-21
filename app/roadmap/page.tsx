import { getRoadmapData } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const { items } = await getRoadmapData();

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 border-b border-slate-800 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Learning &amp; Research Roadmap
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Lộ trình Học tập &amp; Nghiên cứu</h1>
          <p className="mt-3 text-slate-300">
            Bản đồ tiến trình tích lũy năng lực, nghiên cứu công nghệ và các cột mốc mục tiêu dài hạn.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#112240] p-10 text-center text-slate-400">
            Chưa có giai đoạn lộ trình nào. Cập nhật tại trang Quản trị (/admin).
          </div>
        ) : (
          <div className="relative space-y-8 border-l-2 border-slate-800 pl-8">
            {items.map((item: any) => (
              <div key={item.id} className="relative rounded-xl border border-slate-800 bg-[#112240] p-6">
                <span className="absolute -left-[41px] top-6 h-4 w-4 rounded-full border-2 border-amber-400 bg-[#0A192F]" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-amber-400">
                    {item.phase_code} {item.domains?.name ? `• ${item.domains.name}` : ''}
                  </span>
                  <span className="rounded-full border border-slate-700 px-3 py-0.5 text-slate-300">
                    {item.status} {item.target_date ? `(${item.target_date})` : ''}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}