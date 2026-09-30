import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  VENGEANCE UI — magnetic / spotlight / tilt / split-text primitives  */
/*  Perf: pointer effects mutate the DOM directly + rAF-throttle, so    */
/*  they never trigger React re-renders at 60fps. Disabled entirely    */
/*  on touch devices and for prefers-reduced-motion.                   */
/* ------------------------------------------------------------------ */

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });

  if (!canHover()) return <div className={className}>{children}</div>;

  const apply = () => {
    raf.current = 0;
    const el = ref.current;
    if (el) el.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
  };
  const queue = () => {
    if (!raf.current) raf.current = requestAnimationFrame(apply);
  };

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.current = {
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
    };
    queue();
  };
  const onLeave = () => {
    target.current = { x: 0, y: 0 };
    queue();
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const pos = useRef({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || raf.current) {
      if (el) {
        const r = el.getBoundingClientRect();
        pos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }
      return;
    }
    const r = el.getBoundingClientRect();
    pos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      el.style.setProperty('--mx', `${pos.current.x}px`);
      el.style.setProperty('--my', `${pos.current.y}px`);
    });
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}

export function TiltCard({
  children,
  className = '',
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const angles = useRef({ rx: 0, ry: 0 });

  if (!canHover()) return <div className={className}>{children}</div>;

  const apply = () => {
    raf.current = 0;
    const el = ref.current;
    if (el) el.style.transform = `perspective(1100px) rotateX(${angles.current.rx.toFixed(2)}deg) rotateY(${angles.current.ry.toFixed(2)}deg) translateZ(0)`;
  };
  const queue = () => {
    if (!raf.current) raf.current = requestAnimationFrame(apply);
  };

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    angles.current = { rx: -py * max * 2, ry: px * max * 2 };
    queue();
  };
  const onLeave = () => {
    angles.current = { rx: 0, ry: 0 };
    queue();
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.25s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

export function SplitReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
  };
  const word = {
    hidden: { y: '110%', rotate: 4 },
    show: { y: '0%', rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };
  return (
    <motion.span className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} style={{ display: 'block' }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 -mb-1 align-bottom">
          <motion.span className="inline-block will-change-transform" variants={word}>
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function GlowLine({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-px overflow-hidden bg-white/10 ${className}`}>
      <div className="glow-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ember to-transparent" />
    </div>
  );
}
