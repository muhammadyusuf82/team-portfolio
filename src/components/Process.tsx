import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Compass, Layers, Rocket, Search } from 'lucide-react';
import { SplitReveal } from '../lib/vengeance';

const STEPS = [
  { icon: Search, n: '01', title: 'Discover', desc: 'Workshops, audits and research. We find the sharp edge of your idea before a single pixel is pushed.' },
  { icon: Compass, n: '02', title: 'Design', desc: 'Systems, prototypes and motion studies. You see and feel the product before it exists.' },
  { icon: Layers, n: '03', title: 'Build', desc: 'Senior engineers ship in weekly increments — tested, reviewed and demoed every Friday.' },
  { icon: Rocket, n: '04', title: 'Launch & scale', desc: 'Hardened infra, analytics and experiments. We stay aboard until the metrics move.' },
];

const VALUES = ['Senior-only', 'Remote-first', 'Design-obsessed', 'Performance-obsessed', 'AI-native', 'No hand-offs'];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-bar-fill', { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.process-track', start: 'top 75%', end: 'bottom 45%', scrub: 1 },
      });
      gsap.utils.toArray<HTMLElement>('.process-card').forEach((el, i) => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: (i % 4) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-void py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div data-reveal className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">Who we are</span>
        </div>
        <h2 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream md:text-6xl">
          <SplitReveal text="An independent team with senior-only talent." />
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <p data-reveal className="max-w-xl leading-relaxed text-smoke">
            NEXORA is a compact crew of engineers, designers and 3D artists who left big agencies to do the best work of their
            lives. We take on a small number of projects per year and treat each one like it carries our name — because it does.
          </p>
          <div data-reveal className="flex flex-wrap content-start gap-2">
            {VALUES.map((v) => (
              <span key={v} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-cream/80 transition-colors hover:border-ember/60 hover:text-ember">
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="process-track mt-16">
          <div className="relative mb-10 h-[2px] bg-white/10">
            <div className="process-bar-fill absolute inset-0 origin-left bg-gradient-to-r from-ember via-ember-soft to-ember" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="process-card group relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-7 transition-colors duration-500 hover:border-ember/50">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ember transition-all duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-void">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl font-bold text-white/[0.07] transition-colors duration-500 group-hover:text-ember/20">{s.n}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-cream">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
