'use client';

import { useState } from 'react';
import SafeImage from './SafeImage';

type ProductGalleryProps = {
  images: string[];
  alt: string;
  isNew?: boolean;
};

export default function ProductGallery({ images, alt, isNew }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const gallery = images.length > 0 ? images : ['/images/product-fallback.svg'];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      {gallery.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-1 md:pb-0 md:w-20 shrink-0">
          {gallery.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative w-16 h-20 md:w-full md:h-24 shrink-0 overflow-hidden border-2 transition-all ${
                selected === i
                  ? 'border-summitGold ring-1 ring-summitGold/30'
                  : 'border-borderGray hover:border-summitGold/50 opacity-80 hover:opacity-100'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <SafeImage src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-[3/4] bg-cardGray overflow-hidden group">
        <SafeImage
          src={gallery[selected]}
          alt={`${alt} — view ${selected + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          priority
        />
        {isNew && (
          <span className="absolute top-4 left-4 bg-summitGold text-midnightNavy text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
            NEW
          </span>
        )}
        {gallery.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-midnightNavy/80 text-storeWhite text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
            {selected + 1} / {gallery.length}
          </span>
        )}
      </div>
    </div>
  );
}
