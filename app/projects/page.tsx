import Link from 'next/link';
import { getProjectsData } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const { projects } = await getProjectsData();

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 border-b border-slate-800 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Engineering &amp; Research Portfolio
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Dự án Thực tế &amp; Case Studies</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Hồ sơ phân tích bài toán kỹ thuật, phương pháp luận triển khai, kết quả thực nghiệm và mô hình 3D trực quan.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#112240] p-10 text-center text-slate-400">
            Chưa có dự án nào được xuất bản. Thêm dự án mới tại mục Dự án &amp; 3D trong trang /admin.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-xl border border-slate-800 bg-[#112240] transition hover:border-amber-400/60"
              >
                {project.cover_image_url && (
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="h-52 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400">{project.domains?.name || 'Project'}</span>
                    {project.model_3d_url && (
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                        Có mô hình 3D
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-white group-hover:text-amber-400">
                    {project.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-300">{project.summary}</p>
                  <p className="mt-5 font-mono text-xs text-amber-400">
                    Xem phân tích chi tiết &amp; mô hình →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}