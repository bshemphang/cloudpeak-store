'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    let animationId: number;
    const animateRing = () => {
      setRingPosition((prev) => {
        const target = positionRef.current;
        return {
          x: prev.x + (target.x - prev.x) * 0.15,
          y: prev.y + (target.y - prev.y) * 0.15,
        };
      });
      animationId = requestAnimationFrame(animateRing);
    };
    animationId = requestAnimationFrame(animateRing);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{ left: ringPosition.x, top: ringPosition.y }}
      >
        <div
          className={`absolute rounded-full border-2 border-summitGold/50 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovering ? 'w-14 h-14 border-summitGold' : 'w-8 h-8'
          }`}
        />
        <div className="absolute w-8 h-8 rounded-full border border-summitGold/30 -translate-x-1/2 -translate-y-1/2 animate-cursor-ring" />
      </div>

      <div
        className="fixed pointer-events-none z-[10000] hidden md:block"
        style={{ left: position.x, top: position.y }}
      >
        <div
          className={`absolute rounded-full bg-summitGold -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isHovering ? 'w-3 h-3' : 'w-2 h-2'
          }`}
        />
      </div>
    </>
  );
}
