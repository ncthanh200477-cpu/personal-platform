'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function AdminDashboard({
  userEmail,
  initialProfile,
  initialDomains,
  initialCourses,
  initialLibrary,
  initialInsights,
  initialProjects,
  initialMessages,
}: any) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'domains' | 'courses' | 'library' | 'insights' | 'projects' | 'messages'
  >('profile');
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 1. State Hồ sơ
  const [profile, setProfile] = useState({
    full_name: initialProfile?.full_name || '',
    professional_title: initialProfile?.professional_title || '',
    hero_badge: initialProfile?.hero_badge || 'PERSONAL KNOWLEDGE PLATFORM',
    philosophy_quote: initialProfile?.philosophy_quote || '',
    short_bio: initialProfile?.short_bio || '',
    full_biography: initialProfile?.full_biography || '',
    avatar_url: initialProfile?.avatar_url || '',
    contact_email: initialProfile?.contact_email || '',
  });

  // 2. State Lĩnh vực
  const [domainForm, setDomainForm] = useState({ code: '01', name: '', description: '' });

  // 3. State Khóa học
  const [courseForm, setCourseForm] = useState({
    title: '',
    domain_id: initialDomains[0]?.id || '',
    level: 'Beginner',
    summary: '',
    description: '',
    is_featured: true,
    is_published: true,
  });

  // 4. State Thư viện
  const [libForm, setLibForm] = useState({
    title: '',
    domain_id: initialDomains[0]?.id || '',
    resource_type: 'PDF',
    description: '',
    external_url: '',
    note_content: '',
  });
  const [libFile, setLibFile] = useState<File | null>(null);

  // 5. State Insights
  const [insightForm, setInsightForm] = useState({
    title: '',
    domain_id: initialDomains[0]?.id || '',
    category: 'Nghiên cứu',
    reading_time_minutes: 5,
    excerpt: '',
    content_markdown: '',
    is_published: true,
  });

  // 6. State Dự án
  const [projectForm, setProjectForm] = useState({
    title: '',
    domain_id: initialDomains[0]?.id || '',
    summary: '',
    problem_statement: '',
    methodology: '',
    results: '',
    lessons_learned: '',
    is_featured: true,
    is_published: true,
  });
  const [projectCover, setProjectCover] = useState<File | null>(null);
  const [project3D, setProject3D] = useState<File | null>(null);

  function showMsg(msg: string) {
    setNotice(msg);
    router.refresh();
    setTimeout(() => setNotice(null), 4000);
  }

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filePath, file);
    if (error) {
      alert('Lỗi tải file lên Storage: ' + error.message);
      return null;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  // --- CÁC HÀM LƯU DỮ LIỆU VÀO DATABASE ---

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from('site_profile').upsert({
      id: 1,
      ...profile,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) return alert(error.message);
    showMsg('Đã cập nhật hồ sơ thương hiệu cá nhân lên website.');
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const url = await uploadFile(file, 'avatars');
    setBusy(false);
    if (url) {
      setProfile((prev) => ({ ...prev, avatar_url: url }));
      showMsg('Đã tải ảnh đại diện lên kho lưu trữ. Nhấn Lưu Hồ sơ để áp dụng.');
    }
  }

  async function addDomain(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from('domains').insert({
      ...domainForm,
      slug: `${toSlug(domainForm.name)}-${Date.now().toString().slice(-4)}`,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setDomainForm({ code: '04', name: '', description: '' });
    showMsg('Đã thêm lĩnh vực chuyên môn mới.');
  }

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from('courses').insert({
      ...courseForm,
      domain_id: courseForm.domain_id || null,
      slug: `${toSlug(courseForm.title)}-${Date.now().toString().slice(-4)}`,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setCourseForm({
      title: '',
      domain_id: initialDomains[0]?.id || '',
      level: 'Beginner',
      summary: '',
      description: '',
      is_featured: true,
      is_published: true,
    });
    showMsg('Đã tạo khóa học mới trong cơ sở dữ liệu.');
  }

  async function addLibraryResource(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    let fileUrl = null;
    if (libFile) {
      fileUrl = await uploadFile(libFile, 'library');
    }
    const { error } = await supabase.from('library_resources').insert({
      ...libForm,
      domain_id: libForm.domain_id || null,
      file_url: fileUrl,
      is_published: true,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setLibForm({
      title: '',
      domain_id: initialDomains[0]?.id || '',
      resource_type: 'PDF',
      description: '',
      external_url: '',
      note_content: '',
    });
    setLibFile(null);
    showMsg('Đã lưu tài liệu vào Thư viện Tri thức.');
  }

  async function addInsight(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from('insights').insert({
      ...insightForm,
      domain_id: insightForm.domain_id || null,
      slug: `${toSlug(insightForm.title)}-${Date.now().toString().slice(-4)}`,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setInsightForm({
      title: '',
      domain_id: initialDomains[0]?.id || '',
      category: 'Nghiên cứu',
      reading_time_minutes: 5,
      excerpt: '',
      content_markdown: '',
      is_published: true,
    });
    showMsg('Đã xuất bản bài viết mới.');
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    let coverUrl = null;
    let modelUrl = null;
    if (projectCover) coverUrl = await uploadFile(projectCover, 'projects');
    if (project3D) modelUrl = await uploadFile(project3D, 'models-3d');

    const { error } = await supabase.from('projects').insert({
      ...projectForm,
      domain_id: projectForm.domain_id || null,
      cover_image_url: coverUrl,
      model_3d_url: modelUrl,
      slug: `${toSlug(projectForm.title)}-${Date.now().toString().slice(-4)}`,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setProjectForm({
      title: '',
      domain_id: initialDomains[0]?.id || '',
      summary: '',
      problem_statement: '',
      methodology: '',
      results: '',
      lessons_learned: '',
      is_featured: true,
      is_published: true,
    });
    setProjectCover(null);
    setProject3D(null);
    showMsg('Đã thêm dự án thực tế mới.');
  }

  async function deleteRecord(table: string, id: string) {
    if (!confirm('Bạn có chắc muốn xóa mục này khỏi cơ sở dữ liệu?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return alert(error.message);
    showMsg('Đã xóa bản ghi.');
  }

  const tabs = [
    { id: 'profile', label: 'Hồ sơ Cá nhân' },
    { id: 'domains', label: `Lĩnh vực (${initialDomains.length})` },
    { id: 'courses', label: `Khóa học (${initialCourses.length})` },
    { id: 'library', label: `Thư viện (${initialLibrary.length})` },
    { id: 'insights', label: `Bài viết (${initialInsights.length})` },
    { id: 'projects', label: `Dự án & 3D (${initialProjects.length})` },
    { id: 'messages', label: `Hộp thư (${initialMessages.length})` },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Thanh tiêu đề Admin */}
      <header className="bg-[#0A192F] text-white border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400">
              Content Management System
            </span>
            <h1 className="text-lg font-bold">Bảng Điều Khiển Quản Trị</h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden text-slate-400 sm:inline">{userEmail}</span>
            <Link
              href="/"
              target="_blank"
              className="rounded border border-slate-600 px-3 py-1.5 hover:border-white"
            >
              Xem Website &nearr;
            </Link>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600/80 px-3 py-1.5 font-medium hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {notice && (
          <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {notice}
          </div>
        )}

        {/* Thanh chuyển mục quản lý */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === t.id
                  ? 'bg-[#0A192F] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: HỒ SƠ THƯƠNG HIỆU CÁ NHÂN */}
        {activeTab === 'profile' && (
          <form onSubmit={saveProfile} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold">Cập nhật Thông tin Thương hiệu & Trang chủ</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Họ và Tên hiển thị</label>
                <input
                  required
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Chức danh chuyên môn</label>
                <input
                  required
                  value={profile.professional_title}
                  onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Nhãn định vị Hero</label>
                <input
                  value={profile.hero_badge}
                  onChange={(e) => setProfile({ ...profile, hero_badge: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Email liên hệ</label>
                <input
                  type="email"
                  required
                  value={profile.contact_email}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">Ảnh chân dung đại diện</label>
              <div className="mt-1 flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm" />
                {profile.avatar_url && (
                  <img src={profile.avatar_url} alt="Avatar" className="h-14 w-14 rounded object-cover border" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">Triết lý học tập & nghiên cứu</label>
              <textarea
                rows={2}
                required
                value={profile.philosophy_quote}
                onChange={(e) => setProfile({ ...profile, philosophy_quote: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">Giới thiệu ngắn trên Trang chủ</label>
              <textarea
                rows={3}
                required
                value={profile.short_bio}
                onChange={(e) => setProfile({ ...profile, short_bio: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">Hành trình & Tiểu sử chi tiết (Trang About)</label>
              <textarea
                rows={6}
                required
                value={profile.full_biography}
                onChange={(e) => setProfile({ ...profile, full_biography: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
            >
              {busy ? 'Đang lưu...' : 'Lưu thay đổi Hồ sơ'}
            </button>
          </form>
        )}

        {/* TAB 2: LĨNH VỰC CHUYÊN MÔN */}
        {activeTab === 'domains' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form onSubmit={addDomain} className="lg:col-span-5 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold">Thêm Lĩnh vực Mới</h2>
              <input
                placeholder="Mã số (VD: 01)"
                required
                value={domainForm.code}
                onChange={(e) => setDomainForm({ ...domainForm, code: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Tên lĩnh vực chuyên môn"
                required
                value={domainForm.name}
                onChange={(e) => setDomainForm({ ...domainForm, name: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Mô tả trọng tâm nghiên cứu..."
                required
                value={domainForm.description}
                onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <button type="submit" disabled={busy} className="w-full rounded bg-[#0A192F] py-2 text-sm font-semibold text-white">
                Thêm Lĩnh vực
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {initialDomains.map((d: any) => (
                <div key={d.id} className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div>
                    <span className="font-mono text-xs text-amber-700">{d.code}</span>
                    <h3 className="font-semibold">{d.name}</h3>
                    <p className="mt-1 text-xs text-slate-600">{d.description}</p>
                  </div>
                  <button onClick={() => deleteRecord('domains', d.id)} className="text-xs text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KHÓA HỌC */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form onSubmit={addCourse} className="lg:col-span-5 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold">Tạo Khóa học Mới</h2>
              <input
                placeholder="Tên khóa học"
                required
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={courseForm.domain_id}
                  onChange={(e) => setCourseForm({ ...courseForm, domain_id: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">-- Chọn lĩnh vực --</option>
                  {initialDomains.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <select
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <textarea
                rows={2}
                placeholder="Tóm tắt mục tiêu khóa học"
                required
                value={courseForm.summary}
                onChange={(e) => setCourseForm({ ...courseForm, summary: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={4}
                placeholder="Đề cương chi tiết & đối tượng học"
                required
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={courseForm.is_featured}
                  onChange={(e) => setCourseForm({ ...courseForm, is_featured: e.target.checked })}
                />
                Hiển thị nổi bật trên Trang chủ
              </label>
              <button type="submit" disabled={busy} className="w-full rounded bg-amber-600 py-2 text-sm font-semibold text-white">
                Xuất bản Khóa học
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {initialCourses.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">{c.level}</span>
                    <h3 className="mt-1 font-semibold">{c.title}</h3>
                    <p className="text-xs text-slate-500">{c.summary}</p>
                  </div>
                  <button onClick={() => deleteRecord('courses', c.id)} className="text-xs text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: THƯ VIỆN TRI THỨC */}
        {activeTab === 'library' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form onSubmit={addLibraryResource} className="lg:col-span-5 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold">Tải lên Tài liệu / Ghi chú Mới</h2>
              <input
                placeholder="Tiêu đề tài liệu"
                required
                value={libForm.title}
                onChange={(e) => setLibForm({ ...libForm, title: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={libForm.resource_type}
                onChange={(e) => setLibForm({ ...libForm, resource_type: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="PDF">Tài liệu PDF</option>
                <option value="WORD">Tài liệu Word (.docx)</option>
                <option value="EXCEL">Bảng tính Excel (.xlsx)</option>
                <option value="VIDEO">Video hướng dẫn</option>
                <option value="NOTE">Ghi chú chuyên ngành</option>
              </select>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Chọn file từ máy tính (PDF, DOCX, XLSX...)</label>
                <input type="file" onChange={(e) => setLibFile(e.target.files?.[0] || null)} className="text-xs" />
              </div>
              <input
                placeholder="Hoặc dán link Video / Tài liệu ngoài (nếu có)"
                value={libForm.external_url}
                onChange={(e) => setLibForm({ ...libForm, external_url: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Mô tả nội dung tài liệu"
                value={libForm.description}
                onChange={(e) => setLibForm({ ...libForm, description: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <button type="submit" disabled={busy} className="w-full rounded bg-[#0A192F] py-2 text-sm font-semibold text-white">
                Lưu vào Thư viện
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {initialLibrary.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div>
                    <span className="font-mono text-xs font-semibold text-amber-700">[{item.resource_type}]</span>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.file_url && (
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                        Mở tệp đã tải lên
                      </a>
                    )}
                  </div>
                  <button onClick={() => deleteRecord('library_resources', item.id)} className="text-xs text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INSIGHTS & BLOG */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form onSubmit={addInsight} className="lg:col-span-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold">Viết Bài Phân tích / Nghiên cứu</h2>
              <input
                placeholder="Tiêu đề bài viết"
                required
                value={insightForm.title}
                onChange={(e) => setInsightForm({ ...insightForm, title: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Chuyên mục (VD: Nghiên cứu)"
                  value={insightForm.category}
                  onChange={(e) => setInsightForm({ ...insightForm, category: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Số phút đọc"
                  value={insightForm.reading_time_minutes}
                  onChange={(e) => setInsightForm({ ...insightForm, reading_time_minutes: Number(e.target.value) })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Tóm tắt ngắn hiển thị ở danh sách"
                required
                value={insightForm.excerpt}
                onChange={(e) => setInsightForm({ ...insightForm, excerpt: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={8}
                placeholder="Nội dung bài viết chi tiết (hỗ trợ định dạng Markdown)..."
                required
                value={insightForm.content_markdown}
                onChange={(e) => setInsightForm({ ...insightForm, content_markdown: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm font-mono"
              />
              <button type="submit" disabled={busy} className="w-full rounded bg-amber-600 py-2 text-sm font-semibold text-white">
                Đăng bài viết
              </button>
            </form>

            <div className="lg:col-span-6 space-y-3">
              {initialInsights.map((post: any) => (
                <div key={post.id} className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div>
                    <span className="font-mono text-xs text-slate-500">{post.category} • {post.reading_time_minutes} phút</span>
                    <h3 className="font-semibold">{post.title}</h3>
                  </div>
                  <button onClick={() => deleteRecord('insights', post.id)} className="text-xs text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DỰ ÁN & MÔ HÌNH 3D */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form onSubmit={addProject} className="lg:col-span-6 space-y-3 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold">Thêm Dự án & Mô hình 3D</h2>
              <input
                placeholder="Tên dự án"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="Tóm tắt dự án"
                required
                value={projectForm.summary}
                onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="1. Bài toán & Vấn đề đặt ra"
                required
                value={projectForm.problem_statement}
                onChange={(e) => setProjectForm({ ...projectForm, problem_statement: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="2. Phương pháp tiếp cận & Kỹ thuật thực hiện"
                required
                value={projectForm.methodology}
                onChange={(e) => setProjectForm({ ...projectForm, methodology: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="3. Kết quả đo lường được"
                required
                value={projectForm.results}
                onChange={(e) => setProjectForm({ ...projectForm, results: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="4. Bài học kinh nghiệm rút ra"
                required
                value={projectForm.lessons_learned}
                onChange={(e) => setProjectForm({ ...projectForm, lessons_learned: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Ảnh bìa dự án</label>
                  <input type="file" accept="image/*" onChange={(e) => setProjectCover(e.target.files?.[0] || null)} />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">File mô hình 3D (.glb/.gltf)</label>
                  <input type="file" accept=".glb,.gltf" onChange={(e) => setProject3D(e.target.files?.[0] || null)} />
                </div>
              </div>
              <button type="submit" disabled={busy} className="w-full rounded bg-amber-600 py-2 text-sm font-semibold text-white">
                Lưu Dự án
              </button>
            </form>

            <div className="lg:col-span-6 space-y-3">
              {initialProjects.map((p: any) => (
                <div key={p.id} className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-xs text-slate-500">{p.summary}</p>
                    {p.model_3d_url && <span className="mt-1 inline-block font-mono text-[11px] text-emerald-700">✓ Có mô hình 3D</span>}
                  </div>
                  <button onClick={() => deleteRecord('projects', p.id)} className="text-xs text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: HỘP THƯ LIÊN HỆ */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {initialMessages.length === 0 ? (
              <p className="rounded-lg border bg-white p-6 text-sm text-slate-500">Chưa có tin nhắn liên hệ nào.</p>
            ) : (
              initialMessages.map((m: any) => (
                <div key={m.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span><strong>{m.sender_name}</strong> ({m.sender_email})</span>
                    <span>{new Date(m.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="mt-1 font-semibold text-sm">{m.subject}</p>
                  <p className="mt-1 text-sm text-slate-700">{m.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}