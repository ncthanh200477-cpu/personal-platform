'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageCropModalProps {
  file: File | null;
  aspectRatio?: number; // 1 cho hình vuông/tròn, 0.85 cho khung đứng chân dung
  onCancel: () => void;
  onConfirm: (croppedFile: File) => void;
}

export default function ImageCropModal({
  file,
  aspectRatio = 0.88,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) {
      setImgSrc('');
      return;
    }
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file || !imgSrc) return null;

  const boxWidth = 320;
  const boxHeight = Math.round(boxWidth / aspectRatio);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handleExport = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const outputWidth = 900;
    const outputHeight = Math.round(outputWidth / aspectRatio);
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#020813';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    const scaleRatio = outputWidth / boxWidth;
    const baseScale = Math.max(boxWidth / img.naturalWidth, boxHeight / img.naturalHeight);
    const drawW = img.naturalWidth * baseScale * zoom * scaleRatio;
    const drawH = img.naturalHeight * baseScale * zoom * scaleRatio;

    const centerX = outputWidth / 2 + offset.x * scaleRatio - drawW / 2;
    const centerY = outputHeight / 2 + offset.y * scaleRatio - drawH / 2;

    ctx.drawImage(img, centerX, centerY, drawW, drawH);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const cropped = new File([blob], `portrait-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onConfirm(cropped);
      },
      'image/jpeg',
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-sky-400/30 bg-[#061A38] p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">Căn chỉnh &amp; Cắt ảnh chân dung</h3>
        <p className="mt-1 text-xs text-slate-300">
          Kéo chuột trực tiếp trên ảnh để di chuyển vị trí và dùng thanh trượt để phóng to/thu nhỏ.
        </p>

        <div className="mt-5 flex justify-center">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ width: boxWidth, height: boxHeight }}
            className="relative cursor-grab overflow-hidden rounded-xl border-2 border-sky-400 bg-[#020813] active:cursor-grabbing select-none"
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Preview"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="h-full w-full object-cover pointer-events-none"
            />
            {/* Lưới căn tỷ lệ 1/3 giúp đặt khuôn mặt cân đối */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/10">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Thu nhỏ</span>
            <span className="font-mono text-sky-400">{Math.round(zoom * 100)}%</span>
            <span>Phóng to</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="2.5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="mt-1.5 w-full accent-sky-400"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          >
            Áp dụng &amp; Cắt ảnh
          </button>
        </div>
      </div>
    </div>
  );
}
