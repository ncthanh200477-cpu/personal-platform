import Link from 'next/link';
import { getCoursesData } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const { courses } = await getCoursesData();

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 border-b border-slate-800 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Structured Curriculum
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Hệ thống Khóa học &amp; Giáo trình</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Các chương trình đào tạo được cấu trúc từ nguyên lý nền tảng đến thực hành kỹ thuật chuyên sâu.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#112240] p-10 text-center">
            <p className="text-slate-300">Chưa có khóa học nào được xuất bản.</p>
            <p className="mt-2 text-sm text-slate-400">
              Hãy truy cập trang Quản trị (/admin) → tab Khóa học để khởi tạo giáo trình đầu tiên.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-[#112240] p-6 transition hover:border-amber-400/60"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400">
                      {course.domains?.name || 'Chuyên đề'}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                      {course.level}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white group-hover:text-amber-400">
                    {course.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {course.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-800 pt-4 text-xs font-mono text-amber-400">
                  Xem đề cương &amp; bài giảng →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}