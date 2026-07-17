'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // Split wrapper layout/sizing classes from image visual/transition classes
  const classesList = className.split(' ');
  const layoutClasses = classesList.filter(c => 
    c.startsWith('w-') || 
    c.startsWith('h-') || 
    c.startsWith('absolute') || 
    c.startsWith('relative') || 
    c.startsWith('inset-') || 
    c.startsWith('top-') || 
    c.startsWith('left-') || 
    c.startsWith('right-') || 
    c.startsWith('bottom-') ||
    c.startsWith('bg-') ||
    c.startsWith('border') ||
    c.startsWith('shrink-') ||
    c.startsWith('grow') ||
    c.startsWith('flex-') ||
    c.startsWith('aspect-') ||
    c === 'mb-4' ||
    c.startsWith('m-') ||
    c.startsWith('mt-') ||
    c.startsWith('mb-') ||
    c.startsWith('ml-') ||
    c.startsWith('mr-')
  ).join(' ');

  const imageClasses = classesList.filter(c => 
    !c.startsWith('w-') && 
    !c.startsWith('h-') && 
    !c.startsWith('absolute') && 
    !c.startsWith('relative') && 
    !c.startsWith('inset-') && 
    !c.startsWith('top-') && 
    !c.startsWith('left-') && 
    !c.startsWith('right-') && 
    !c.startsWith('bottom-') &&
    !c.startsWith('bg-') &&
    !c.startsWith('border') &&
    !c.startsWith('shrink-') &&
    !c.startsWith('grow') &&
    !c.startsWith('flex-') &&
    !c.startsWith('aspect-') &&
    c !== 'mb-4' &&
    !c.startsWith('m-') &&
    !c.startsWith('mt-') &&
    !c.startsWith('mb-') &&
    !c.startsWith('ml-') &&
    !c.startsWith('mr-')
  ).join(' ');

  const isAbsolute = layoutClasses.includes('absolute') || layoutClasses.includes('fixed');
  const positionClass = isAbsolute ? '' : 'relative';

  return (
    <div className={`${positionClass} overflow-hidden ${layoutClasses}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        priority={priority}
        className={`object-cover ${imageClasses}`}
        onError={() => {
          if (imgSrc !== fallback) setImgSrc(fallback);
        }}
      />
    </div>
  );
}

