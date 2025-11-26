'use client';

import { useEffect, useRef, useState } from 'react';

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
}

export default function ThreeBodyVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [preset, setPreset] = useState<'figure8' | 'lagrange' | 'butterfly' | 'random'>('figure8');
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 600;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize bodies based on preset
    let bodies: Body[] = [];
    const colors = ['#ff0080', '#00ffff', '#ffff00'];

    switch (preset) {
      case 'figure8':
        bodies = [
          { x: 0.97000436, y: -0.24308753, vx: 0.466203685, vy: 0.43236573, mass: 1, color: colors[0] },
          { x: -0.97000436, y: 0.24308753, vx: 0.466203685, vy: 0.43236573, mass: 1, color: colors[1] },
          { x: 0, y: 0, vx: -0.93240737, vy: -0.86473146, mass: 1, color: colors[2] },
        ];
        break;

      case 'lagrange':
        bodies = [
          { x: -0.5, y: -0.288675, vx: 0.5, vy: -0.866025, mass: 1, color: colors[0] },
          { x: 0.5, y: -0.288675, vx: 0.5, vy: 0.866025, mass: 1, color: colors[1] },
          { x: 0, y: 0.57735, vx: -1, vy: 0, mass: 1, color: colors[2] },
        ];
        break;

      case 'butterfly':
        bodies = [
          { x: -1, y: 0, vx: 0.347111, vy: 0.532728, mass: 1, color: colors[0] },
          { x: 1, y: 0, vx: 0.347111, vy: 0.532728, mass: 1, color: colors[1] },
          { x: 0, y: 0, vx: -0.694222, vy: -1.065456, mass: 1, color: colors[2] },
        ];
        break;

      case 'random':
        bodies = [
          { x: -1, y: 0, vx: 0, vy: 0.5, mass: 1, color: colors[0] },
          { x: 1, y: 0, vx: 0, vy: -0.5, mass: 1, color: colors[1] },
          { x: 0, y: 1.5, vx: -0.3, vy: 0, mass: 1, color: colors[2] },
        ];
        break;
    }

    const G = 1;
    const dt = 0.001;
    const trails: { x: number; y: number; color: string }[][] = [[], [], []];
    const maxTrailLength = 500;
    const scale = 120;

    const simulate = () => {
      if (!isRunning) return;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Multiple substeps for accuracy
      for (let substep = 0; substep < 50; substep++) {
        // Calculate accelerations
        const accelerations = bodies.map(() => ({ ax: 0, ay: 0 }));

        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const dx = bodies[j].x - bodies[i].x;
            const dy = bodies[j].y - bodies[i].y;
            const r = Math.sqrt(dx * dx + dy * dy);
            const r3 = Math.max(r * r * r, 0.001);

            const fx = G * dx / r3;
            const fy = G * dy / r3;

            accelerations[i].ax += bodies[j].mass * fx;
            accelerations[i].ay += bodies[j].mass * fy;
            accelerations[j].ax -= bodies[i].mass * fx;
            accelerations[j].ay -= bodies[i].mass * fy;
          }
        }

        // Update velocities and positions (Euler method for speed)
        for (let i = 0; i < bodies.length; i++) {
          bodies[i].vx += accelerations[i].ax * dt;
          bodies[i].vy += accelerations[i].ay * dt;
          bodies[i].x += bodies[i].vx * dt;
          bodies[i].y += bodies[i].vy * dt;
        }
      }

      // Record trails
      bodies.forEach((body, i) => {
        trails[i].push({
          x: centerX + body.x * scale,
          y: centerY + body.y * scale,
          color: body.color,
        });
        if (trails[i].length > maxTrailLength) {
          trails[i].shift();
        }
      });

      // Draw trails
      trails.forEach((trail, bodyIndex) => {
        for (let i = 1; i < trail.length; i++) {
          const alpha = i / trail.length;
          ctx.strokeStyle = trail[i].color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
      });

      // Draw bodies
      bodies.forEach((body, i) => {
        const x = centerX + body.x * scale;
        const y = centerY + body.y * scale;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, body.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isRunning, preset]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full rounded-lg bg-black" />
      <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
        <select
          value={preset}
          onChange={(e) => {
            setPreset(e.target.value as any);
            setIsRunning(false);
            setTimeout(() => setIsRunning(true), 100);
          }}
          className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold"
        >
          <option value="figure8">Figure-8</option>
          <option value="lagrange">Lagrange</option>
          <option value="butterfly">Butterfly</option>
          <option value="random">Chaotic</option>
        </select>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-all"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
      </div>
      <div className="mt-4 text-center text-sm text-gray-400">
        <p className="font-mono">Three-Body Problem: {preset}</p>
        <p className="mt-1">Gravitational chaos - three masses interacting under Newton's laws</p>
      </div>
    </div>
  );
}
