'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onImageUploaded(data.url);
      } else {
        setError(data.error || 'فشل رفع الصورة إلى مستودع Supabase');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-anbar-dark/75">
        صورة الطبق (تُرفع مباشرة إلى Supabase Storage Bucket):
      </label>

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
            className="px-4 py-2.5 rounded-xl bg-white border border-anbar-subtle text-anbar-dark font-bold text-xs hover:border-anbar-amber hover:text-anbar-amber transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-anbar-amber" />
                <span>جاري الرفع إلى باكت Supabase...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-anbar-amber" />
                <span>اختر صورة لرفعها للباكت</span>
              </>
            )}
          </button>

          {currentImageUrl && (
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>تم ربط الصورة بنجاح</span>
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
