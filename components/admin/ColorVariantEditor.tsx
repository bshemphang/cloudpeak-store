'use client';

import { useRef, useState } from 'react';
import type { ProductColor } from '../../types/product';

type ColorVariantEditorProps = {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
};

export default function ColorVariantEditor({ colors, onChange }: ColorVariantEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  const updateColor = (index: number, patch: Partial<ProductColor>) => {
    onChange(colors.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const addColor = () => {
    onChange([...colors, { name: '', hex: '#0A1628', images: [''] }]);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 1) return;
    onChange(colors.filter((_, i) => i !== index));
  };

  const triggerUpload = (index: number) => {
    setActiveColorIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeColorIndex === null || !e.target.files || e.target.files.length === 0) return;
    
    const index = activeColorIndex;
    const files = e.target.files;
    setUploadingIndex(index);
    setUploadError('');

    try {
      const uploadedUrls: string[] = [];
      const adminPwd = sessionStorage.getItem('cloudpeak-admin-pwd') ?? '';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'x-admin-password': adminPwd,
          },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error ?? 'Upload failed.');
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      const color = colors[index];
      const existingImages = color.images.filter(Boolean);
      updateColor(index, {
        images: [...existingImages, ...uploadedUrls]
      });
    } catch (err: any) {
      setUploadError(err.message ?? 'Upload failed');
    } finally {
      setUploadingIndex(null);
      setActiveColorIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (colorIndex: number, imgIndex: number) => {
    const color = colors[colorIndex];
    updateColor(colorIndex, {
      images: color.images.filter((_, idx) => idx !== imgIndex)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-midnightNavy">Color & Design Variants</h3>
          <p className="text-xs text-midnightNavy/50 mt-0.5">Add colorways and upload custom mockups</p>
        </div>
        <button
          type="button"
          onClick={addColor}
          className="text-xs font-bold uppercase tracking-widest text-summitGoldDark hover:text-midnightNavy border border-summitGold/40 px-3 py-1.5 rounded-md"
        >
          + Add Color
        </button>
      </div>

      {colors.map((color, ci) => (
        <div key={ci} className="bg-cardGray/60 border border-borderGray rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(ci, { hex: e.target.value })}
                className="w-10 h-10 rounded-lg border border-borderGray cursor-pointer shrink-0"
                title="Color swatch"
              />
              <input
                value={color.name}
                onChange={(e) => updateColor(ci, { name: e.target.value })}
                placeholder="Color name (e.g. Midnight Navy)"
                className="field-input flex-1"
                required
              />
            </div>
            {colors.length > 1 && (
              <button
                type="button"
                onClick={() => removeColor(ci)}
                className="text-xs text-red-500 font-bold uppercase hover:underline shrink-0 pt-2"
              >
                Remove
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="field-label">Variant Media (Upload from desktop or mobile)</label>
            
            <button
              type="button"
              onClick={() => triggerUpload(ci)}
              disabled={uploadingIndex !== null}
              className="w-full flex items-center justify-center gap-2 bg-midnightNavy text-summitGold py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-midnightNavyLight transition-all disabled:opacity-50 cursor-pointer"
            >
              {uploadingIndex === ci ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-summitGold border-t-transparent animate-spin" />
                  Uploading...
                </>
              ) : (
                <span>📤 Upload images from mobile / desktop</span>
              )}
            </button>
            
            {uploadError && activeColorIndex === ci && (
              <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded">{uploadError}</p>
            )}

            <textarea
              rows={2}
              value={color.images.filter(Boolean).join('\n')}
              onChange={(e) =>
                updateColor(ci, { images: e.target.value.split('\n') })
              }
              className="field-input resize-none font-mono text-[10px]"
              placeholder="Or paste image URLs (one per line)..."
            />
          </div>

          {color.images.filter(Boolean).length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {color.images.filter(Boolean).map((url, ii) => (
                <div key={`${url}-${ii}`} className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-14 h-16 object-cover rounded border border-borderGray"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(ci, ii)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold shadow-md hover:bg-red-700"
                    title="Remove variant image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}

