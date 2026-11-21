import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCourseBySlug(slug);

  if (!data) {
    notFound();
  }

  const { course, modules, lessons } = data;

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/courses"
          className="font-mono text-xs text-amber-400 hover:underline"
        >
          ← Quay lại danh sách Khóa học
        </Link>

        <header className="mt-6 border-b border-slate-800 pb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-amber-400">{course.domains?.name || 'Khóa học Chuyên môn'}</span>
            <span>•</span>
            <span className="rounded bg-slate-800 px-2.5 py-0.5 text-slate-300">
              Trình độ: {course.level}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{course.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{course.summary}</p>
          {course.description && (
            <div className="mt-6 whitespace-pre-line rounded-xl border border-slate-800 bg-[#112240] p-6 text-sm leading-relaxed text-slate-300">
              {course.description}
            </div>
          )}
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Đề cương &amp; Nội dung Bài giảng</h2>

          {lessons.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-800 bg-[#112240] p-8 text-center text-slate-400">
              Nội dung các bài giảng đang được cập nhật trong hệ thống Quản trị.
            </div>
          ) : modules.length > 0 ? (
            <div className="mt-6 space-y-6">
              {modules.map((mod: any, idx: number) => {
                const moduleLessons = lessons.filter((l: any) => l.module_id === mod.id);
                return (
                  <div key={mod.id} className="rounded-xl border border-slate-800 bg-[#112240] p-6">
                    <p className="font-mono text-xs text-amber-400">Chương {idx + 1}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{mod.title}</h3>
                    <div className="mt-4 space-y-4">
                      {moduleLessons.map((lesson: any, lIdx: number) => (
                        <div key={lesson.id} className="rounded-lg border border-slate-800 bg-[#0A192F] p-5">
                          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="text-amber-400">Bài {lIdx + 1}</span>
                            {lesson.duration_minutes > 0 && <span>{lesson.duration_minutes} phút</span>}
                          </div>
                          <h4 className="mt-1 text-lg font-medium text-white">{lesson.title}</h4>
                          {lesson.video_url && (
                            <a
                              href={lesson.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-xs font-mono text-amber-400 hover:underline"
                            >
                              Mở video bài giảng ↗
                            </a>
                          )}
                          {lesson.content_markdown && (
                            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                              {lesson.content_markdown}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {lessons.map((lesson: any, idx: number) => (
                <div key={lesson.id} className="rounded-xl border border-slate-800 bg-[#112240] p-6">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-amber-400">Bài {idx + 1}</span>
                    {lesson.duration_minutes > 0 && <span>{lesson.duration_minutes} phút</span>}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-white">{lesson.title}</h3>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-mono text-amber-400 hover:underline"
                    >
                      Mở video bài giảng ↗
                    </a>
                  )}
                  {lesson.content_markdown && (
                    <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                      {lesson.content_markdown}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}