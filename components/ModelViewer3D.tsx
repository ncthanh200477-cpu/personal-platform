'use client';

import { useEffect } from 'react';

interface ModelViewer3DProps {
  modelUrl: string;
  altText: string;
}

export default function ModelViewer3D({ modelUrl, altText }: ModelViewer3DProps) {
  useEffect(() => {
    const scriptId = 'google-model-viewer-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  const isWeb3DFormat = /\.(glb|gltf)(\?.*)?$/i.test(modelUrl);

  if (!isWeb3DFormat) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0A192F] p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-amber-400">
          CAD / 3D Engineering File
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Tệp mô hình kỹ thuật gốc ({altText}) sẵn sàng tải về để mở trên phần mềm CAD chuyên dụng.
        </p>
        <a
          href={modelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#0A192F] transition hover:bg-amber-300"
        >
          Tải xuống tệp mô hình 3D ↗
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0A192F]">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs font-mono text-slate-400">
        <span className="text-amber-400">3D INTERACTIVE VIEWPORT</span>
        <span>Kéo chuột để xoay • Cuộn để phóng to</span>
      </div>
      <div className="h-[440px] w-full">
        {/* @ts-expect-error model-viewer web component */}
        <model-viewer
          src={modelUrl}
          alt={altText}
          auto-rotate
          camera-controls
          shadow-intensity="1"
          style={{ width: '100%', height: '100%', backgroundColor: '#0A192F' }}
        />
      </div>
    </div>
  );
}