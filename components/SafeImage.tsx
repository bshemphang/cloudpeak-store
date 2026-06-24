'use client';

import { useState } from 'react';
import Image from 'next/image';
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
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        priority={priority}
        className="object-cover"
        onError={() => {
          if (imgSrc !== fallback) setImgSrc(fallback);
        }}
      />
    </div>
  );
}

