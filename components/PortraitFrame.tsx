'use client';

interface PortraitFrameProps {
  imageUrl?: string | null;
  altText?: string;
  frameStyle?: 'tech-hud' | 'orbital-glow' | 'editorial-card';
}

export default function PortraitFrame({
  imageUrl,
  altText = 'Nguyễn Công Thành',
  frameStyle = 'tech-hud',
}: PortraitFrameProps) {
  if (!imageUrl) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-sky-400/20 bg-[#061A38]/70 p-8 text-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-sky-400">PORTRAIT PLACEHOLDER</p>
          <p className="mt-2 text-sm text-slate-400">
            Tải ảnh chân dung lên trong mục <strong className="text-white">/admin</strong>
          </p>
        </div>
      </div>
    );
  }

  // KIỂU 2: Khung Tròn Quỹ Đạo Kỹ Thuật (Orbital Glow)
  if (frameStyle === 'orbital-glow') {
    return (
      <div className="group relative mx-auto flex h-[380px] w-[380px] max-w-full items-center justify-center">
        {/* Vòng hào quang tỏa sáng */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-sky-500/30 via-cyan-400/10 to-blue-600/30 blur-2xl transition duration-500 group-hover:scale-105" />
        {/* Vòng quỹ đạo nét đứt xoay chậm */}
        <div className="absolute inset-0 animate-[spin_28s_linear_infinite] rounded-full border border-dashed border-sky-400/35" />
        {/* Vòng viền kép bên trong */}
        <div className="relative h-[336px] w-[336px] overflow-hidden rounded-full border-2 border-sky-400/60 bg-[#041326] p-1.5 shadow-[0_0_40px_rgba(14,165,233,0.28)]">
          <img
            src={imageUrl}
            alt={altText}
            className="h-full w-full rounded-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  // KIỂU 3: Khung Thẻ Kính Nổi 3D (Editorial Glass Card)
  if (frameStyle === 'editorial-card') {
    return (
      <div className="group relative mx-auto w-full max-w-[400px]">
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-sky-400/30 via-transparent to-blue-600/30 opacity-75 blur-xl transition duration-500 group-hover:opacity-100" />
        <div className="relative overflow-hidden rounded-2xl border border-sky-300/25 bg-[#061A38]/80 p-2.5 shadow-2xl backdrop-blur-md">
          <div className="relative h-[410px] w-full overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt={altText}
              className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020813] via-[#020813]/70 to-transparent p-5">
              <p className="font-mono text-[11px] tracking-widest text-sky-400">
                LEARN • ENGINEER • INNOVATE
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">{altText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KIỂU 1 (Mặc định): Khung Vát Góc Cơ Khí & Tọa Độ CAD (Tech HUD Frame)
  return (
    <div className="group relative mx-auto w-full max-w-[420px]">
      {/* Quầng sáng xanh cyan phía sau khung */}
      <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-sky-500/25 via-cyan-400/10 to-blue-600/25 blur-2xl transition duration-500 group-hover:opacity-100" />

      {/* 4 dấu định vị góc kiểu bản vẽ kỹ thuật CAD */}
      <span className="pointer-events-none absolute -left-2 -top-2 z-20 h-5 w-5 border-l-2 border-t-2 border-sky-400" />
      <span className="pointer-events-none absolute -right-2 -top-2 z-20 h-5 w-5 border-r-2 border-t-2 border-sky-400" />
      <span className="pointer-events-none absolute -bottom-2 -left-2 z-20 h-5 w-5 border-b-2 border-l-2 border-sky-400" />
      <span className="pointer-events-none absolute -bottom-2 -right-2 z-20 h-5 w-5 border-b-2 border-r-2 border-sky-400" />

      {/* Khung chính vát chéo 2 góc đối diện */}
      <div
        className="relative overflow-hidden border border-sky-400/35 bg-[#041326] p-1.5 shadow-[0_0_45px_rgba(2,132,199,0.22)]"
        style={{
          clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)',
        }}
      >
        <div
          className="relative h-[420px] w-full overflow-hidden bg-[#020813]"
          style={{
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
          }}
        >
          <img
            src={imageUrl}
            alt={altText}
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
          {/* Lớp phủ mờ chân ảnh hòa vào nền web */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020813] via-[#020813]/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] tracking-widest text-sky-300/90">
            <span>NCT // CAD-CAM-R&amp;D</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}