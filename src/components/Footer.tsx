import { ArrowUp } from 'lucide-react';
import { Logo, scrollToSection } from './Navbar';
import { GlowLine } from '../lib/vengeance';

const COLS = [
  { title: 'Sitemap', links: [{ l: 'Work', h: '#work' }, { l: 'About', h: '#about' }, { l: 'Expertise', h: '#expertise' }, { l: 'Team', h: '#team' }, { l: 'Contact', h: '#contact' }] },
  { title: 'Services', links: [{ l: 'Web Engineering', h: '#expertise' }, { l: 'Immersive 3D', h: '#expertise' }, { l: 'AI Solutions', h: '#expertise' }, { l: 'Cloud & DevOps', h: '#expertise' }] },
  { title: 'Elsewhere', links: [{ l: 'GitHub', h: '#top' }, { l: 'LinkedIn', h: '#top' }, { l: 'Dribbble', h: '#top' }, { l: 'X / Twitter', h: '#top' }] },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080809]">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-smoke">
              Independent digital engineering team. Strategy, design and technology in one place — we make the future feel real.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cream/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-green-400" />
              </span>
              Booking Q4 2026
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-smoke">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((x) => (
                    <li key={x.l}>
                      <button onClick={() => scrollToSection(x.h)} className="text-[15px] font-medium text-cream/75 transition-colors hover:text-ember">
                        {x.l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <GlowLine />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <p className="text-sm text-smoke">© 2026 NEXORA. All rights reserved.</p>
          <p className="font-mono text-xs text-smoke/60">Designed to make an impact — 001</p>
          <button
            onClick={() => scrollToSection('#top')}
            className="group flex items-center gap-2 text-sm font-bold text-cream/80 transition-colors hover:text-ember"
          >
            Back to top
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all group-hover:-translate-y-1 group-hover:border-ember">
              <ArrowUp className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden" aria-hidden>
        <p className="-mb-[4vw] bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-center font-display text-[19vw] font-bold leading-[0.85] tracking-tight text-transparent">
          NEXORA
        </p>
      </div>
    </footer>
  );
}
