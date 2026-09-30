import { SkipperMarquee } from '../lib/skipper';

export default function Marquee() {
  return (
    <section id="showreel" className="relative border-b border-white/10 bg-void py-10">
      <SkipperMarquee
        items={['Immersive 3D', 'AI Engineering', 'Cloud Native', 'Fintech', 'WebGL', 'Motion Design']}
        duration={30}
      />
      <div className="mt-6">
        <SkipperMarquee
          items={['React', 'Three.js', 'GSAP', 'Node.js', 'Python', 'AWS']}
          duration={36}
          outline
        />
      </div>
    </section>
  );
}
