import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WORDS = ['STRATEGY', 'DESIGN', 'ENGINEERING', 'MOTION', 'NEXORA'];

export default function Preloader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1900;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="h-3 w-3 rounded-[3px] bg-ember"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 15 }}
            />
          ))}
        </div>
        <span className="font-display text-2xl font-bold tracking-tight text-cream">
          NEXORA<span className="text-ember">.</span>
        </span>
      </div>

      <div className="mt-8 h-6 overflow-hidden">
        <motion.p
          key={Math.min(WORDS.length - 1, Math.floor(count / 22))}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xs font-bold uppercase tracking-[0.4em] text-smoke"
        >
          {WORDS[Math.min(WORDS.length - 1, Math.floor(count / 22))]}
        </motion.p>
      </div>

      <div className="mt-4 w-64">
        <div className="flex items-end justify-between">
          <span className="font-display text-5xl font-bold tabular-nums text-cream">{count}</span>
          <span className="mb-1 text-sm font-bold text-ember">%</span>
        </div>
        <div className="mt-3 h-[2px] w-full overflow-hidden rounded bg-white/10">
          <div className="h-full bg-gradient-to-r from-ember to-ember-soft transition-[width] duration-100" style={{ width: `${count}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
