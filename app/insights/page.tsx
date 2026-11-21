import { getInsightsData } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const { insights } = await getInsightsData();

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 border-b border-slate-800 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Essays &amp; Technical Notes
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Insights &amp; Phân tích Chuyên sâu</h1>
        </div>

        {insights.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#112240] p-10 text-center text-slate-400">
            Chưa có bài viết nào được đăng tải.
          </div>
        ) : (
          <div className="space-y-8">
            {insights.map((post: any) => (
              <article key={post.id} className="rounded-xl border border-slate-800 bg-[#112240] p-8">
                <div className="flex items-center gap-3 text-xs font-mono text-amber-400">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.reading_time_minutes} phút đọc</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">{post.title}</h2>
                <p className="mt-3 text-slate-300">{post.excerpt}</p>
                <div className="mt-6 whitespace-pre-line border-t border-slate-800 pt-6 text-sm leading-relaxed text-slate-300">
                  {post.content_markdown}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}