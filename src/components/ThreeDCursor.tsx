import React, { useEffect, useRef, useState } from 'react';

interface GhostTrail {
  x: number;
  y: number;
  id: number;
  scale: number;
  opacity: number;
}

export const ThreeDCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const [ghosts, setGhosts] = useState<GhostTrail[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const rotRef = useRef({ rx: 0, ry: 0, rz: 0 });
  const scaleRef = useRef(1);
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const trailCounterRef = useRef(0);

  useEffect(() => {
    // Check if touch device or prefers-reduced-motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setIsDisabled(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current.x = e.clientX;
      targetPosRef.current.y = e.clientY;

      // Check if hovering over clickable or card
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('button, a, input, select, textarea, .card, [role="button"], tr, label');
        isHoveredRef.current = !!isInteractive;
      }
    };

    const handleMouseDown = () => {
      isClickingRef.current = true;
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId: number;

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const animate = () => {
      // Smooth interpolation for position
      const prevX = posRef.current.x;
      const prevY = posRef.current.y;

      const targetX = targetPosRef.current.x;
      const targetY = targetPosRef.current.y;

      // Lerp with natural lag (inertia 0.18)
      posRef.current.x = lerp(prevX, targetX, 0.18);
      posRef.current.y = lerp(prevY, targetY, 0.18);

      // Compute velocity
      const vx = posRef.current.x - prevX;
      const vy = posRef.current.y - prevY;
      velocityRef.current.vx = vx;
      velocityRef.current.vy = vy;

      // Rotation based on movement direction and speed
      const targetRotY = Math.max(-35, Math.min(35, vx * 2.8));
      const targetRotX = Math.max(-35, Math.min(35, -vy * 2.8));
      const targetRotZ = Math.max(-20, Math.min(20, vx * 0.8));

      rotRef.current.ry = lerp(rotRef.current.ry, targetRotY, 0.12);
      rotRef.current.rx = lerp(rotRef.current.rx, targetRotX, 0.12);
      rotRef.current.rz = lerp(rotRef.current.rz, targetRotZ, 0.12);

      // Target scale: normal = 1.0, hover = 1.20, click = 0.85
      let targetScale = 1.0;
      if (isClickingRef.current) {
        targetScale = 0.85;
      } else if (isHoveredRef.current) {
        targetScale = 1.20;
      }

      scaleRef.current = lerp(scaleRef.current, targetScale, 0.2);

      // Apply transforms
      if (cursorRef.current && orbRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x - 11}px, ${posRef.current.y - 11}px, 0)`;
        orbRef.current.style.transform = `scale(${scaleRef.current}) rotateX(${rotRef.current.rx}deg) rotateY(${rotRef.current.ry}deg) rotateZ(${rotRef.current.rz}deg)`;
      }

      // Add subtle decaying trail periodically when moving fast
      const speed = Math.hypot(vx, vy);
      trailCounterRef.current++;
      if (speed > 1.5 && trailCounterRef.current % 4 === 0) {
        const newGhost: GhostTrail = {
          x: posRef.current.x,
          y: posRef.current.y,
          id: Date.now() + Math.random(),
          scale: scaleRef.current * 0.7,
          opacity: 0.35
        };
        setGhosts(prev => [...prev.slice(-3), newGhost]);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Periodic fade out for ghosts
    const ghostInterval = setInterval(() => {
      setGhosts(prev =>
        prev
          .map(g => ({ ...g, opacity: g.opacity - 0.08, scale: g.scale * 0.9 }))
          .filter(g => g.opacity > 0.05)
      );
    }, 45);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
      clearInterval(ghostInterval);
    };
  }, []);

  if (isDisabled) return null;

  return (
    <>
      {ghosts.map(ghost => (
        <div
          key={ghost.id}
          className="cursor-trail-ghost"
          style={{
            left: `${ghost.x}px`,
            top: `${ghost.y}px`,
            opacity: ghost.opacity,
            transform: `translate(-50%, -50%) scale(${ghost.scale})`
          }}
        />
      ))}
      <div ref={cursorRef} className="cursor-3d-wrapper" aria-hidden="true">
        <div ref={orbRef} className="cursor-3d-orb" />
      </div>
    </>
  );
};
