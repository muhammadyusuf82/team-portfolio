import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk } from 'lucide-react';
import Hero3D from './Hero3D';
import CassberryParticles from './CassberryParticles';
import { Magnetic } from '../lib/vengeance';
import { scrollToSection } from './Navbar';

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.15, defaults: { ease: 'power4.out' } });
      tl.fromTo('.hero-eyebrow', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
        .fromTo('.hero-line-inner', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, '-=0.5')
        .fromTo('.hero-sub', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
        .fromTo('.hero-cta', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.55')
        .fromTo('.hero-meta', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.4')
        .fromTo('.hero-3d-wrap', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, 2.0);

      gsap.to('.hero-content', {
        yPercent: -8,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-void">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-ember/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[500px] rounded-full bg-ember/5 blur-[120px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <CassberryParticles count={120} />

      <div className="hero-3d-wrap pointer-events-none absolute inset-0 opacity-0 lg:left-[38%]">
        <div className="absolute inset-0 opacity-40 lg:opacity-100">
          <Hero3D />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="hero-meta absolute right-5 top-1/2 hidden -translate-y-1/2 xl:block">
        <p className="rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.35em] text-smoke/70">
          Designed to make an impact — 001
        </p>
      </div>

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-28 pt-36 md:px-10 lg:pb-24 lg:pt-40">
        <div className="max-w-3xl">
          <div className="hero-eyebrow flex items-center gap-4">
            <span className="h-[2px] w-10 bg-ember" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/90 md:text-sm">Independent digital engineering team</span>
            <Asterisk className="h-5 w-5 animate-spin-slow text-ember" />
          </div>

          <h1 className="mt-7 font-display font-bold leading-[0.95] tracking-tight">
            <span className="block overflow-hidden">
              <span className="hero-line-inner block text-[13.5vw] text-cream sm:text-7xl lg:text-8xl xl:text-[7.5rem]">We make</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block font-serif text-[14.5vw] font-normal italic text-cream sm:text-7xl lg:text-8xl xl:text-[7.5rem]">the future</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block text-[13.5vw] text-cream sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
                feel real<span className="text-ember">.</span>
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-7 max-w-md text-base leading-relaxed text-smoke md:text-lg">
            Strategy, design, and technology in one place. We create digital experiences that move people and businesses forward.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-7">
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('#work')}
                className="hero-cta group flex items-center gap-5 bg-ember py-2 pl-7 pr-2 font-display text-[15px] font-bold text-void transition-all duration-300 hover:bg-cream"
              >
                Explore our work
                <span className="flex h-11 w-11 items-center justify-center bg-void text-cream transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </button>
            </Magnetic>
            <button onClick={() => scrollToSection('#about')} className="hero-cta group flex items-center gap-3 border-b border-white/30 pb-2 font-display text-[15px] font-bold text-cream transition-colors hover:border-ember hover:text-ember">
              Get to know us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="hero-meta relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.25em] text-cream/70 md:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            Available for new projects
            <span className="text-white/20">/</span>
            <span>2026</span>
          </div>
          <button onClick={() => scrollToSection('#showreel')} className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.25em] text-cream/70 transition-colors hover:text-cream md:text-xs">
            Scroll to explore
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-ember group-hover:text-ember">
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
