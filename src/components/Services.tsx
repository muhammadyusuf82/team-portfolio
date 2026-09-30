import { ArrowUpRight, Boxes, BrainCircuit, Cloud, Code2, PenTool, Smartphone } from 'lucide-react';
import { SpotlightCard, TiltCard, SplitReveal, GlowLine } from '../lib/vengeance';
import { SkipperBadge } from '../lib/skipper';
import { scrollToSection } from './Navbar';

const SERVICES = [
  {
    icon: Code2,
    title: 'Web Engineering',
    desc: 'Blazing-fast React, Next.js and TypeScript builds with obsessive attention to performance budgets and Core Web Vitals.',
    tags: ['React', 'Next.js', 'TypeScript'],
  },
  {
    icon: Boxes,
    title: 'Immersive 3D & WebGL',
    desc: 'Signature Three.js scenes, shaders and configurators that turn casual visitors into believers.',
    tags: ['Three.js', 'GLSL', 'WebGPU'],
  },
  {
    icon: BrainCircuit,
    title: 'AI Solutions',
    desc: 'LLM copilots, RAG pipelines and computer-vision features wired directly into your product.',
    tags: ['Python', 'LangChain', 'OpenAI'],
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    desc: 'AWS infrastructure as code, Kubernetes at scale and CI/CD pipelines that deploy in minutes.',
    tags: ['AWS', 'Terraform', 'K8s'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    desc: 'One codebase, two stores. React Native apps with native feel, offline-first and push-perfect.',
    tags: ['React Native', 'Expo', 'RevenueCat'],
  },
  {
    icon: PenTool,
    title: 'Product Design',
    desc: 'Research, systems and interfaces with motion baked in from the first Figma frame.',
    tags: ['Figma', 'Design Systems', 'Motion'],
  },
];

export default function Services() {
  return (
    <section id="expertise" className="relative bg-void py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-ember/5 blur-[140px]" />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div data-reveal className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">What we do</span>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-cream md:text-7xl">
            <SplitReveal text="Expertise that ships." />
          </h2>
          <p data-reveal className="max-w-md leading-relaxed text-smoke">
            Six disciplines, one senior team. No hand-offs into the void — the people who design your product build it too.
          </p>
        </div>
        <div data-reveal className="mt-8">
          <GlowLine />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <TiltCard key={s.title} max={7} className="h-full">
              <SpotlightCard className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel p-8 transition-colors duration-500 hover:border-ember/50">
                <span className="pointer-events-none absolute -right-6 -top-8 font-display text-[7rem] font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-ember/10">
                  0{i + 1}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ember text-void transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                  <s.icon className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-cream">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-smoke">{s.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cream/70">
                      {t}
                    </span>
                  ))}
                </div>
                <button onClick={() => scrollToSection('#contact')} className="mt-7 flex items-center gap-2 text-sm font-bold text-cream/80 transition-colors group-hover:text-ember">
                  Start a project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </SpotlightCard>
            </TiltCard>
          ))}
        </div>

        <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
          <SkipperBadge>Senior-only talent</SkipperBadge>
          <SkipperBadge tone="ghost">Fixed-scope or embedded</SkipperBadge>
          <SkipperBadge tone="ghost">NDA-friendly</SkipperBadge>
        </div>
      </div>
    </section>
  );
}
