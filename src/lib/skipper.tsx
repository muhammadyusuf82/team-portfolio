import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Asterisk, X } from 'lucide-react';

/* ---------------------------------------------------------- */
/*  SKIPPER UI — marquee / tabs / modal / accordion primitives  */
/* ---------------------------------------------------------- */

export function SkipperMarquee({
  items,
  duration = 28,
  className = '',
  outline = false,
}: {
  items: string[];
  duration?: number;
  className?: string;
  outline?: boolean;
}) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <div key={i} className="flex items-center">
          <span className={`whitespace-nowrap px-6 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl ${outline ? 'text-stroke' : 'text-cream'}`}>
            {item}
          </span>
          <Asterisk className="h-8 w-8 shrink-0 text-ember md:h-10 md:w-10" strokeWidth={2.5} />
        </div>
      ))}
    </div>
  );
  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div className="animate-marquee flex" style={{ animationDuration: `${duration}s` }}>
        {row('a')}
        {row('b')}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}

export function SkipperTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: T[];
  active: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
            active === t ? 'text-void' : 'text-smoke hover:text-cream'
          }`}
        >
          {active === t && (
            <motion.span
              layoutId="skipper-tab-pill"
              className="absolute inset-0 rounded-full bg-ember"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative z-10">{t}</span>
        </button>
      ))}
    </div>
  );
}

export function SkipperModal({
  open,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-panel shadow-2xl shadow-ember/10 ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-cream backdrop-blur transition hover:rotate-90 hover:border-ember hover:text-ember"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SkipperBadge({ children, tone = 'ember' }: { children: ReactNode; tone?: 'ember' | 'ghost' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
        tone === 'ember' ? 'bg-ember/15 text-ember-soft ring-1 ring-ember/40' : 'bg-white/5 text-smoke ring-1 ring-white/10'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'ember' ? 'bg-ember' : 'bg-smoke'}`} />
      {children}
    </span>
  );
}

export function SkipperAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
          >
            <span className={`font-display text-lg font-semibold transition-colors ${open === i ? 'text-ember' : 'text-cream'}`}>{it.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-xl leading-none text-cream">
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-6 pr-10 leading-relaxed text-smoke">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
