'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Update dot position instantly without waiting for React re-render
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    
    const handleMouseEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

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
      const target = mouseRef.current;
      
      // Smooth interpolation for the ring
      ringRef.current.x += (target.x - ringRef.current.x) * 0.15;
      ringRef.current.y += (target.y - ringRef.current.y) * 0.15;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0)`;
      }

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

  return (
    <>
      {/* Ring */}
      <div
        ref={cursorRingRef}
        className="fixed pointer-events-none z-[9999] hidden md:block top-0 left-0 will-change-transform transition-opacity duration-200"
        style={{ 
          transform: `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0)`,
          opacity: visible ? 1 : 0
        }}
      >
        <div
          className={`absolute rounded-full border-2 border-summitGold/50 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovering ? 'w-14 h-14 border-summitGold' : 'w-8 h-8'
          }`}
        />
        <div className="absolute w-8 h-8 rounded-full border border-summitGold/30 -translate-x-1/2 -translate-y-1/2 animate-cursor-ring" />
      </div>

      {/* Dot */}
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[10000] hidden md:block top-0 left-0 will-change-transform transition-opacity duration-200"
        style={{ 
          transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`,
          opacity: visible ? 1 : 0
        }}
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
