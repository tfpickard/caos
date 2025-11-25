'use client';

import { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function LorenzVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const animationRef = useRef<number>();

  // Lorenz system parameters
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;

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

    // Initial conditions
    let x = 0.1;
    let y = 0;
    let z = 0;
    const dt = 0.01;
    const points: Point3D[] = [];
    const maxPoints = 2000;

    // Rotation angles
    let angleX = 0.6;
    let angleY = 0.8;

    const drawLorenz = () => {
      if (!isRunning) return;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate next point using Runge-Kutta method (simplified)
      const dx = sigma * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;

      x += dx * dt;
      y += dy * dt;
      z += dz * dt;

      // Add to points array
      points.push({ x, y, z });
      if (points.length > maxPoints) {
        points.shift();
      }

      // Rotation animation
      angleY += 0.002;

      // Project and draw
      const scale = 8;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        // Simple 3D rotation
        const rotated1 = rotate3D(p1, angleX, angleY);
        const rotated2 = rotate3D(p2, angleX, angleY);

        // Perspective projection
        const proj1 = project(rotated1, scale, centerX, centerY);
        const proj2 = project(rotated2, scale, centerX, centerY);

        // Color based on position (creates beautiful gradient)
        const hue = (i / points.length) * 360;
        const alpha = i / points.length;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(drawLorenz);
    };

    drawLorenz();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isRunning]);

  // 3D rotation helper
  const rotate3D = (p: Point3D, angleX: number, angleY: number): Point3D => {
    // Rotate around X axis
    let y = p.y * Math.cos(angleX) - p.z * Math.sin(angleX);
    let z = p.y * Math.sin(angleX) + p.z * Math.cos(angleX);

    // Rotate around Y axis
    const x = p.x * Math.cos(angleY) - z * Math.sin(angleY);
    z = p.x * Math.sin(angleY) + z * Math.cos(angleY);

    return { x, y, z };
  };

  // Perspective projection
  const project = (
    p: Point3D,
    scale: number,
    centerX: number,
    centerY: number
  ): { x: number; y: number } => {
    return {
      x: centerX + p.x * scale,
      y: centerY + p.y * scale,
    };
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full rounded-lg" />
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-all"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
      </div>
      <div className="mt-4 text-center text-sm text-gray-400">
        <p className="font-mono">
          σ = {sigma}, ρ = {rho}, β = {beta.toFixed(3)}
        </p>
        <p className="mt-1">The Lorenz attractor - a beautiful example of deterministic chaos</p>
      </div>
    </div>
  );
}
