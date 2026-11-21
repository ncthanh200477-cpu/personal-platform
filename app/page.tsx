import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getHomePageData } from '@/lib/queries/home';

export const revalidate = 0;

export default async function HomePage() {
  const { profile, domains, featuredCourses, latestInsights, featuredProjects, stats } =
    await getHomePageData();

  const displayName = profile?.full_name || '[Chưa cấu hình Tên thương hiệu trong /admin]';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar brandName={displayName} />

      {/* 1. HERO SECTION - PHONG CÁCH MIDNIGHT NAVY */}
      <section className="bg-[#0A192F] text-white border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
                {profile?.hero_badge || 'PERSONAL KNOWLEDGE PLATFORM'}
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-[1.15]">
                {displayName}
              </h1>

              <p className="text-lg font-medium text-slate-300">
                {profile?.professional_title || '[Chức danh chuyên môn]'}
              </p>

              <blockquote className="border-l-2 border-amber-500 pl-4 italic text-slate-200 text-lg leading-relaxed">
                {profile?.philosophy_quote || '[Triết lý học tập và nghiên cứu]'}
              </blockquote>

              <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                {profile?.short_bio}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/roadmap"
                  className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500"
                >
                  Khám phá Lộ trình Học tập
                </Link>
                <Link
                  href="/about"
                  className="rounded-md border border-slate-600 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-white hover:text-white"
                >
                  Hồ sơ Chuyên môn
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-slate-700/80 bg-[#112240]">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-2">
                      Portrait Placeholder
                    </span>
                    <p className="text-sm">
                      Tải ảnh chân dung chất lượng cao lên trong mục{' '}
                      <span className="text-white font-medium">/admin/profile</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-800 pt-10 sm:grid-cols-4">
            <div>
              <p className="font-mono text-2xl font-bold text-white">{stats.coursesCount}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Khóa học hệ thống</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-white">{stats.lessonsCount}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Bài giảng chuyên sâu</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-white">{stats.resourcesCount}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Tài liệu lưu trữ</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-white">{stats.projectsCount}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Dự án thực chứng</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NHỮNG LĨNH VỰC KIẾN THỨC ĐANG PHÁT TRIỂN */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Research & Core Domains
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Trục Kiến thức & Chuyên môn Phát triển
            </h2>
          </div>
          <Link href="/library" className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline">
            Xem kho lưu trữ tài liệu &rarr;
          </Link>
        </div>

        {domains.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#112240]/60 p-7 transition hover:border-amber-600/50"
              >
                <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {domain.code}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{domain.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
            Chưa có lĩnh vực nào được thiết lập. Thêm lĩnh vực mới tại trang Quản trị.
          </p>
        )}
      </section>

      {/* 3. KHÓA HỌC NỔI BẬT */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1F3A]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Structured Curriculum
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Hệ thống Khóa học Tiêu biểu
              </h2>
            </div>
            <Link href="/courses" className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline">
              Tất cả khóa học &rarr;
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featuredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#112240] p-7 transition hover:-translate-y-0.5 hover:border-amber-600/60"
                >
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
                      {course.level}
                    </span>
                    {course.domain?.name && <span>• {course.domain.name}</span>}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {course.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {course.summary}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
              Chưa có khóa học nổi bật. Xuất bản và đánh dấu nổi bật khóa học trong trang Quản trị để hiển thị tại đây.
            </p>
          )}
        </div>
      </section>

      {/* 4. INSIGHTS MỚI NHẤT & DỰ ÁN TIÊU BIỂU */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Essays & Research Notes
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Góc Chia sẻ & Nghiên cứu</h2>
              </div>
              <Link href="/insights" className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline">
                Đọc thêm &rarr;
              </Link>
            </div>

            {latestInsights.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
                {latestInsights.map((post) => (
                  <article key={post.id} className="py-6">
                    <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
                      <span>{new Date(post.published_at).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.reading_time_minutes} phút đọc</span>
                    </div>
                    <Link href={`/insights/${post.slug}`}>
                      <h3 className="mt-2 text-lg font-semibold hover:text-amber-700 dark:hover:text-amber-400">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
                Chưa có bài viết nào được xuất bản.
              </p>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Applied Works
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Dự án Tiêu biểu</h2>
              </div>
              <Link href="/projects" className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline">
                Tất cả &rarr;
              </Link>
            </div>

            {featuredProjects.length > 0 ? (
              <div className="space-y-6">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#112240] transition hover:border-amber-600/60"
                  >
                    {project.cover_image_url && (
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="h-44 w-full object-cover border-b border-slate-200 dark:border-slate-800"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{project.title}</h3>
                        {project.model_3d_url && (
                          <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-[11px]">
                            3D Model
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {project.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
                Chưa có dự án nổi bật được cập nhật.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-[#0A192F] text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">{displayName}</p>
            <p className="mt-1 text-xs text-slate-400">{profile?.professional_title}</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs">
            {profile?.contact_email && (
              <a href={`mailto:${profile.contact_email}`} className="hover:text-white">
                {profile.contact_email}
              </a>
            )}
            {profile?.social_links?.map((item) => (
              <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" className="hover:text-white">
                {item.platform}
              </a>
            ))}
            <Link href="/admin" className="text-slate-500 hover:text-amber-400">
              Quản trị hệ thống
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}