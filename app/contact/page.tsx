import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PortraitFrame from '@/components/PortraitFrame';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CORE_COMPETENCIES = [
  {
    code: '01 // CAD-CAM',
    title: 'Thiết kế Khuôn & Gia công CNC',
    desc: 'Thiết kế kết cấu cơ khí, khuôn mẫu trên Autodesk Inventor; lập trình phay/tiện CNC và mô phỏng đường chạy dao trên Mastercam 2D/3D, CIMCO.',
    tags: ['Autodesk Inventor', 'Mastercam', 'CNC Milling/Turning', 'GD&T'],
  },
  {
    code: '02 // REVERSE ENG',
    title: 'Quét 3D & Thiết kế Ngược',
    desc: 'Số hóa biên dạng chi tiết vật lý bằng công nghệ quét 3D, xử lý dữ liệu lưới điểm và dựng lại mô hình tham số CAD chính xác phục vụ chế tạo.',
    tags: ['3D Scanning', 'Surface Reconstruction', 'Metrology'],
  },
  {
    code: '03 // R&D - COMPOSITE',
    title: 'Vật liệu Composite & Ép phun Nhựa',
    desc: 'Nghiên cứu chế tạo vật liệu composite sợi carbon gia cường bằng phương pháp đúc trong khuôn; tối ưu hóa thông số công nghệ bằng Taguchi, RSM, ANOVA & ANN.',
    tags: ['Carbon/Epoxy Composite', 'Injection Molding', 'Taguchi L25', 'ANN / RSM'],
  },
];

const MILESTONES = [
  {
    period: '2026 — Hiện tại',
    role: 'Kỹ sư Vận hành & Quản lý Sản xuất Ép phun Nhựa',
    detail: 'Điều độ kế hoạch ép phun, kiểm soát thông số máy, tối ưu hóa quy trình sản xuất và quản lý nguồn cung ứng linh kiện kỹ thuật.',
  },
  {
    period: '2025 — 2026',
    role: 'Đề tài Nghiên cứu Vật liệu Composite Sợi Carbon',
    detail: 'Phân tích cơ tính và tối ưu hóa quy trình đúc trong khuôn bằng quy hoạch thực nghiệm Taguchi L25, bề mặt đáp ứng RSM, ANOVA, mạng nơ-ron ANN và phân tích vi cấu trúc.',
  },
  {
    period: '2025 — 2026',
    role: 'Trợ giảng Thực hành CAD/CAM/CNC & Thiết kế Ngược',
    detail: 'Hướng dẫn sinh viên ĐH Sư phạm Kỹ thuật TP.HCM thực hành Autodesk Inventor, Mastercam, vận hành máy phay/tiện CNC và công nghệ quét 3D.',
  },
  {
    period: '10 / 2025',
    role: 'Giải Nhì Chung kết Cuộc thi Tự động hóa MTA Automation',
    detail: 'Ứng dụng trí tuệ nhân tạo (AI) vào giám sát an toàn lao động và tiêu chuẩn ESG trong ngành cơ khí chính xác.',
  },
];

