import { SITE } from '../lib/site';

type LogoProps = {
  variant?: 'navbar' | 'footer' | 'plain';
  className?: string;
};

const variantStyles = {
  navbar: 'h-12 md:h-16',
  footer: 'h-12',
  plain: 'h-16',
};

/**
 * Official logo has a baked-in white background (JPEG).
 * The "brand seal" wrapper makes that intentional on dark navy surfaces.
 * Long-term: export a PNG with transparent background from your designer.
 */
export default function Logo({ variant = 'navbar', className = '' }: LogoProps) {
const sealClass = '';

  return (
    <div className={`inline-flex items-center justify-center ${sealClass} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SITE.logo}
        alt={`${SITE.name} Logo`}
        className={`${variantStyles[variant]} w-auto object-contain block`}
      />
    </div>
  );
}
