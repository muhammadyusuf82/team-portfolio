import { useEffect, useRef } from 'react';

/* ---------------------------------------------------------------------- */
/*  PARTICLES CASSBERRY — ember / spark canvas particle field               */
/*  Perf: pre-rendered glow sprites (no per-frame shadowBlur), DPR cap,     */
/*  adaptive counts, 30fps mode on weak devices, offscreen auto-pause.      */
/* ---------------------------------------------------------------------- */

interface P {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  speed: number;
  sprite: number;
  alpha: number;
}

function makeSprite(hue: number): HTMLCanvasElement {
  const s = 48;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d');
  if (!g) return c;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `hsla(${hue}, 100%, 72%, 1)`);
  grad.addColorStop(0.25, `hsla(${hue}, 98%, 58%, 0.85)`);
  grad.addColorStop(0.6, `hsla(${hue}, 95%, 50%, 0.25)`);
  grad.addColorStop(1, `hsla(${hue}, 95%, 50%, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

export default function CassberryParticles({
  count = 110,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const weakCPU = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowPower = coarse || weakCPU;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let lastFrame = 0;
    // 30fps render cap on weak devices, full 60fps otherwise
    const frameBudget = lowPower ? 33 : 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const sprites = [14, 24, 34, 44].map(makeSprite);
    const parts: P[] = [];
    let activeCount = count;
    const mouse = { x: -9999, y: -9999 };
    let mouseQueued = false;
    let queuedX = 0;
    let queuedY = 0;

    const seed = (p: P, initial = false) => {
      p.x = Math.random() * w;
      p.y = initial ? Math.random() * h : h + 10;
      p.r = 0.6 + Math.random() * 2.1;
      p.vy = 0.15 + Math.random() * 0.65;
      p.vx = (Math.random() - 0.5) * 0.3;
      p.phase = Math.random() * Math.PI * 2;
      p.speed = 0.008 + Math.random() * 0.03;
      p.sprite = (Math.random() * sprites.length) | 0;
      p.alpha = 0.35 + Math.random() * 0.65;
      return p;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // scale particle budget with visible area + device class
      const areaFactor = Math.min(1, (w * h) / (1400 * 800));
      activeCount = Math.max(24, Math.round(count * (0.35 + 0.65 * areaFactor) * (lowPower ? 0.55 : 1)));
      while (parts.length < activeCount) parts.push(seed({} as P, true));
    };

    let resizeQueued = false;
    const onResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => {
        resizeQueued = false;
        resize();
      });
    };

    // mousemove is throttled through rAF + cached rect (rect refreshed on scroll/resize)
    let rect = { left: 0, top: 0 };
    const cacheRect = () => {
      const r = canvas.getBoundingClientRect();
      rect = { left: r.left, top: r.top };
    };
    const onMove = (e: MouseEvent) => {
      queuedX = e.clientX;
      queuedY = e.clientY;
      if (mouseQueued) return;
      mouseQueued = true;
      requestAnimationFrame(() => {
        mouseQueued = false;
        mouse.x = queuedX - rect.left;
        mouse.y = queuedY - rect.top;
      });
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (frameBudget && now - lastFrame < frameBudget) return;
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);
      const n = Math.min(activeCount, parts.length);
      for (let i = 0; i < n; i++) {
        const p = parts[i];
        p.phase += p.speed;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.phase) * 0.25;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (dx > -110 && dx < 110 && dy > -110 && dy < 110) {
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 0.1) {
            p.x += (dx / dist) * 1.4;
            p.y += (dy / dist) * 1.4;
          }
        }

        if (p.y < -12 || p.x < -12 || p.x > w + 12) seed(p);

        const tw = 0.55 + 0.45 * Math.sin(p.phase * 2);
        const size = p.r * 8;
        ctx.globalAlpha = p.alpha * tw;
        ctx.drawImage(sprites[p.sprite], p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    cacheRect();

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', cacheRect, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', cacheRect);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
