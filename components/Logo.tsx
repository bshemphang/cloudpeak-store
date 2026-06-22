import { SITE } from '../lib/site';

type LogoProps = {
  variant?: 'navbar' | 'footer' | 'plain';
  className?: string;
};

const imageStyles = {
  navbar: 'h-8 md:h-10',
  footer: 'h-8',
  plain: 'h-12',
};

const textStyles = {
  navbar: 'text-lg md:text-xl tracking-[0.15em]',
  footer: 'text-xl md:text-2xl tracking-[0.2em]',
  plain: 'text-2xl md:text-3xl tracking-[0.25em]',
};

export default function Logo({ variant = 'navbar', className = '' }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-bg.png"
        alt={`${SITE.name} Icon`}
        className={`${imageStyles[variant]} w-auto object-contain block`}
      />
      <span className={`font-display text-summitGold uppercase font-bold leading-none ${textStyles[variant]}`}>
        {SITE.name}
      </span>
    </div>
  );
}