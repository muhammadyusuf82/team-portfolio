import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, TriangleAlert } from 'lucide-react';
import { getTeam, type TeamMember } from '../lib/api';
import { SplitReveal, TiltCard } from '../lib/vengeance';

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeam = async () => {
    setLoading(true);
    setError('');
    try {
      setMembers(await getTeam());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <section id="team" className="relative bg-void py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div data-reveal className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">The crew</span>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-cream md:text-7xl">
            <SplitReveal text="Small team. Absurd output." />
          </h2>
          <p data-reveal className="max-w-md leading-relaxed text-smoke">
            Six seniors, zero account managers. You talk directly to the people building your product.
          </p>
        </div>

        <div className="mt-12">
          {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-panel p-6">
                  <div className="mx-auto h-28 w-28 rounded-full bg-white/10" />
                  <div className="mx-auto mt-5 h-5 w-1/2 rounded bg-white/10" />
                  <div className="mx-auto mt-2 h-4 w-1/3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-16 text-center">
              <TriangleAlert className="h-8 w-8 text-red-400" />
              <p className="text-cream">{error}</p>
              <button onClick={fetchTeam} className="rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-void hover:bg-cream">Try again</button>
            </div>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard max={8} className="h-full">
                    <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-panel p-8 text-center transition-colors duration-500 hover:border-ember/50">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ember/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative">
                        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-ember to-transparent opacity-0 blur transition-opacity duration-500 group-hover:opacity-60" />
                        <img
                          src={m.avatar_url}
                          alt={m.name}
                          loading="lazy"
                          decoding="async"
                          width={112}
                          height={112}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://i.pravatar.cc/300?img=${(m.id % 60) + 5}`; }}
                          className="relative h-28 w-28 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-panel bg-green-400" />
                      </div>
                      <h3 className="mt-5 font-display text-xl font-bold text-cream">{m.name}</h3>
                      <p className="mt-1 text-sm font-bold text-ember">{m.role}</p>
                      <p className="mt-3 text-sm leading-relaxed text-smoke">{m.bio}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {m.skills.split(',').slice(0, 3).map((s) => (
                          <span key={s.trim()} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-cream/70 ring-1 ring-white/10">{s.trim()}</span>
                        ))}
                      </div>
                      <div className="mt-5 flex gap-3">
                        {m.github && (
                          <a href={m.github} target="_blank" rel="noreferrer" aria-label={`${m.name} GitHub`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-smoke transition-all hover:border-ember hover:text-ember">
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} LinkedIn`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-smoke transition-all hover:border-ember hover:text-ember">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
