'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { compressAndConvertToWebp } from '@/lib/imageUtils';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploading(true);
    setError(null);
    setStatusText('جاري ضغط الصورة وتحويلها إلى WebP...');

    try {
      // 1. Compress and convert to WebP on the client side
      const webpFile = await compressAndConvertToWebp(rawFile, 1200, 1200, 0.82);

      setStatusText('جاري رفع صورة WebP المحسنة إلى السيرفر...');

      // 2. Prepare FormData with the converted WebP file
      const formData = new FormData();
      formData.append('file', webpFile);

      const token = typeof window !== 'undefined' ? sessionStorage.getItem('anbar_admin_token') : null;
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onImageUploaded(data.url);
        setStatusText(`تم تحويل الصورة وضغطها إلى WebP (${(webpFile.size / 1024).toFixed(1)} KB) بنجاح ✨`);
      } else {
        setError(data.error || 'فشل رفع الصورة إلى مستودع Supabase');
        setStatusText(null);
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err.message || 'حدث خطأ أثناء معالجة ورفع الصورة');
      setStatusText(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-anbar-dark/75">
          صورة الطبق (يتم ضغطها وتحويلها إلى WebP تلقائياً):
        </label>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>WebP Auto Compress</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Image Preview Box */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-anbar-bg border-2 border-dashed border-anbar-subtle shrink-0 flex items-center justify-center">
          {currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt="صورة الطبق"
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-anbar-slate/40" />
          )}
        </div>

        {/* Upload Button and Info */}
        <div className="flex-1 space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl bg-white border border-anbar-subtle text-anbar-dark font-bold text-xs hover:border-anbar-amber hover:text-anbar-amber transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-anbar-amber" />
                <span>{statusText || 'جاري المعالجة...'}</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-anbar-amber" />
                <span>اختر صورة لتحويلها ورفعها (WebP)</span>
              </>
            )}
          </button>

          {statusText && !isUploading && (
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{statusText}</span>
            </p>
          )}

          {error && (
            <p className="text-[11px] text-rose-600 font-bold">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
