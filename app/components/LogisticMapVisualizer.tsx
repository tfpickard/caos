'use client';

import { useEffect, useRef, useState } from 'react';

export default function LogisticMapVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rParam, setRParam] = useState(3.7);

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

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bifurcation diagram
    const rMin = 2.5;
    const rMax = 4.0;
    const rSteps = canvas.width;
    const iterations = 300;
    const plotLast = 150;

    for (let i = 0; i < rSteps; i++) {
      const r = rMin + (i / rSteps) * (rMax - rMin);
      let x = 0.5;

      // Skip transient iterations
      for (let j = 0; j < iterations; j++) {
        x = r * x * (1 - x);
      }

      // Plot the attractor
      for (let j = 0; j < plotLast; j++) {
        x = r * x * (1 - x);

        const px = i;
        const py = canvas.height - x * canvas.height;

        // Color based on r value
        const hue = ((r - rMin) / (rMax - rMin)) * 280;
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.3)`;
        ctx.fillRect(px, py, 1, 1);
      }

      // Highlight current r parameter
      if (Math.abs(r - rParam) < 0.01) {
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
    }

    // Draw current iteration sequence
    const sequenceCanvas = drawSequence(rParam);
    if (sequenceCanvas) {
      const sequenceY = canvas.height - 150;
      ctx.drawImage(sequenceCanvas, 10, sequenceY, 300, 140);
    }

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`r = ${rMin.toFixed(1)}`, 10, canvas.height - 10);
    ctx.fillText(`r = ${rMax.toFixed(1)}`, canvas.width - 60, canvas.height - 10);
    ctx.fillText('Population', 10, 20);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rParam]);

  const drawSequence = (r: number): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#666';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    let x = 0.5;
    const steps = 100;
    const plotWidth = canvas.width - 20;
    const plotHeight = canvas.height - 40;

    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < steps; i++) {
      x = r * x * (1 - x);

      const px = 10 + (i / steps) * plotWidth;
      const py = 30 + plotHeight - x * plotHeight;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Time Series (r = ${r.toFixed(2)})`, 10, 15);

    return canvas;
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full rounded-lg" />
      <div className="mt-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-mono text-gray-300">
            r parameter: <span className="text-purple-400">{rParam.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="2.5"
            max="4.0"
            step="0.01"
            value={rParam}
            onChange={(e) => setRParam(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <p className="mt-2 text-sm text-gray-400 text-center">
          The logistic map bifurcation diagram - watch chaos emerge as r increases
        </p>
        <div className="mt-2 text-xs text-gray-500 text-center font-mono">
          x<sub>n+1</sub> = r · x<sub>n</sub> · (1 - x<sub>n</sub>)
        </div>
      </div>
    </div>
  );
}
