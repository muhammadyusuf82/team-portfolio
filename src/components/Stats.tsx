import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1700;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 140, suffix: '+', label: 'Projects shipped', desc: 'From seed-stage MVPs to enterprise platforms.' },
  { value: 16, suffix: '', label: 'Design awards', desc: 'Awwwards, FWA and CSS Design Awards.' },
  { value: 9, suffix: '', label: 'Years of craft', desc: 'Senior-only team, zero juniors on your project.' },
  { value: 98, suffix: '%', label: 'Client retention', desc: 'Partners who come back for phase two and three.' },
];

export default function Stats() {
  return (
    <section className="relative bg-void">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            className={`group border-b border-white/10 px-8 py-12 transition-colors duration-500 hover:bg-panel md:px-10 ${i > 0 ? 'sm:border-l' : ''} ${i === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}
          >
            <p className="font-display text-6xl font-bold text-cream transition-colors duration-300 group-hover:text-ember md:text-7xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-ember">{s.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-smoke">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
