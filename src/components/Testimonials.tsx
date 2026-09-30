import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, TriangleAlert } from 'lucide-react';
import { getTestimonials, type Testimonial } from '../lib/api';
import { SplitReveal } from '../lib/vengeance';

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await getTestimonials());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % items.length);
    }, 6500);
    return () => clearInterval(t);
  }, [items.length]);

  const go = (d: number) => {
    if (!items.length) return;
    setDir(d);
    setIdx((i) => (i + d + items.length) % items.length);
  };

  const current = items[idx];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0D0D0F] py-24 md:py-32">
      <Quote className="pointer-events-none absolute -left-8 top-10 h-64 w-64 text-white/[0.03]" />
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <div data-reveal className="flex items-center justify-center gap-4">
          <span className="h-[2px] w-10 bg-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">Client love</span>
          <span className="h-[2px] w-10 bg-ember" />
        </div>
        <h2 className="mt-6 text-center font-display text-4xl font-bold tracking-tight text-cream md:text-6xl">
          <SplitReveal text="Don't take our word for it." />
        </h2>

        <div className="mt-12 min-h-[320px]">
          {loading && (
            <div className="animate-pulse rounded-2xl border border-white/10 bg-panel p-10 text-center">
              <div className="mx-auto h-6 w-2/3 rounded bg-white/10" />
              <div className="mx-auto mt-4 h-6 w-1/2 rounded bg-white/10" />
              <div className="mx-auto mt-8 h-12 w-12 rounded-full bg-white/10" />
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-14 text-center">
              <TriangleAlert className="h-8 w-8 text-red-400" />
              <p className="text-cream">{error}</p>
              <button onClick={fetchItems} className="rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-void hover:bg-cream">Try again</button>
            </div>
          )}
          {!loading && !error && current && (
            <div className="relative">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure
                  key={current.id}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -80 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/10 bg-panel px-6 py-10 text-center md:px-14"
                >
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: current.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-ember text-ember" />
                    ))}
                  </div>
                  <blockquote className="mx-auto mt-6 max-w-3xl font-serif text-2xl italic leading-snug text-cream md:text-3xl">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center justify-center gap-4">
                    <img
                      src={current.avatar_url}
                      alt={current.name}
                      loading="lazy"
                      decoding="async"
                      width={48}
                      height={48}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://i.pravatar.cc/100?img=${(current.id % 60) + 10}`; }}
                      className="h-12 w-12 rounded-full border border-ember/40 object-cover"
                    />
                    <span className="text-left">
                      <span className="block font-display font-bold text-cream">{current.name}</span>
                      <span className="block text-sm text-smoke">{current.role} — {current.company}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream transition-all hover:border-ember hover:text-ember">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  {items.map((t, i) => (
                    <button
                      key={t.id}
                      aria-label={`Go to testimonial ${i + 1}`}
                      onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                      className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-ember' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
                <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream transition-all hover:border-ember hover:text-ember">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
