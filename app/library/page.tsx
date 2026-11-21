import { getLibraryData } from '@/lib/queries/public';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const { resources } = await getLibraryData();

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 border-b border-slate-800 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Curated Knowledge Repository
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Thư viện Tri thức &amp; Tài liệu</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Kho lưu trữ giáo trình, tiêu chuẩn kỹ thuật, bảng tính phân tích và ghi chú nghiên cứu chọn lọc.
          </p>
        </div>

        {resources.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#112240] p-10 text-center text-slate-400">
            Thư viện đang trống. Bạn có thể tải lên tệp PDF, DOCX, XLSX hoặc ghi chú tại trang /admin.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((res: any) => {
              const targetLink = res.file_url || res.external_url;
              return (
                <div
                  key={res.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#112240] p-6"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="rounded bg-amber-400/10 px-2.5 py-1 text-amber-400">
                        {res.resource_type}
                      </span>
                      <span className="text-slate-400">{res.domains?.name || 'Tài liệu chung'}</span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-white">{res.title}</h2>
                    <p className="mt-2 text-sm text-slate-300">{res.description}</p>
                    {res.note_content && (
                      <div className="mt-4 rounded-lg border border-slate-800 bg-[#0A192F] p-3 text-xs text-slate-400">
                        {res.note_content}
                      </div>
                    )}
                  </div>

                  {targetLink && (
                    <div className="mt-6 border-t border-slate-800 pt-4">
                      <a
                        href={targetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-semibold text-amber-400 hover:underline"
                      >
                        Mở / Tải xuống tài liệu ↗
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}