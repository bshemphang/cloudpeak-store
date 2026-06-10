'use client';

import { useState } from 'react';
import { IMAGE_FALLBACK } from '../lib/images';

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
};

export default function SafeImage({
  src,
  alt,
  className = '',
  fallback = IMAGE_FALLBACK,
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
    />
  );
}
