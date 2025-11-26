'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type System = 'lorenz' | 'logistic-map' | 'double-pendulum' | 'three-body' | 'mandelbrot' | 'cellular-automata';

export default function PlaygroundPage() {
  const [system, setSystem] = useState<System>('lorenz');
  const [isAnimating, setIsAnimating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  // Lorenz parameters
  const [lorenzParams, setLorenzParams] = useState({
    sigma: 10,
    rho: 28,
    beta: 2.667,
  });

  // Logistic map parameters
  const [logisticParams, setLogisticParams] = useState({
    r: 3.7,
    x0: 0.5,
  });

  // Double pendulum parameters
  const [pendulumParams, setPendulumParams] = useState({
    theta1: 1.5,
    theta2: 2.0,
  });

  // Three-body parameters
  const [threeBodyParams, setThreeBodyParams] = useState({
    preset: 'figure8' as 'figure8' | 'lagrange' | 'butterfly' | 'random',
  });

  // Mandelbrot parameters
  const [mandelbrotParams, setMandelbrotParams] = useState({
    centerX: -0.5,
    centerY: 0,
    zoom: 1,
    maxIterations: 100,
  });

  // Cellular automata parameters
  const [caParams, setCaParams] = useState({
    rule: 30,
    cellSize: 4,
  });

  // Cleanup function to stop animation
  const stopAnimation = () => {
    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  };

  // System change handler
  const handleSystemChange = (newSystem: System) => {
    stopAnimation();
    setSystem(newSystem);
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  // Main animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Stop any existing animation
    stopAnimation();

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isAnimating) return;

    // Start appropriate animation
    switch (system) {
      case 'lorenz':
        animateLorenz(canvas, ctx);
        break;
      case 'logistic-map':
        animateLogisticMap(canvas, ctx);
        break;
      case 'double-pendulum':
        animateDoublePendulum(canvas, ctx);
        break;
      case 'three-body':
        animateThreeBody(canvas, ctx);
        break;
      case 'mandelbrot':
        animateMandelbrot(canvas, ctx);
        break;
      case 'cellular-automata':
        animateCellularAutomata(canvas, ctx);
        break;
    }

    return stopAnimation;
  }, [system, isAnimating, lorenzParams, logisticParams, pendulumParams, threeBodyParams, mandelbrotParams, caParams]);

  const animateLorenz = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let x = 0.1, y = 0, z = 0;
    const dt = 0.01;
    const points: { x: number; y: number; z: number }[] = [];
    const maxPoints = 2000;
    let angleY = 0;

    const animate = () => {
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

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateLogisticMap = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let iteration = 0;
    const values: number[] = [];
    let x = logisticParams.x0;

    const animate = () => {
      // Draw bifurcation background
      if (iteration === 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw bifurcation diagram
        const rMin = 2.5;
        const rMax = 4.0;
        const rSteps = canvas.width;

        for (let i = 0; i < rSteps; i++) {
          const r = rMin + (i / rSteps) * (rMax - rMin);
          let xTemp = 0.5;

          for (let j = 0; j < 300; j++) {
            xTemp = r * xTemp * (1 - xTemp);
          }

          for (let j = 0; j < 100; j++) {
            xTemp = r * xTemp * (1 - xTemp);
            const px = i;
            const py = canvas.height - xTemp * canvas.height;
            const hue = ((r - rMin) / (rMax - rMin)) * 280;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.1)`;
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }

      // Animate current r value
      x = logisticParams.r * x * (1 - x);
      values.push(x);
      if (values.length > 200) values.shift();

      // Draw current iteration line
      const rPos = ((logisticParams.r - 2.5) / (4.0 - 2.5)) * canvas.width;
      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rPos, 0);
      ctx.lineTo(rPos, canvas.height);
      ctx.stroke();

      // Draw time series
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < values.length; i++) {
        const px = rPos + 100 + (i / values.length) * 200;
        const py = canvas.height - values[i] * canvas.height * 0.5;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      iteration++;
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateDoublePendulum = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let theta1 = pendulumParams.theta1;
    let theta2 = pendulumParams.theta2;
    let omega1 = 0;
    let omega2 = 0;

    const m1 = 1, m2 = 1;
    const L1 = 150, L2 = 150;
    const g = 9.81;
    const dt = 0.05;

    const trail: { x: number; y: number }[] = [];
    const maxTrail = 500;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const x1 = canvas.width / 2 + L1 * Math.sin(theta1);
      const y1 = 200 + L1 * Math.cos(theta1);
      const x2 = x1 + L2 * Math.sin(theta2);
      const y2 = y1 + L2 * Math.cos(theta2);

      trail.push({ x: x2, y: y2 });
      if (trail.length > maxTrail) trail.shift();

      for (let i = 1; i < trail.length; i++) {
        const alpha = i / trail.length;
        ctx.strokeStyle = `hsla(${(i / trail.length) * 360}, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 200);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.fillStyle = '#f0f';
      ctx.beginPath();
      ctx.arc(x1, y1, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0ff';
      ctx.beginPath();
      ctx.arc(x2, y2, 10, 0, Math.PI * 2);
      ctx.fill();

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

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateThreeBody = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const colors = ['#ff0080', '#00ffff', '#ffff00'];
    let bodies: { x: number; y: number; vx: number; vy: number; mass: number; color: string }[] = [];

    switch (threeBodyParams.preset) {
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

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let substep = 0; substep < 50; substep++) {
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

        for (let i = 0; i < bodies.length; i++) {
          bodies[i].vx += accelerations[i].ax * dt;
          bodies[i].vy += accelerations[i].ay * dt;
          bodies[i].x += bodies[i].vx * dt;
          bodies[i].y += bodies[i].vy * dt;
        }
      }

      bodies.forEach((body, i) => {
        trails[i].push({
          x: centerX + body.x * scale,
          y: centerY + body.y * scale,
          color: body.color,
        });
        if (trails[i].length > maxTrailLength) trails[i].shift();
      });

      trails.forEach((trail) => {
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

      bodies.forEach((body) => {
        const x = centerX + body.x * scale;
        const y = centerY + body.y * scale;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, body.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateMandelbrot = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const width = canvas.width;
    const height = canvas.height;
    const xMin = mandelbrotParams.centerX - 2 / mandelbrotParams.zoom;
    const xMax = mandelbrotParams.centerX + 2 / mandelbrotParams.zoom;
    const yMin = mandelbrotParams.centerY - 1.5 / mandelbrotParams.zoom;
    const yMax = mandelbrotParams.centerY + 1.5 / mandelbrotParams.zoom;

    for (let py = 0; py < height; py++) {
      const y = yMin + (py / height) * (yMax - yMin);

      for (let px = 0; px < width; px++) {
        const x = xMin + (px / width) * (xMax - xMin);

        let zx = 0, zy = 0;
        let iteration = 0;

        while (zx * zx + zy * zy < 4 && iteration < mandelbrotParams.maxIterations) {
          const xtemp = zx * zx - zy * zy + x;
          zy = 2 * zx * zy + y;
          zx = xtemp;
          iteration++;
        }

        if (iteration === mandelbrotParams.maxIterations) {
          ctx.fillStyle = '#000';
        } else {
          const hue = (iteration / mandelbrotParams.maxIterations) * 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        }
        ctx.fillRect(px, py, 1, 1);
      }
    }
  };

  const animateCellularAutomata = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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
      if (row >= rows) {
        row = 0;
        current = new Array(cols).fill(0);
        current[Math.floor(cols / 2)] = 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < cols; i++) {
        if (current[i] === 1) {
          const hue = (row / rows) * 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
          ctx.fillRect(i * cellSize, row * cellSize, cellSize, cellSize);
        }
      }

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

      setTimeout(() => {
        animationIdRef.current = requestAnimationFrame(animate);
      }, 50);
    };

    animate();
  };

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
            Experiment with all six chaotic systems in real-time
          </p>
        </div>

        {/* System Selector */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: 'lorenz', name: 'Lorenz Attractor', emoji: '🌀' },
            { id: 'logistic-map', name: 'Logistic Map', emoji: '📊' },
            { id: 'double-pendulum', name: 'Double Pendulum', emoji: '⚡' },
            { id: 'three-body', name: 'Three-Body', emoji: '🌍' },
            { id: 'mandelbrot', name: 'Mandelbrot', emoji: '🎨' },
            { id: 'cellular-automata', name: 'Cellular Automata', emoji: '🔬' },
          ].map((sys) => (
            <button
              key={sys.id}
              onClick={() => handleSystemChange(sys.id as System)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                system === sys.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{sys.emoji}</span>
              {sys.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <canvas ref={canvasRef} className="w-full rounded-lg bg-black" />
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                >
                  {isAnimating ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    stopAnimation();
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

              {system === 'logistic-map' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      r parameter: <span className="text-purple-400">{logisticParams.r.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="2.5"
                      max="4.0"
                      step="0.01"
                      value={logisticParams.r}
                      onChange={(e) =>
                        setLogisticParams({ ...logisticParams, r: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded text-xs text-gray-400">
                    <p className="font-mono">x<sub>n+1</sub> = r · x<sub>n</sub> · (1 - x<sub>n</sub>)</p>
                    <p className="mt-2">Shows the famous bifurcation diagram and period-doubling route to chaos.</p>
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
                        stopAnimation();
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
                        stopAnimation();
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

              {system === 'three-body' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Preset Configuration</label>
                    <select
                      value={threeBodyParams.preset}
                      onChange={(e) => {
                        setThreeBodyParams({ preset: e.target.value as any });
                        stopAnimation();
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg"
                    >
                      <option value="figure8">Figure-8 (Periodic)</option>
                      <option value="lagrange">Lagrange (Stable)</option>
                      <option value="butterfly">Butterfly</option>
                      <option value="random">Chaotic</option>
                    </select>
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded text-xs text-gray-400">
                    <p className="font-bold mb-2">Three-Body Problem</p>
                    <p>No general analytical solution exists. Each configuration demonstrates different aspects of gravitational chaos.</p>
                  </div>
                </div>
              )}

              {system === 'mandelbrot' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Zoom: <span className="text-purple-400">{mandelbrotParams.zoom.toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="0.1"
                      value={mandelbrotParams.zoom}
                      onChange={(e) => {
                        setMandelbrotParams({ ...mandelbrotParams, zoom: parseFloat(e.target.value) });
                        stopAnimation();
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Max Iterations: <span className="text-purple-400">{mandelbrotParams.maxIterations}</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={mandelbrotParams.maxIterations}
                      onChange={(e) => {
                        setMandelbrotParams({ ...mandelbrotParams, maxIterations: parseInt(e.target.value) });
                        stopAnimation();
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 100);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-black/40 rounded text-xs text-gray-400">
                    <p className="font-mono">z<sub>n+1</sub> = z<sub>n</sub>² + c</p>
                    <p className="mt-2">Infinite complexity at every scale. Try increasing zoom and iterations!</p>
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
                        stopAnimation();
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
                        stopAnimation();
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
