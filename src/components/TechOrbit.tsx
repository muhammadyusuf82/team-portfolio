import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Boxes, BrainCircuit, Cloud, Code2 } from 'lucide-react';
import { SplitReveal, SpotlightCard, TiltCard } from '../lib/vengeance';

const RINGS = [
  { radius: 118, duration: 22, items: ['React', 'TypeScript', 'Next.js'] },
  { radius: 178, duration: 34, items: ['Three.js', 'GSAP', 'Node.js', 'Tailwind'] },
  { radius: 238, duration: 48, items: ['Python', 'AWS', 'PostgreSQL', 'Docker', 'Figma'] },
];

const STACK = [
  {
    icon: Code2,
    title: 'Frontend & Creative',
    desc: 'Pixel-perfect interfaces with motion baked in from day one.',
    tech: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
  },
  {
    icon: Boxes,
    title: '3D, Shaders & Motion',
    desc: 'Signature WebGL scenes, configurators and cinematic transitions.',
    tech: ['Three.js', 'GSAP', 'GLSL', 'WebGPU'],
  },
  {
    icon: Cloud,
    title: 'Backend & Cloud',
    desc: 'Resilient APIs and infrastructure that scale without drama.',
    tech: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    icon: BrainCircuit,
    title: 'AI / ML Engineering',
    desc: 'Production-grade copilots, RAG pipelines and smart features.',
    tech: ['Python', 'LangChain', 'OpenAI', 'Pinecone'],
  },
];

export default function TechOrbit() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0D0D0F] py-24 md:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-ember/[0.07] blur-[140px]" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <div data-reveal className="flex items-center gap-4">
            <span className="h-[2px] w-10 bg-ember" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">Under the hood</span>
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream md:text-6xl">
            <SplitReveal text="A stack with no weak links." />
          </h2>
          <p data-reveal className="mt-5 max-w-md leading-relaxed text-smoke">
            Battle-tested tools, picked for speed and staying power. We master a focused set of technologies instead of chasing every new framework.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {STACK.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard max={6} className="h-full">
                  <SpotlightCard className="group h-full rounded-2xl border border-white/10 bg-panel p-6 transition-colors duration-500 hover:border-ember/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ember to-[#B43A08] text-void shadow-lg shadow-ember/25 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                      <s.icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug text-cream">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-smoke">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.tech.map((t) => (
                        <span key={t} className="rounded-full border border-ember/25 bg-ember/[0.08] px-2.5 py-1 text-[11px] font-bold text-ember-soft transition-colors duration-300 group-hover:border-ember/50">
                          {t}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div data-reveal className="relative mx-auto flex h-[360px] w-full max-w-[520px] items-center justify-center sm:h-[460px] md:h-[540px]">
          <div className="relative flex h-full w-full scale-[0.6] items-center justify-center min-[420px]:scale-[0.72] sm:scale-[0.85] md:scale-100">
            {[236, 356, 476].map((d) => (
              <div key={d} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ width: Math.min(d, 500), height: Math.min(d, 500) }} />
            ))}
            <div className="animate-orbit absolute left-1/2 top-1/2 h-[356px] w-[356px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ember/30" />

            {RINGS.map((ring) =>
              ring.items.map((t, i) => (
                <div key={t} className="absolute left-1/2 top-1/2 z-10" style={{ transform: 'translate(-50%, -50%)' }}>
                  <div
                    className="orbit-item whitespace-nowrap rounded-full border border-white/15 bg-void/90 px-3 py-1.5 text-[11px] font-bold text-cream shadow-lg shadow-black/40 backdrop-blur md:px-4 md:py-2 md:text-xs"
                    style={{ '--r': `${Math.min(ring.radius, 230)}px`, animationDuration: `${ring.duration}s`, animationDelay: `${-(ring.duration / ring.items.length) * i}s` } as CSSProperties}
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                    {t}
                  </div>
                </div>
              ))
            )}

            <div className="animate-float relative z-20 flex h-28 w-28 flex-col items-center justify-center rounded-3xl border border-ember/40 bg-gradient-to-br from-ember to-[#B43A08] shadow-2xl shadow-ember/40 md:h-32 md:w-32">
              <div className="grid grid-cols-2 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-3 w-3 rounded-[3px] bg-void" />
                ))}
              </div>
              <span className="mt-2 font-display text-[11px] font-bold tracking-[0.2em] text-void">CORE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
