import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ------------------------------------------------------------------ */
/*  Molten chrome torus-knot — the signature NEXORA hero 3D object      */
/*  Perf: adaptive quality tiers, GPU shader sparks (zero per-frame    */
/*  CPU buffer uploads), delta-time motion, offscreen/tab auto-pause,  */
/*  responsive framing for portrait phones → ultrawide desktops.       */
/* ------------------------------------------------------------------ */

export default function Hero3D({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ---- adaptive quality tiers ---- */
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 700;
    const weakCPU = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowPower = coarsePointer || smallScreen || weakCPU;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const Q = lowPower
      ? { tubular: 220, radial: 32, shellTubular: 180, shellRadial: 24, sparks: 220, dpr: 1.25, aa: false }
      : { tubular: 320, radial: 48, shellTubular: 240, shellRadial: 32, sparks: 420, dpr: 1.5, aa: true };

    const renderer = new THREE.WebGLRenderer({
      antialias: Q.aa,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.dpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
    pmrem.dispose();

    const group = new THREE.Group();
    scene.add(group);

    const knotGeo = new THREE.TorusKnotGeometry(1.32, 0.42, Q.tubular, Q.radial, 2, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0b0b0c),
      metalness: 0.95,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.5,
    });
    const core = new THREE.Mesh(knotGeo, coreMat);
    group.add(core);

    const bandGeo = new THREE.TorusKnotGeometry(1.32, 0.335, Q.tubular, Math.max(24, Q.radial - 8), 2, 3);
    const bandMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf2f2f4),
      metalness: 1,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.1,
    });
    const bands = new THREE.Mesh(bandGeo, bandMat);
    bands.rotation.z = 0.35;
    bands.rotation.x = 0.12;
    group.add(bands);

    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xff5a00) },
        uIntensity: { value: 1.6 },
      },
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
          vec3 col = uColor * f * uIntensity;
          gl_FragColor = vec4(col, f * 0.85);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const shellGeo = new THREE.TorusKnotGeometry(1.32, 0.435, Q.shellTubular, Q.shellRadial, 2, 3);
    const shell = new THREE.Mesh(shellGeo, glowMat);
    group.add(shell);

    const ringMat = new THREE.MeshStandardMaterial({ color: 0x888892, metalness: 1, roughness: 0.3, envMapIntensity: 1.4 });
    const ring1Geo = new THREE.TorusGeometry(2.55, 0.012, 8, lowPower ? 140 : 220);
    const ring2Geo = new THREE.TorusGeometry(2.9, 0.008, 8, lowPower ? 140 : 220);
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    const ring2 = new THREE.Mesh(ring2Geo, ringMat.clone());
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = 0.5;
    group.add(ring1, ring2);

    /* ---- GPU-animated ember sparks (no per-frame CPU updates) ---- */
    const COUNT = Q.sparks;
    const pos = new Float32Array(COUNT * 3);
    const aColor = new Float32Array(COUNT * 3);
    const aSpeed = new Float32Array(COUNT);
    const aPhase = new Float32Array(COUNT);
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + Math.random() * 3.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * 4.5;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      c.setHSL(0.04 + Math.random() * 0.06, 1, 0.5 + Math.random() * 0.15);
      aColor[i * 3] = c.r;
      aColor[i * 3 + 1] = c.g;
      aColor[i * 3 + 2] = c.b;
      aSpeed[i] = 0.12 + Math.random() * 0.4;
      aPhase[i] = Math.random() * Math.PI * 2;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sparkGeo.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));
    sparkGeo.setAttribute('aSpeed', new THREE.BufferAttribute(aSpeed, 1));
    sparkGeo.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1));
    const sparkMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30 * renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSpeed;
        attribute float aPhase;
        uniform float uTime;
        uniform float uSize;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y = mod(p.y + 4.5 + uTime * aSpeed, 9.0) - 4.5;
          p.x += sin(uTime * 1.4 + aPhase) * 0.08;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize / -mv.z;
          vColor = aColor;
          vAlpha = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * 2.0 + aPhase * 2.0));
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float a = smoothstep(0.5, 0.05, d) * vAlpha;
          if (a < 0.01) discard;
          gl_FragColor = vec4(vColor, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd4ff, 1.1);
    rim.position.set(-5, -2, -4);
    scene.add(rim);
    const heart1 = new THREE.PointLight(0xff4d00, 60, 20, 1.8);
    heart1.position.set(0.6, 0.4, 0.8);
    const heart2 = new THREE.PointLight(0xff8a00, 40, 20, 1.8);
    heart2.position.set(-0.8, -0.6, -0.6);
    scene.add(heart1, heart2);

    group.rotation.set(0.35, -0.4, 0.1);

    /* ---- responsive framing ---- */
    let groupX = 0.35;
    const frame = () => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const portrait = w < h * 0.9;
      camera.position.z = portrait ? 7.8 : w < 1100 ? 7.0 : 6.4;
      groupX = portrait ? 0 : w < 1100 ? 0.15 : 0.35;
      camera.updateProjectionMatrix();
    };
    frame();

    /* ---- input (cached, passive) ---- */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY;
    const onMouse = (e: globalThis.MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', frame);

    /* ---- render loop with auto-pause ---- */
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let visible = true;
    let simT = 0;

    const render = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      group.rotation.y += 0.0028;
      group.rotation.x = 0.35 + Math.sin(t * 0.4) * 0.08 + mouse.y * 0.18;
      group.rotation.z = 0.1 + mouse.x * 0.12;
      group.position.x = groupX;
      group.position.y = Math.sin(t * 0.7) * 0.16 - scrollY * 0.00045;

      shell.rotation.y -= 0.0015;
      ring1.rotation.z += 0.0018;
      ring2.rotation.z -= 0.0012;

      heart1.intensity = 55 + Math.sin(t * 3.1) * 14;
      heart2.intensity = 38 + Math.cos(t * 2.3) * 12;

      sparkMat.uniforms.uTime.value = t;
      sparks.rotation.y = t * 0.03;

      camera.position.x = mouse.x * 0.35;
      camera.position.y = -mouse.y * 0.25;
      camera.lookAt(portraitLookX(), 0, 0);

      renderer.render(scene, camera);
    };

    const portraitLookX = () => (mount.clientWidth < mount.clientHeight * 0.9 ? 0 : 0.3);

    const animate = () => {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      simT += dt;
      render(simT);
      raf = requestAnimationFrame(animate);
    };
    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reducedMotion) {
      render(1.2); // single static frame
      frame();
      render(1.2);
    } else {
      start();
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.02 }
    );
    io.observe(mount);

    const onVis = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', frame);
      knotGeo.dispose();
      bandGeo.dispose();
      shellGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      sparkGeo.dispose();
      coreMat.dispose();
      bandMat.dispose();
      glowMat.dispose();
      sparkMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`h-full w-full [&>canvas]:h-full [&>canvas]:w-full [&>canvas]:block ${className}`} />;
}
