import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/queries/public';
import ModelViewer3D from '@/components/ModelViewer3D';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/projects"
          className="font-mono text-xs text-amber-400 hover:underline"
        >
          ← Quay lại danh sách Dự án
        </Link>

        <header className="mt-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-amber-400">{project.domains?.name || 'Engineering Case Study'}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">{project.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{project.summary}</p>
        </header>

        {project.model_3d_url && (
          <section className="mt-10">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-amber-400">
              Mô hình 3D Trực quan
            </h2>
            <ModelViewer3D modelUrl={project.model_3d_url} altText={project.title} />
          </section>
        )}

        {project.cover_image_url && (
          <section className="mt-10 overflow-hidden rounded-xl border border-slate-800">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="max-h-[480px] w-full object-cover"
            />
          </section>
        )}

        <div className="mt-12 space-y-10">
          {project.problem_statement && (
            <section className="rounded-xl border border-slate-800 bg-[#112240] p-7">
              <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400">
                01. Bài toán &amp; Bối cảnh Kỹ thuật
              </h2>
              <div className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
                {project.problem_statement}
              </div>
            </section>
          )}

          {project.methodology && (
            <section className="rounded-xl border border-slate-800 bg-[#112240] p-7">
              <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400">
                02. Phương pháp luận &amp; Quy trình Triển khai
              </h2>
              <div className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
                {project.methodology}
              </div>
            </section>
          )}

          {project.results && (
            <section className="rounded-xl border border-slate-800 bg-[#112240] p-7">
              <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400">
                03. Kết quả Đạt được &amp; Thực chứng
              </h2>
              <div className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
                {project.results}
              </div>
            </section>
          )}

          {project.lessons_learned && (
            <section className="rounded-xl border border-slate-800 bg-[#112240] p-7">
              <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400">
                04. Đánh giá &amp; Bài học Rút ra
              </h2>
              <div className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
                {project.lessons_learned}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}