'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ImageCropModal from './ImageCropModal';

const supabase = createClient();

export default function AdminDashboard({
  userEmail,
  initialProfile,
  initialDomains = [],
  initialCourses = [],
  initialLibrary = [],
  initialInsights = [],
  initialProjects = [],
}: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'domains' | 'courses' | 'library' | 'insights' | 'projects'>('profile');
  const [saving, setSaving] = useState(false);

  // State Hồ sơ cá nhân
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [headline, setHeadline] = useState(initialProfile?.headline || '');
  const [quote, setQuote] = useState(initialProfile?.philosophy_quote || '');
  const [shortBio, setShortBio] = useState(initialProfile?.short_bio || '');
  const [longBio, setLongBio] = useState(initialProfile?.long_bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [rawAvatarFile, setRawAvatarFile] = useState<File | null>(null);

  // State Lĩnh vực
  const [domainCode, setDomainCode] = useState('');
  const [domainName, setDomainName] = useState('');
  const [domainDesc, setDomainDesc] = useState('');

  // State Khóa học
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSlug, setCourseSlug] = useState('');
  const [courseSummary, setCourseSummary] = useState('');
  const [courseLevel, setCourseLevel] = useState('Cơ bản - Thực hành');
  const [courseDomainId, setCourseDomainId] = useState(initialDomains[0]?.id || '');

  // State Thư viện
  const [libTitle, setLibTitle] = useState('');
  const [libType, setLibType] = useState('Giáo trình PDF');
  const [libDesc, setLibDesc] = useState('');
  const [libFile, setLibFile] = useState<File | null>(null);

  // State Bài viết Insights
  const [insightTitle, setInsightTitle] = useState('');
  const [insightSlug, setInsightSlug] = useState('');
  const [insightCategory, setInsightCategory] = useState('Kỹ thuật Cơ khí');
  const [insightExcerpt, setInsightExcerpt] = useState('');
  const [insightContent, setInsightContent] = useState('');

  // State Dự án & 3D
  const [projTitle, setProjTitle] = useState('');
  const [projSlug, setProjSlug] = useState('');
  const [projSummary, setProjSummary] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projMethod, setProjMethod] = useState('');
  const [projResults, setProjResults] = useState('');
  const [projLessons, setProjLessons] = useState('');
  const [projCoverFile, setProjCoverFile] = useState<File | null>(null);
  const [projModelFile, setProjModelFile] = useState<File | null>(null);

  const uploadMedia = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        finalAvatarUrl = await uploadMedia(avatarFile, 'avatars');
        setAvatarUrl(finalAvatarUrl);
      }

      const payload = {
        full_name: fullName,
        headline,
        philosophy_quote: quote,
        short_bio: shortBio,
        long_bio: longBio,
        avatar_url: finalAvatarUrl,
      };

      if (initialProfile?.id) {
        const { error } = await supabase.from('profiles').update(payload).eq('id', initialProfile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert(payload);
        if (error) throw error;
      }
      alert('Đã cập nhật Hồ sơ Cá nhân thành công!');
      setAvatarFile(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('domains').insert({
        code: domainCode,
        name: domainName,
        description: domainDesc,
      });
      if (error) throw error;
      alert('Đã thêm Lĩnh vực mới!');
      setDomainCode('');
      setDomainName('');
      setDomainDesc('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('courses').insert({
        title: courseTitle,
        slug: courseSlug,
        summary: courseSummary,
        level: courseLevel,
        domain_id: courseDomainId || null,
        is_published: true,
      });
      if (error) throw error;
      alert('Đã tạo Khóa học mới!');
      setCourseTitle('');
      setCourseSlug('');
      setCourseSummary('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let fileUrl = '';
      if (libFile) {
        fileUrl = await uploadMedia(libFile, 'library');
      }
      const { error } = await supabase.from('library_resources').insert({
        title: libTitle,
        resource_type: libType,
        description: libDesc,
        file_url: fileUrl,
        is_published: true,
      });
      if (error) throw error;
      alert('Đã tải lên Tài liệu Thư viện!');
      setLibTitle('');
      setLibDesc('');
      setLibFile(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('insights').insert({
        title: insightTitle,
        slug: insightSlug,
        category: insightCategory,
        excerpt: insightExcerpt,
        content_markdown: insightContent,
        is_published: true,
      });
      if (error) throw error;
      alert('Đã xuất bản Bài viết mới!');
      setInsightTitle('');
      setInsightSlug('');
      setInsightExcerpt('');
      setInsightContent('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let coverUrl = '';
      let modelUrl = '';
      if (projCoverFile) coverUrl = await uploadMedia(projCoverFile, 'projects');
      if (projModelFile) modelUrl = await uploadMedia(projModelFile, 'models');

      const { error } = await supabase.from('projects').insert({
        title: projTitle,
        slug: projSlug,
        summary: projSummary,
        problem_statement: projProblem,
        methodology: projMethod,
        results: projResults,
        lessons_learned: projLessons,
        cover_image_url: coverUrl || null,
        model_3d_url: modelUrl || null,
        is_published: true,
      });
      if (error) throw error;
      alert('Đã lưu Dự án thành công!');
      setProjTitle('');
      setProjSlug('');
      setProjSummary('');
      setProjProblem('');
      setProjMethod('');
      setProjResults('');
      setProjLessons('');
      setProjCoverFile(null);
      setProjModelFile(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Hồ sơ Cá nhân' },
    { id: 'domains', label: `Lĩnh vực (${initialDomains.length})` },
    { id: 'courses', label: `Khóa học (${initialCourses.length})` },
    { id: 'library', label: `Thư viện (${initialLibrary.length})` },
    { id: 'insights', label: `Bài viết (${initialInsights.length})` },
    { id: 'projects', label: `Dự án & 3D (${initialProjects.length})` },
  ] as const;

  return (
    <div className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-400/20 pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
              Content Management System
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">Bảng Điều Khiển Quản Trị</h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">{userEmail}</span>
            <Link
              href="/"
              className="rounded-lg border border-sky-400/30 px-3 py-1.5 text-sky-300 hover:bg-sky-500/10"
            >
              Xem Website ↗
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-rose-300 hover:bg-rose-500/30"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'border border-sky-400/20 bg-[#061A38]/70 text-slate-300 hover:border-sky-400/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-sky-400/20 bg-[#061A38]/70 p-6 md:p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h2 className="text-xl font-bold text-white">Cập nhật Hồ sơ Cá nhân</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono text-sky-400">Họ và tên hiển thị</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-sky-400">Chức danh chuyên môn</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-sky-400">Triết lý / Câu trích dẫn nổi bật</label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-sky-400">Giới thiệu ngắn trên Trang chủ</label>
                <textarea
                  rows={3}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-sky-400">Hồ sơ chi tiết (Trang Giới thiệu /about)</label>
                <textarea
                  rows={5}
                  value={longBio}
                  onChange={(e) => setLongBio(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-sky-400/20 bg-[#020813]/60 p-4">
                <label className="block text-xs font-mono text-sky-400">
                  Ảnh đại diện (Tự động mở công cụ cắt &amp; căn khung sau khi chọn ảnh)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) setRawAvatarFile(selected);
                    e.target.value = '';
                  }}
                  className="mt-2 block text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-400"
                />
                {avatarFile && (
                  <p className="mt-2 text-xs text-emerald-400">
                    ✓ Đã cắt ảnh xong ({avatarFile.name}). Bấm &ldquo;Lưu thay đổi Hồ sơ&rdquo; bên dưới để cập nhật lên web.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi Hồ sơ'}
              </button>
            </form>
          )}

          {activeTab === 'domains' && (
            <form onSubmit={handleAddDomain} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Thêm Lĩnh vực Chuyên môn</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Mã lĩnh vực (VD: 01)"
                  required
                  value={domainCode}
                  onChange={(e) => setDomainCode(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Tên lĩnh vực (VD: CAD/CAM & Gia công CNC)"
                  required
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Mô tả ngắn gọn..."
                value={domainDesc}
                onChange={(e) => setDomainDesc(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                {saving ? 'Đang lưu...' : 'Thêm Lĩnh vực'}
              </button>
            </form>
          )}

          {activeTab === 'courses' && (
            <form onSubmit={handleAddCourse} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Tạo Khóa học Chuyên sâu</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Tên khóa học (VD: Lập trình Mastercam 2D Thực chiến)"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Slug không dấu (VD: khoa-hoc-mastercam-2d)"
                  required
                  value={courseSlug}
                  onChange={(e) => setCourseSlug(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Trình độ (VD: Cơ bản - Nâng cao)"
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
                <select
                  value={courseDomainId}
                  onChange={(e) => setCourseDomainId(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                >
                  <option value="">-- Chọn lĩnh vực --</option>
                  {initialDomains.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                placeholder="Tóm tắt mục tiêu và nội dung khóa học..."
                value={courseSummary}
                onChange={(e) => setCourseSummary(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                {saving ? 'Đang lưu...' : 'Xuất bản Khóa học'}
              </button>
            </form>
          )}

          {activeTab === 'library' && (
            <form onSubmit={handleAddLibrary} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Tải lên Tài liệu Thư viện</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Tên tài liệu / Giáo trình"
                  required
                  value={libTitle}
                  onChange={(e) => setLibTitle(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Loại tài liệu (VD: Giáo trình PDF, Bảng tính Excel)"
                  value={libType}
                  onChange={(e) => setLibType(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Mô tả nội dung tài liệu..."
                value={libDesc}
                onChange={(e) => setLibDesc(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <input
                type="file"
                onChange={(e) => setLibFile(e.target.files?.[0] || null)}
                className="block text-sm text-slate-300"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                {saving ? 'Đang tải lên...' : 'Lưu vào Thư viện'}
              </button>
            </form>
          )}

          {activeTab === 'insights' && (
            <form onSubmit={handleAddInsight} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Viết bài Phân tích Kỹ thuật (Insights)</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Tiêu đề bài viết"
                  required
                  value={insightTitle}
                  onChange={(e) => setInsightTitle(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Slug không dấu"
                  required
                  value={insightSlug}
                  onChange={(e) => setInsightSlug(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Chuyên mục (VD: Gia công CNC, Vật liệu Composite)"
                value={insightCategory}
                onChange={(e) => setInsightCategory(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <textarea
                rows={2}
                placeholder="Đoạn mở đầu tóm tắt..."
                value={insightExcerpt}
                onChange={(e) => setInsightExcerpt(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <textarea
                rows={6}
                placeholder="Nội dung chi tiết bài viết..."
                value={insightContent}
                onChange={(e) => setInsightContent(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                {saving ? 'Đang đăng...' : 'Xuất bản Bài viết'}
              </button>
            </form>
          )}

          {activeTab === 'projects' && (
            <form onSubmit={handleAddProject} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Thêm Dự án &amp; Mô hình 3D</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Tên dự án / Đồ án"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Slug không dấu (VD: nghien-cuu-vat-lieu-composite)"
                  required
                  value={projSlug}
                  onChange={(e) => setProjSlug(e.target.value)}
                  className="rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Tóm tắt ngắn gọn dự án..."
                required
                value={projSummary}
                onChange={(e) => setProjSummary(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <textarea
                rows={3}
                placeholder="01. Bài toán & Bối cảnh kỹ thuật..."
                value={projProblem}
                onChange={(e) => setProjProblem(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <textarea
                rows={3}
                placeholder="02. Phương pháp luận & Quy trình triển khai (Taguchi, RSM, ANOVA, ANN...)"
                value={projMethod}
                onChange={(e) => setProjMethod(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <textarea
                rows={3}
                placeholder="03. Kết quả đạt được & Thực chứng số liệu..."
                value={projResults}
                onChange={(e) => setProjResults(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <textarea
                rows={2}
                placeholder="04. Đánh giá & Bài học rút ra..."
                value={projLessons}
                onChange={(e) => setProjLessons(e.target.value)}
                className="w-full rounded-lg border border-sky-400/25 bg-[#020813] px-4 py-2.5 text-white"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono text-sky-400">Ảnh bìa dự án / Biểu đồ</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProjCoverFile(e.target.files?.[0] || null)}
                    className="mt-1.5 block text-xs text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-sky-400">File mô hình 3D (.glb / .gltf / .step)</label>
                  <input
                    type="file"
                    onChange={(e) => setProjModelFile(e.target.files?.[0] || null)}
                    className="mt-1.5 block text-xs text-slate-300"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                {saving ? 'Đang lưu...' : 'Lưu Dự án'}
              </button>
            </form>
          )}
        </div>
      </div>

      <ImageCropModal
        file={rawAvatarFile}
        aspectRatio={0.88}
        onCancel={() => setRawAvatarFile(null)}
        onConfirm={(croppedFile) => {
          setAvatarFile(croppedFile);
          setRawAvatarFile(null);
        }}
      />
    </div>
  );
}