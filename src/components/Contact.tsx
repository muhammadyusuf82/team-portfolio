import { useState } from 'react';
import { CheckCircle2, Dribbble, Github, Linkedin, Loader2, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import { sendMessage } from '../lib/api';
import { SkipperAccordion } from '../lib/skipper';
import { Magnetic, SplitReveal } from '../lib/vengeance';
import CassberryParticles from './CassberryParticles';

const BUDGETS = ['< $10k', '$10–25k', '$25–75k', '$75k+'];

const FAQS = [
  { q: 'How fast can we start?', a: 'We usually kick off within 2–3 weeks of signing. A discovery call this week means a proposal next week and a team in your Slack the week after.' },
  { q: 'Do you work fixed-scope or hourly?', a: 'Both. Fixed-scope sprints for well-defined builds, and embedded monthly squads when you need a senior team inside your org long-term.' },
  { q: 'Who actually works on my project?', a: 'Only seniors — the people on this page. No juniors learning on your budget, no hand-offs to subcontractors.' },
  { q: 'Can you take over an existing codebase?', a: 'Yes. We start with a paid technical audit, stabilize what matters, then ship improvements in weekly increments.' },
];

interface FormState { name: string; email: string; company: string; budget: string; message: string; }
const EMPTY: FormState = { name: '', email: '', company: '', budget: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (form.name.trim().length < 2) e.name = 'Please tell us your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (form.message.trim().length < 10) e.message = 'Tell us a bit more (min 10 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setServerError('');
    try {
      await sendMessage({ name: form.name.trim(), email: form.email.trim(), company: form.company.trim(), budget: form.budget, message: form.message.trim() });
      setStatus('success');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const inputCls = (bad?: string) =>
    `w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-[15px] text-cream placeholder:text-smoke/60 outline-none transition-all duration-300 focus:border-ember focus:bg-ember/[0.06] ${bad ? 'border-red-500/70' : 'border-white/10'}`;

  return (
    <section id="contact" className="relative overflow-hidden bg-void py-24 md:py-32">
      <CassberryParticles count={60} />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-ember/10 blur-[160px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <div data-reveal className="flex items-center gap-4">
              <span className="h-[2px] w-10 bg-ember" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-cream/80">Get in touch</span>
            </div>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-cream md:text-6xl">
              <SplitReveal text="Have an idea? Let's make it feel real." />
            </h2>
            <p data-reveal className="mt-5 max-w-md leading-relaxed text-smoke">
              Tell us where you want to go. We reply within one business day with honest thoughts and next steps — no sales theater.
            </p>
            <div data-reveal className="mt-8 space-y-4">
              <a href="mailto:hello@nexora.team" className="group flex items-center gap-4 text-cream">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-panel text-ember transition-all group-hover:border-ember group-hover:bg-ember group-hover:text-void"><Mail className="h-5 w-5" /></span>
                <span><span className="block text-xs uppercase tracking-[0.2em] text-smoke">Email</span><span className="font-display font-bold">hello@nexora.team</span></span>
              </a>
              <a href="tel:+13155550142" className="group flex items-center gap-4 text-cream">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-panel text-ember transition-all group-hover:border-ember group-hover:bg-ember group-hover:text-void"><Phone className="h-5 w-5" /></span>
                <span><span className="block text-xs uppercase tracking-[0.2em] text-smoke">Phone</span><span className="font-display font-bold">+1 (315) 555-0142</span></span>
              </a>
              <div className="flex items-center gap-4 text-cream">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-panel text-ember"><MapPin className="h-5 w-5" /></span>
                <span><span className="block text-xs uppercase tracking-[0.2em] text-smoke">Studio</span><span className="font-display font-bold">Remote-first · NYC / Berlin / Kyiv</span></span>
              </div>
            </div>
            <div data-reveal className="mt-8 flex gap-3">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Twitter, href: 'https://x.com', label: 'X' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Dribbble, href: 'https://dribbble.com', label: 'Dribbble' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-smoke transition-all hover:-translate-y-1 hover:border-ember hover:text-ember">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div data-reveal className="mt-10">
              <SkipperAccordion items={FAQS} />
            </div>
          </div>

          <div data-reveal>
            <div className="spotlight relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-7 md:p-9">
              {status === 'success' ? (
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ember/15 ring-1 ring-ember/50">
                    <CheckCircle2 className="h-10 w-10 text-ember" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl font-bold text-cream">Message received.</h3>
                  <p className="mt-3 max-w-sm text-smoke">Thanks for reaching out — a senior from our team will reply within one business day.</p>
                  <button
                    onClick={() => { setForm(EMPTY); setStatus('idle'); }}
                    className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-cream transition-colors hover:border-ember hover:text-ember"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h3 className="font-display text-2xl font-bold text-cream">Start your project</h3>
                  <p className="mt-1 text-sm text-smoke">Fields marked * are required.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name *" className={inputCls(errors.name)} />
                      {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email *" type="email" className={inputCls(errors.email)} />
                      {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company (optional)" className={inputCls()} />
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-smoke">Budget range</p>
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => set('budget', form.budget === b ? '' : b)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${form.budget === b ? 'bg-ember text-void' : 'border border-white/10 text-smoke hover:border-ember/60 hover:text-cream'}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <textarea value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us about your project *" rows={5} className={`${inputCls(errors.message)} resize-none`} />
                    {errors.message && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.message}</p>}
                  </div>
                  {status === 'error' && <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300">{serverError}</p>}
                  <Magnetic strength={0.12} className="mt-6">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group flex w-full items-center justify-center gap-3 bg-ember py-4 font-display text-base font-bold text-void transition-colors duration-300 hover:bg-cream disabled:opacity-70"
                    >
                      {status === 'sending' ? (<><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>) : (<>Send message <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></>)}
                    </button>
                  </Magnetic>
                  <p className="mt-4 text-center text-xs text-smoke/70">By sending, you agree to be contacted about your project. No spam, ever.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
