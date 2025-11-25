'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type System = 'lorenz' | 'double-pendulum' | 'cellular-automata';

export default function PlaygroundPage() {
  const [system, setSystem] = useState<System>('lorenz');
  const [isAnimating, setIsAnimating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lorenz parameters
  const [lorenzParams, setLorenzParams] = useState({
    sigma: 10,
    rho: 28,
    beta: 2.667,
  });

  // Double pendulum parameters
  const [pendulumParams, setPendulumParams] = useState({
    theta1: 1.5,
    theta2: 2.0,
    length1: 150,
    length2: 150,
  });

  // Cellular automata parameters
  const [caParams, setCaParams] = useState({
    rule: 30,
    cellSize: 4,
  });

  // Lorenz animation
  useEffect(() => {
    if (system !== 'lorenz' || !isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 600;

    let x = 0.1;
    let y = 0;
    let z = 0;
    const dt = 0.01;
    const points: { x: number; y: number; z: number }[] = [];
    const maxPoints = 2000;
    let angleY = 0;

    const animate = () => {
      if (!isAnimating) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const dx = lorenzParams.sigma * (y - x);
      const dy = x * (lorenzParams.rho - z) - y;
      const dz = x * y - lorenzParams.beta * z;

      x += dx * dt;
      y += dy * dt;
      z += dz * dt;

      points.push({ x, y, z });
      if (points.length > maxPoints) points.shift();

      angleY += 0.002;

      const scale = 8;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        const rot1 = {
          x: p1.x * Math.cos(angleY) - p1.z * Math.sin(angleY),
          y: p1.y,
        };
        const rot2 = {
          x: p2.x * Math.cos(angleY) - p2.z * Math.sin(angleY),
          y: p2.y,
        };

        const hue = (i / points.length) * 360;
        const alpha = i / points.length;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX + rot1.x * scale, centerY + rot1.y * scale);
        ctx.lineTo(centerX + rot2.x * scale, centerY + rot2.y * scale);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [system, isAnimating, lorenzParams]);

  // Double pendulum animation
  useEffect(() => {
    if (system !== 'double-pendulum' || !isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 600;

    let theta1 = pendulumParams.theta1;
    let theta2 = pendulumParams.theta2;
    let omega1 = 0;
    let omega2 = 0;

    const m1 = 1;
    const m2 = 1;
    const L1 = pendulumParams.length1;
    const L2 = pendulumParams.length2;
    const g = 9.81;
    const dt = 0.05;

    const trail: { x: number; y: number }[] = [];
    const maxTrail = 500;

    const animate = () => {
      if (!isAnimating) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate positions
      const x1 = canvas.width / 2 + L1 * Math.sin(theta1);
      const y1 = 200 + L1 * Math.cos(theta1);
      const x2 = x1 + L2 * Math.sin(theta2);
      const y2 = y1 + L2 * Math.cos(theta2);

      // Add to trail
      trail.push({ x: x2, y: y2 });
      if (trail.length > maxTrail) trail.shift();

      // Draw trail
      for (let i = 1; i < trail.length; i++) {
        const alpha = i / trail.length;
        ctx.strokeStyle = `hsla(${(i / trail.length) * 360}, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }

      // Draw pendulum
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 200);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw bobs
      ctx.fillStyle = '#f0f';
      ctx.beginPath();
      ctx.arc(x1, y1, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0ff';
      ctx.beginPath();
      ctx.arc(x2, y2, 10, 0, Math.PI * 2);
      ctx.fill();

      // Update physics
      const delta = theta2 - theta1;
      const den1 = (m1 + m2) * L1 - m2 * L1 * Math.cos(delta) * Math.cos(delta);
      const den2 = (L2 / L1) * den1;

      const domega1 =
        (m2 * L1 * omega1 * omega1 * Math.sin(delta) * Math.cos(delta) +
          m2 * g * Math.sin(theta2) * Math.cos(delta) +
          m2 * L2 * omega2 * omega2 * Math.sin(delta) -
          (m1 + m2) * g * Math.sin(theta1)) /
        den1;

      const domega2 =
        (-m2 * L2 * omega2 * omega2 * Math.sin(delta) * Math.cos(delta) +
          (m1 + m2) * g * Math.sin(theta1) * Math.cos(delta) -
          (m1 + m2) * L1 * omega1 * omega1 * Math.sin(delta) -
          (m1 + m2) * g * Math.sin(theta2)) /
        den2;

      omega1 += domega1 * dt;
      omega2 += domega2 * dt;
      theta1 += omega1 * dt;
      theta2 += omega2 * dt;

      requestAnimationFrame(animate);
    };

    animate();
  }, [system, isAnimating, pendulumParams]);

  // Cellular automata animation
  useEffect(() => {
    if (system !== 'cellular-automata' || !isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 600;

    const cellSize = caParams.cellSize;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    let current = new Array(cols).fill(0);
    current[Math.floor(cols / 2)] = 1;

    const rule = caParams.rule.toString(2).padStart(8, '0');
    const ruleTable: { [key: string]: number } = {
      '111': parseInt(rule[0]),
      '110': parseInt(rule[1]),
      '101': parseInt(rule[2]),
      '100': parseInt(rule[3]),
      '011': parseInt(rule[4]),
      '010': parseInt(rule[5]),
      '001': parseInt(rule[6]),
      '000': parseInt(rule[7]),
    };

    let row = 0;

    const animate = () => {
      if (!isAnimating || row >= rows) return;

      // Draw current generation
      for (let i = 0; i < cols; i++) {
        if (current[i] === 1) {
          const hue = (row / rows) * 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
          ctx.fillRect(i * cellSize, row * cellSize, cellSize, cellSize);
        }
      }

      // Calculate next generation
      const next = new Array(cols).fill(0);
      for (let i = 0; i < cols; i++) {
        const left = current[(i - 1 + cols) % cols];
        const center = current[i];
        const right = current[(i + 1) % cols];
        const key = `${left}${center}${right}`;
        next[i] = ruleTable[key];
      }

      current = next;
      row++;

      setTimeout(() => requestAnimationFrame(animate), 50);
    };

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();
  }, [system, isAnimating, caParams]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Chaos Playground
          </h1>
          <p className="text-xl text-gray-300">
            Experiment with chaotic systems in real-time
          </p>
        </div>

        {/* System Selector */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => {
              setSystem('lorenz');
              setIsAnimating(false);
              setTimeout(() => setIsAnimating(true), 100);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              system === 'lorenz'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Lorenz Attractor
          </button>
          <button
            onClick={() => {
              setSystem('double-pendulum');
              setIsAnimating(false);
              setTimeout(() => setIsAnimating(true), 100);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              system === 'double-pendulum'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Double Pendulum
          </button>
          <button
            onClick={() => {
              setSystem('cellular-automata');
              setIsAnimating(false);
              setTimeout(() => setIsAnimating(true), 100);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              system === 'cellular-automata'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Cellular Automata
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <canvas ref={canvasRef} className="w-full rounded-lg" />
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                >
                  {isAnimating ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    setIsAnimating(false);
                    setTimeout(() => setIsAnimating(true), 100);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Parameters</h3>

              {system === 'lorenz' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      σ (Sigma): <span className="text-purple-400">{lorenzParams.sigma}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={lorenzParams.sigma}
                      onChange={(e) =>
                        setLorenzParams({ ...lorenzParams, sigma: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      ρ (Rho): <span className="text-purple-400">{lorenzParams.rho}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.1"
                      value={lorenzParams.rho}
                      onChange={(e) =>
                        setLorenzParams({ ...lorenzParams, rho: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      β (Beta): <span className="text-purple-400">{lorenzParams.beta.toFixed(3)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.01"
                      value={lorenzParams.beta}
                      onChange={(e) =>
                        setLorenzParams({ ...lorenzParams, beta: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded text-xs text-gray-400">
                    <p className="font-mono">dx/dt = σ(y - x)</p>
                    <p className="font-mono">dy/dt = x(ρ - z) - y</p>
                    <p className="font-mono">dz/dt = xy - βz</p>
                  </div>
                </div>
              )}

              {system === 'double-pendulum' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      θ₁ (Angle 1): <span className="text-purple-400">{pendulumParams.theta1.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={Math.PI}
                      step="0.01"
                      value={pendulumParams.theta1}
                      onChange={(e) => {
                        setPendulumParams({ ...pendulumParams, theta1: parseFloat(e.target.value) });
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      θ₂ (Angle 2): <span className="text-purple-400">{pendulumParams.theta2.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={Math.PI}
                      step="0.01"
                      value={pendulumParams.theta2}
                      onChange={(e) => {
                        setPendulumParams({ ...pendulumParams, theta2: parseFloat(e.target.value) });
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded text-xs text-gray-400">
                    <p>Extremely sensitive to initial conditions!</p>
                    <p className="mt-2">Try tiny changes in angles to see dramatically different outcomes.</p>
                  </div>
                </div>
              )}

              {system === 'cellular-automata' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Rule: <span className="text-purple-400">{caParams.rule}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      step="1"
                      value={caParams.rule}
                      onChange={(e) => {
                        setCaParams({ ...caParams, rule: parseInt(e.target.value) });
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Cell Size: <span className="text-purple-400">{caParams.cellSize}px</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="1"
                      value={caParams.cellSize}
                      onChange={(e) => {
                        setCaParams({ ...caParams, cellSize: parseInt(e.target.value) });
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded text-xs text-gray-400">
                    <p className="font-bold mb-2">Famous Rules:</p>
                    <p>30 - Chaotic (used in random generation)</p>
                    <p>90 - Sierpinski triangle</p>
                    <p>110 - Turing complete</p>
                    <p>184 - Traffic flow model</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
