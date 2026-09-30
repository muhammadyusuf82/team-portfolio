import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, TriangleAlert } from 'lucide-react';
import { getProjects, type Project } from '../lib/api';
import { SkipperModal, SkipperTabs } from '../lib/skipper';
import { SplitReveal, TiltCard } from '../lib/vengeance';
import { scrollToSection } from './Navbar';

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-panel">
          <div className="aspect-[4/3] bg-white/5" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="h-7 w-2/3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="relative bg-[#0D0D0F] py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div data-reveal className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">Selected work</span>
          <span className="ml-auto hidden font-mono text-xs text-smoke md:block">{projects.length} case studies</span>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-cream md:text-7xl">
            <SplitReveal text="Work that moves markets." />
          </h2>
          {!loading && !error && (
            <div data-reveal>
              <SkipperTabs tabs={categories} active={filter} onChange={setFilter} />
            </div>
          )}
        </div>

        <div className="mt-12">
          {loading && <Skeleton />}
          {error && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-16 text-center">
              <TriangleAlert className="h-8 w-8 text-red-400" />
              <p className="text-cream">{error}</p>
              <button onClick={fetchProjects} className="rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-void hover:bg-cream">
                Try again
              </button>
            </div>
          )}
          {!loading && !error && (
            <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TiltCard max={6} className="h-full">
                      <button
                        onClick={() => setSelected(p)}
                        className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-panel text-left transition-colors duration-300 hover:border-ember/50"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={p.image_url}
                            alt={p.title}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/nexora-${p.id}/1200/750`; }}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute left-5 top-5 flex gap-2">
                            <span className="rounded-full bg-void/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur">{p.category}</span>
                            {p.featured && <span className="rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-void">Featured</span>}
                          </div>
                          <span className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-ember text-void opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <ArrowUpRight className="h-5 w-5" />
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 p-6">
                          <div>
                            <h3 className="font-display text-2xl font-bold text-cream transition-colors group-hover:text-ember">{p.title}</h3>
                            <p className="mt-1 text-sm text-smoke">{p.client} — {p.year}</p>
                          </div>
                          <span className="mt-1 shrink-0 font-mono text-xs text-smoke">{String(p.id).padStart(2, '0')}</span>
                        </div>
                      </button>
                    </TiltCard>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <SkipperModal open={!!selected} onClose={() => setSelected(null)} wide>
        {selected && (
          <div>
            <div className="relative aspect-[16/8] overflow-hidden rounded-t-2xl">
              <img src={selected.image_url} alt={selected.title} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/nexora-${selected.id}/1400/700`; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 flex gap-2 md:left-8">
                <span className="rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-void">{selected.category}</span>
                <span className="rounded-full bg-void/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur">{selected.year}</span>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-smoke">{selected.client}</p>
              <h3 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">{selected.title}</h3>
              <p className="mt-4 leading-relaxed text-smoke">{selected.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.tech.split(',').map((t) => (
                  <span key={t.trim()} className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-semibold text-ember-soft">{t.trim()}</span>
                ))}
              </div>
              {selected.stats_text && (
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 font-display text-sm font-semibold text-cream">
                  {selected.stats_text}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {selected.live_url && (
                  <a href={selected.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-bold text-void transition-colors hover:bg-cream">
                    Visit live project <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button onClick={() => { setSelected(null); setTimeout(() => scrollToSection('#contact'), 100); }} className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-cream transition-colors hover:border-ember hover:text-ember">
                  Start something similar
                </button>
              </div>
            </div>
          </div>
        )}
      </SkipperModal>
    </section>
  );
}
