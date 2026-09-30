import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Magnetic } from '../lib/vengeance';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Team', href: '#team' },
];

export function scrollToSection(href: string) {
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: string, o?: object) => void } }).lenis;
  if (lenis) lenis.scrollTo(href, { offset: -70, duration: 1.4 });
  else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <button onClick={() => scrollToSection('#top')} className="flex items-center gap-2.5" aria-label="NEXORA home">
      <span className="grid grid-cols-2 gap-[3px]">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-ember" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-ember/60" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-ember/60" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-ember" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight text-cream">
          NEXORA<span className="text-ember">.</span>
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToSection(href), 60);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${scrolled ? 'border-b border-white/10 bg-void/80 backdrop-blur-xl' : 'border-b border-white/5 bg-transparent'}`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Logo />
          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative text-[15px] font-semibold text-cream/80 transition-colors hover:text-cream"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-ember transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Magnetic strength={0.3} className="hidden sm:block">
              <button
                onClick={() => go('#contact')}
                className="group flex items-center gap-3 border border-white/25 px-6 py-3 text-[15px] font-semibold text-cream transition-all duration-300 hover:border-ember hover:bg-ember hover:text-void"
              >
                Let&apos;s talk
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </button>
            </Magnetic>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center border border-white/20 text-cream lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-void/95 backdrop-blur-2xl"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center border border-white/20 text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {[...LINKS, { label: "Let's talk", href: '#contact' }].map((l, i) => (
                <motion.button
                  key={l.href + l.label}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(l.href)}
                  className="group flex items-center gap-4 border-b border-white/10 py-4 text-left"
                >
                  <span className="font-mono text-xs text-ember">0{i + 1}</span>
                  <span className="font-display text-4xl font-bold text-cream transition-colors group-hover:text-ember">{l.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
