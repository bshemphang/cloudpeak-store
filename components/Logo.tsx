import { SITE } from '../lib/site';

type LogoProps = {
  variant?: 'navbar' | 'footer' | 'plain';
  className?: string;
};

const variantStyles = {
  navbar: 'h-9 md:h-11',
  footer: 'h-11',
  plain: 'h-14',
};

/**
 * Official logo has a baked-in white background (JPEG).
 * The "brand seal" wrapper makes that intentional on dark navy surfaces.
 * Long-term: export a PNG with transparent background from your designer.
 */
export default function Logo({ variant = 'navbar', className = '' }: LogoProps) {
  const sealClass =
    variant === 'navbar'
      ? 'bg-cardGray rounded-lg px-2 py-1 shadow-md ring-1 ring-summitGold/30'
      : variant === 'footer'
        ? 'bg-cardGray rounded-lg px-2.5 py-1.5 ring-1 ring-summitGold/20'
        : 'bg-cardGray rounded-xl px-3 py-2 ring-1 ring-summitGold/30 shadow-lg';

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
