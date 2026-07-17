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
  const [zoomOpen, setZoomOpen] = useState(false);
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

      <div
        onClick={() => setZoomOpen(true)}
        className="relative flex-1 aspect-[3/4] bg-cardGray overflow-hidden group cursor-zoom-in"
      >
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
          <>
            {/* Nav Arrows */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelected((prev) => (prev - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-midnightNavy/60 hover:bg-midnightNavy text-summitGold hover:text-summitGoldLight w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 select-none cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelected((prev) => (prev + 1) % gallery.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-midnightNavy/60 hover:bg-midnightNavy text-summitGold hover:text-summitGoldLight w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 select-none cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <span className="absolute bottom-4 right-4 bg-midnightNavy/80 text-storeWhite text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
              {selected + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl font-black cursor-pointer hover:text-summitGold transition-colors z-[110]"
            onClick={() => setZoomOpen(false)}
            aria-label="Close zoom view"
          >
            ✕
          </button>
          
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((prev) => (prev - 1 + gallery.length) % gallery.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-midnightNavy/80 hover:bg-midnightNavy text-summitGold hover:text-summitGoldLight w-12 h-12 rounded-full flex items-center justify-center transition-all z-[110] select-none cursor-pointer"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((prev) => (prev + 1) % gallery.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-midnightNavy/80 hover:bg-midnightNavy text-summitGold hover:text-summitGoldLight w-12 h-12 rounded-full flex items-center justify-center transition-all z-[110] select-none cursor-pointer"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div 
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[selected]}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl transition-all duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
