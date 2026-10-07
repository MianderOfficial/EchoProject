import React, { useEffect, useRef } from 'react';

interface EchoRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  color: string;
}

interface SoundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseY: number;
  phase: number;
}

interface SoundWaveCanvasProps {
  intensity?: 'subtle' | 'medium' | 'high';
  theme?: 'dark-sonic' | 'light-acoustic' | 'graphite-wave';
  interactive?: boolean;
  className?: string;
  enableRipples?: boolean;
  enableParticles?: boolean;
}

export const SoundWaveCanvas: React.FC<SoundWaveCanvasProps> = ({
  intensity = 'high',
  theme = 'dark-sonic',
  interactive = true,
  className = '',
  enableRipples = true,
  enableParticles = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, isHovering: false, lastMove: 0 });
  const ripplesRef = useRef<EchoRipple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let lastAutoPulse = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial particles
    const particleCount = intensity === 'subtle' ? 24 : intensity === 'high' ? 42 : 32;
    const particles: SoundParticle[] = [];
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (w || 800),
        y: Math.random() * (h || 600),
        baseY: Math.random() * (h || 600),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2.2 + 1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Helper to spawn an acoustic echo ripple
    const spawnRipple = (x: number, y: number, colorOverride?: string) => {
      const colors =
        theme === 'light-acoustic'
          ? ['rgba(15, 76, 129, 0.4)', 'rgba(56, 182, 182, 0.6)', 'rgba(72, 202, 228, 0.5)']
          : ['rgba(56, 182, 182, 0.85)', 'rgba(72, 202, 228, 0.7)', 'rgba(15, 76, 129, 0.6)'];

      const chosenColor = colorOverride || colors[Math.floor(Math.random() * colors.length)];

      ripplesRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: Math.min(w, h) * (0.45 + Math.random() * 0.45),
        opacity: 0.9,
        speed: 2.2 + Math.random() * 1.5,
        color: chosenColor,
      });

      // Spawn harmonic secondary overtone ring
      setTimeout(() => {
        ripplesRef.current.push({
          x,
          y,
          radius: 4,
          maxRadius: Math.min(w, h) * 0.6,
          opacity: 0.6,
          speed: 1.8,
          color: colors[0],
        });
      }, 160);
    };

    // Click anywhere spawns acoustic wave ring
    const onCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        isHovering: true,
        lastMove: Date.now(),
      };

      // Periodic ripple on brisk movement
      if (Math.random() < 0.08) {
        spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    const onMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    // Listen to window custom echo event triggered on slide transitions
    const onEchoPulseEvent = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.detail?.x || rect.width * 0.5;
      const y = e.detail?.y || rect.height * 0.5;
      spawnRipple(x, y, 'rgba(72, 202, 228, 0.95)');
    };

    window.addEventListener('echo-pulse', onEchoPulseEvent);

    if (interactive) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
      canvas.addEventListener('click', onCanvasClick);
    }

    // Colors
    const getWaveColors = () => {
      if (theme === 'light-acoustic') {
        return [
          { stroke: 'rgba(15, 76, 129, 0.28)', fill: 'rgba(56, 182, 182, 0.05)', speed: 0.012, freq: 0.007, amp: 45 },
          { stroke: 'rgba(56, 182, 182, 0.45)', fill: 'rgba(72, 202, 228, 0.06)', speed: 0.018, freq: 0.012, amp: 65 },
          { stroke: 'rgba(11, 44, 89, 0.18)', fill: 'transparent', speed: 0.008, freq: 0.005, amp: 35 },
          { stroke: 'rgba(72, 202, 228, 0.55)', fill: 'transparent', speed: 0.024, freq: 0.018, amp: 75 },
        ];
      }
      return [
        { stroke: 'rgba(15, 76, 129, 0.65)', fill: 'rgba(15, 76, 129, 0.14)', speed: 0.011, freq: 0.006, amp: 55 },
        { stroke: 'rgba(56, 182, 182, 0.75)', fill: 'rgba(56, 182, 182, 0.09)', speed: 0.017, freq: 0.012, amp: 75 },
        { stroke: 'rgba(72, 202, 228, 0.95)', fill: 'transparent', speed: 0.022, freq: 0.016, amp: 60 },
        { stroke: 'rgba(147, 197, 253, 0.50)', fill: 'transparent', speed: 0.008, freq: 0.004, amp: 40 },
      ];
    };

    const multiplier = intensity === 'subtle' ? 0.6 : intensity === 'high' ? 1.4 : 1.0;

    const render = (timestamp: number) => {
      const curRect = canvas.getBoundingClientRect();
      const curW = curRect.width;
      const curH = curRect.height;

      ctx.clearRect(0, 0, curW, curH);
      time += 0.016;

      // 1. Periodic automatic echo pulse (every 2.2s)
      if (enableRipples && (!lastAutoPulse || timestamp - lastAutoPulse > 2200)) {
        lastAutoPulse = timestamp;
        // Pulse from left or center
        const pulseX = curW * (0.2 + Math.random() * 0.6);
        const pulseY = curH * (0.3 + Math.random() * 0.4);
        spawnRipple(pulseX, pulseY);
      }

      // 2. Draw Echo Expanding Ripples (Sonar / Acoustic wave wavefronts)
      if (enableRipples && ripplesRef.current.length > 0) {
        ctx.save();
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const r = ripplesRef.current[i];
          r.radius += r.speed;
          r.opacity = Math.max(0, 1 - r.radius / r.maxRadius);

          if (r.radius >= r.maxRadius || r.opacity <= 0.01) {
            ripplesRef.current.splice(i, 1);
            continue;
          }

          // Outermost wave crest with glow
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = r.opacity * (theme === 'light-acoustic' ? 0.6 : 0.9);
          ctx.lineWidth = Math.max(1.5, 3.5 * (1 - r.radius / r.maxRadius));
          ctx.shadowColor = r.color;
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Subtle inner echo overtone ring
          if (r.radius > 20) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius * 0.68, 0, Math.PI * 2);
            ctx.strokeStyle = theme === 'light-acoustic' ? '#0F4C81' : '#48CAE4';
            ctx.globalAlpha = r.opacity * 0.5;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 3. Floating Acoustic Particles & Resonator Mesh
      if (enableParticles) {
        ctx.save();
        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.phase += 0.02;
          p.y = p.baseY + Math.sin(p.phase + time) * 16;

          // Wrap boundaries
          if (p.x < 0) p.x = curW;
          if (p.x > curW) p.x = 0;
          if (p.baseY < 0) p.baseY = curH;
          if (p.baseY > curH) p.baseY = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = theme === 'light-acoustic' ? '#0F4C81' : '#38B6B6';
          ctx.globalAlpha = 0.35 + Math.sin(p.phase) * 0.25;
          ctx.fill();

          // Connect adjacent particles if close
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = theme === 'light-acoustic' ? '#38B6B6' : '#48CAE4';
              ctx.globalAlpha = (1 - dist / 85) * 0.15;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        });
        ctx.restore();
      }

      // 4. Flowing Multi-layered Acoustic Waveforms (Ribbon Harmonics)
      const waves = getWaveColors();
      const centerY = curH * 0.64;

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.stroke;
        ctx.lineWidth = index === 2 ? 2.8 : 1.8;
        ctx.fillStyle = wave.fill;

        const effectiveAmp = wave.amp * multiplier * (mouseRef.current.isHovering ? 1.3 : 1);

        ctx.moveTo(0, curH);
        ctx.lineTo(0, centerY);

        for (let x = 0; x <= curW; x += 5) {
          const normalX = x / curW;
          const harmonic1 = Math.sin(x * wave.freq + time * wave.speed * 22);
          const harmonic2 = Math.cos(x * wave.freq * 1.7 + time * wave.speed * 14 + index);
          const harmonic3 = Math.sin(x * 0.003 - time * 0.35);

          let mouseInfluence = 0;
          if (mouseRef.current.isHovering) {
            const dist = Math.abs(normalX - mouseRef.current.x);
            if (dist < 0.28) {
              mouseInfluence = Math.cos((dist / 0.28) * (Math.PI / 2)) * 40;
            }
          }

          const y =
            centerY +
            (harmonic1 * 0.62 + harmonic2 * 0.38 + harmonic3 * 0.25) * effectiveAmp +
            mouseInfluence;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(curW, curH);
        ctx.closePath();

        if (wave.fill !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      });

      // 5. Rhythmic Equalizer Bars on Bottom Edge
      const barCount = 56;
      const barWidth = curW / barCount;
      for (let i = 0; i < barCount; i++) {
        const barHeight =
          Math.sin(i * 0.38 + time * 1.8) *
          Math.cos(i * 0.18 - time * 0.9) *
          24 *
          multiplier;

        if (Math.abs(barHeight) > 2) {
          ctx.fillStyle =
            theme === 'light-acoustic'
              ? 'rgba(56, 182, 182, 0.22)'
              : 'rgba(56, 182, 182, 0.35)';
          ctx.fillRect(
            i * barWidth + 2,
            curH - Math.abs(barHeight),
            barWidth - 4,
            Math.abs(barHeight)
          );

          // Glowing tip cap on top of bars
          ctx.fillStyle = theme === 'light-acoustic' ? '#0F4C81' : '#48CAE4';
          ctx.fillRect(i * barWidth + 2, curH - Math.abs(barHeight) - 2, barWidth - 4, 2);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('echo-pulse', onEchoPulseEvent);
      if (interactive) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
        canvas.removeEventListener('click', onCanvasClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, theme, interactive, enableRipples, enableParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair ${className}`}
      title="Кликните в любом месте для запуска акустического эхо-импульса"
    />
  );
};