export default async function HomePage() {
  const [
    profileRes,
    coursesCountRes,
    lessonsCountRes,
    libraryCountRes,
    projectsCountRes,
    featuredProjectsRes,
    featuredCoursesRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('course_lessons').select('id', { count: 'exact', head: true }),
    supabase.from('library_resources').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase
      .from('projects')
      .select('id, title, slug, summary, cover_image_url, model_3d_url')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(2),
    supabase
      .from('courses')
      .select('id, title, slug, summary, level')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
      .limit(3),
  ]);

  const profile = profileRes.data;
  const featuredProjects = featuredProjectsRes.data || [];
  const featuredCourses = featuredCoursesRes.data || [];

  return (
    <main className="text-slate-100">
      {/* TẦNG 1: HERO SECTION ĐỊNH VỊ THƯƠNG HIỆU CÁ NHÂN */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                Mechanical Engineering • CAD/CAM &amp; R&amp;D
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              {profile?.full_name || 'NGUYỄN CÔNG THÀNH'}
            </h1>

            <p className="mt-3 text-base font-semibold text-sky-400 sm:text-lg">
              {profile?.headline ||
                'Kỹ sư Cơ khí • Thiết kế Khuôn mẫu, Lập trình CAD/CAM & Nghiên cứu Vật liệu Composite'}
            </p>

            <blockquote className="mt-6 rounded-r-xl border-l-2 border-sky-400 bg-[#061A38]/55 py-3 pl-4 pr-4 text-sm leading-relaxed text-slate-200 sm:text-[15px]">
              {profile?.philosophy_quote ||
                'Kết hợp tư duy thiết kế cơ khí chính xác, tối ưu hóa quy trình gia công CNC/ép phun và phân tích dữ liệu thực nghiệm để tạo ra giải pháp kỹ thuật thực tiễn.'}
            </blockquote>

            <p className="mt-6 text-sm leading-7 text-slate-300 sm:text-[15px]">
              {profile?.short_bio ||
                'Tốt nghiệp ngành Công nghệ Kỹ thuật Cơ khí (ĐH Sư phạm Kỹ thuật TP.HCM). Kinh nghiệm thực tiễn trong thiết kế CAD/CAM (Autodesk Inventor, Mastercam 2D/3D), quét 3D & thiết kế ngược, quản lý sản xuất ép phun nhựa và nghiên cứu tối ưu hóa vật liệu Composite bằng phương pháp thực nghiệm (Taguchi, RSM, ANOVA, ANN).'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                Khám phá Dự án &amp; Mô hình 3D
              </Link>
              <Link
                href="/courses"
                className="rounded-lg border border-sky-400/35 bg-[#061A38]/75 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white"
              >
                Hệ thống Khóa học Tự biên soạn
              </Link>
              <Link
                href="/contact"
                className="px-2 py-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
              >
                Kết nối hợp tác →
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

        {/* Dải chỉ số thực chứng */}
        <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-sky-400/20 bg-[#061A38]/60 p-6 backdrop-blur-md sm:grid-cols-4 sm:p-8">
          <div className="border-r border-sky-400/10 pr-4">
            <p className="text-3xl font-extrabold text-white">{coursesCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-sky-300/80">
              Khóa học Hệ thống
            </p>
          </div>
          <div className="sm:border-r sm:border-sky-400/10 sm:pr-4">
            <p className="text-3xl font-extrabold text-white">{lessonsCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-sky-300/80">
              Bài giảng Chuyên sâu
            </p>
          </div>
          <div className="border-r border-sky-400/10 pr-4">
            <p className="text-3xl font-extrabold text-white">{libraryCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-sky-300/80">
              Tài liệu Kỹ thuật
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{projectsCountRes.count ?? 0}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-sky-300/80">
              Dự án Thực chứng
            </p>
          </div>
        </div>
      </section>

      {/* TẦNG 2: NĂNG LỰC CỐT LÕI & HỆ SINH THÁI CÔNG CỤ */}
      <section className="border-t border-sky-400/15 bg-[#020813]/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-sky-400">
                Core Engineering Domains
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Lĩnh vực Chuyên môn &amp; Công nghệ Làm chủ
              </h2>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              Xem hồ sơ năng lực đầy đủ →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CORE_COMPETENCIES.map((item) => (
              <div
                key={item.code}
                className="flex flex-col justify-between rounded-2xl border border-sky-400/20 bg-[#061A38]/65 p-7 transition hover:border-sky-400/50"
              >
                <div>
                  <span className="font-mono text-xs font-semibold tracking-wider text-sky-400">
                    {item.code}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.desc}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-sky-400/10 pt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-sky-400/20 bg-[#020813]/80 px-2.5 py-1 font-mono text-[11px] text-sky-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TẦNG 3: DỰ ÁN & NGHIÊN CỨU THỰC CHỨNG */}
      <section className="border-t border-sky-400/15 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-sky-400">
                Featured Research &amp; Case Studies
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Đồ án &amp; Dự án Kỹ thuật Tiêu biểu
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              Tất cả dự án &amp; mô hình 3D →
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border border-sky-400/20 bg-[#061A38]/65 transition hover:border-sky-400/60"
                >
                  {project.cover_image_url && (
                    <div className="h-56 w-full overflow-hidden border-b border-sky-400/15 bg-[#020813]">
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-sky-400">
                      <span>Case Study</span>
                      {project.model_3d_url && (
                        <span className="rounded bg-sky-500/15 px-2 py-0.5 text-sky-300">
                          3D Interactive
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-white transition group-hover:text-sky-400">
                      {project.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                      {project.summary}
                    </p>
                    <p className="mt-5 font-mono text-xs font-semibold text-sky-400">
                      Xem phân tích &amp; số liệu thực nghiệm →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-sky-400/20 bg-[#061A38]/50 p-8 text-center text-sm text-slate-400">
              Các dự án kỹ thuật và mô hình 3D đang được cập nhật từ hệ thống quản trị.
            </div>
          )}
        </div>
      </section>

      {/* TẦNG 4: HỆ THỐNG KHÓA HỌC & TÀI LIỆU ĐÀO TẠO */}
      <section className="border-t border-sky-400/15 bg-[#020813]/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-sky-400">
                Structured Curriculum
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Hệ thống Khóa học &amp; Giáo trình Tự biên soạn
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              Xem toàn bộ khóa học →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(featuredCourses.length > 0
              ? featuredCourses
              : [
                  {
                    id: 'c1',
                    slug: '',
                    level: 'Thực hành CAD/CAM',
                    title: 'Lập trình Gia công Phay CNC với Mastercam 2D',
                    summary:
                      'Hệ thống bài giảng từ thiết lập phôi, chọn dao, chiến lược chạy dao 2D (Contour, Pocket, Drill) đến xuất mã G-Code chuẩn cho máy CNC.',
                  },
                  {
                    id: 'c2',
                    slug: '',
                    level: 'Thiết kế Cơ khí 3D',
                    title: 'Thiết kế Chi tiết & Lắp ráp với Autodesk Inventor',
                    summary:
                      'Quy trình dựng hình tham số 3D, lắp ráp cụm chi tiết cơ khí, mô phỏng chuyển động và xuất bản vẽ kỹ thuật 2D đạt chuẩn.',
                  },
                  {
                    id: 'c3',
                    slug: '',
                    level: 'Công nghệ Đo kiểm & Số hóa',
                    title: 'Quét 3D & Thiết kế Ngược (Reverse Engineering)',
                    summary:
                      'Quy trình thu thập dữ liệu đám mây điểm, xử lý bề mặt lưới (Mesh) và tái thiết kế mô hình CAD chính xác phục vụ chế tạo khuôn.',
                  },
                ]
            ).map((course) => (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-sky-400/20 bg-[#061A38]/65 p-7 transition hover:border-sky-400/50"
              >
                <div>
                  <span className="inline-block rounded-md bg-sky-500/15 px-2.5 py-1 font-mono text-[11px] font-semibold text-sky-300">
                    {course.level || 'Chuyên sâu'}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{course.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{course.summary}</p>
                </div>
                <div className="mt-6 pt-4">
                  <Link
                    href={course.slug ? `/courses/${course.slug}` : '/courses'}
                    className="font-mono text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                  >
                    Truy cập đề cương bài giảng →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TẦNG 5: DẤU ẤN KINH NGHIỆM & THÀNH TÍCH */}
      <section className="border-t border-sky-400/15 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-sky-400">
            Experience &amp; Recognition
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Hành trình Chuyên môn &amp; Thành tích Nổi bật
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {MILESTONES.map((m) => (
              <div
                key={m.role}
                className="rounded-2xl border border-sky-400/20 bg-[#061A38]/55 p-6"
              >
                <span className="font-mono text-xs font-semibold text-sky-400">{m.period}</span>
                <h3 className="mt-2 text-base font-bold text-white">{m.role}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TẦNG 6: KÊU GỌI KẾT NỐI TRỰC TIẾP */}
      <section className="border-t border-sky-400/15 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-sky-400/30 bg-gradient-to-r from-[#061A38] via-[#092752] to-[#041326] p-8 shadow-2xl md:flex-row md:items-center md:p-12">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Open to Engineering Opportunities &amp; Collaboration
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Sẵn sàng trao đổi về Cơ hội Nghề nghiệp &amp; Dự án Kỹ thuật
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Quý nhà tuyển dụng, giảng viên và đối tác có thể xem trực tiếp các mô hình 3D, tài liệu kỹ thuật hoặc gửi lời nhắn trao đổi qua kênh liên hệ trực tuyến.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                Gửi lời nhắn Liên hệ
              </Link>
              <Link
                href="/library"
                className="rounded-lg border border-sky-400/40 bg-[#020813]/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-sky-400"
              >
                Thư viện Tài liệu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}