import React, { useEffect, useRef } from 'react';
import { ThemeId } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
  vRot: number;
}

interface ParticlesCanvasProps {
  themeId: ThemeId;
  triggerWin: boolean;
  triggerPlaceCellIndex: number | null;
  boardSize: number;
}

export const ParticlesCanvas: React.FC<ParticlesCanvasProps> = ({
  themeId,
  triggerWin,
  triggerPlaceCellIndex,
  boardSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Colors per theme
  const getThemeParticleColors = (theme: ThemeId): string[] => {
    switch (theme) {
      case 'wood':
        return ['#f59e0b', '#d97706', '#fbbf24', '#78350f', '#fef3c7'];
      case 'neon':
        return ['#06b6d4', '#d946ef', '#3b82f6', '#ec4899', '#a855f7'];
      case 'slate':
        return ['#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#fbbf24'];
      case 'glass':
        return ['#38bdf8', '#818cf8', '#c084fc', '#e0e7ff', '#ffffff'];
      case 'sketch':
        return ['#44403c', '#ea580c', '#d97706', '#1c1917', '#fef08a'];
      default:
        return ['#f59e0b', '#06b6d4', '#ffffff'];
    }
  };

  // Spawn confetti burst across top & center on Win
  const spawnWinBurst = (canvas: HTMLCanvasElement) => {
    const colors = getThemeParticleColors(themeId);
    const particlesCount = 120;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const x = canvas.width / 2 + (Math.random() * 200 - 100);
      const y = canvas.height / 2 + (Math.random() * 100 - 50);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;

      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward trajectory
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        shape: Math.random() > 0.5 ? 'square' : 'circle',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }

    particlesRef.current.push(...newParticles);
  };

  // Trigger win burst
  useEffect(() => {
    if (triggerWin && canvasRef.current) {
      spawnWinBurst(canvasRef.current);
    }
  }, [triggerWin, themeId]);

  // Main 60fps render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
};
