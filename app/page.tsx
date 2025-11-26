'use client';

import { useState } from 'react';
import Link from 'next/link';
import LorenzVisualizer from './components/LorenzVisualizer';
import LogisticMapVisualizer from './components/LogisticMapVisualizer';
import ThreeBodyVisualizer from './components/ThreeBodyVisualizer';

type SystemType = 'lorenz' | 'logistic' | 'threebody';

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<SystemType>('lorenz');

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="max-w-5xl mx-auto mb-12 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            CAOS
          </h1>
          <p className="text-2xl md:text-3xl text-purple-300 mb-6 font-mono">
            Chaotic Algorithms Operating Service
          </p>

          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              CAOS exists to democratize access to complex dynamical systems and chaos theory through computational tools.
              We provide scientifically accurate simulations and APIs for researchers, educators, engineers, and curious minds
              exploring the profound implications of deterministic chaos.
            </p>
            <p className="text-base text-gray-400 leading-relaxed">
              Unlike random number generators, our systems are fully deterministic—governed by precise mathematical laws—yet
              exhibit behavior so complex and sensitive to initial conditions that they appear unpredictable. This is the essence
              of chaos: where order and disorder coexist, where simple rules create infinite complexity, and where the future is
              determined yet fundamentally unknowable beyond short time horizons.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <Link
              href="/docs"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              📚 API Documentation
            </Link>
            <Link
              href="/playground"
              className="px-8 py-3 bg-transparent border-2 border-purple-400 hover:bg-purple-400/20 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              🎮 Interactive Playground
            </Link>
          </div>
        </div>

        {/* Purpose & Applications */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Why Chaos Matters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🔬 Scientific Research</h3>
              <p className="text-gray-400">
                Model real-world phenomena: weather patterns, population dynamics, fluid turbulence, orbital mechanics,
                and nonlinear systems across physics, biology, and engineering.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold mb-3 text-blue-300">🎓 Education</h3>
              <p className="text-gray-400">
                Teach fundamental concepts in dynamical systems, differential equations, numerical methods, and complexity theory
                with interactive, visual demonstrations.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30">
              <h3 className="text-xl font-bold mb-3 text-pink-300">🧪 Testing & Validation</h3>
              <p className="text-gray-400">
                Generate deterministic pseudo-random sequences for testing algorithms, validating numerical integrators,
                and benchmarking computational methods.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold mb-3 text-green-300">🎨 Creative Applications</h3>
              <p className="text-gray-400">
                Create unique visualizations, generative art, procedural content, and explore the aesthetic beauty
                emerging from mathematical chaos.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Experience Chaos</h2>
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setActiveDemo('lorenz')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeDemo === 'lorenz'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🌀</div>
                <div className="text-sm">Lorenz Attractor</div>
              </button>
              <button
                onClick={() => setActiveDemo('logistic')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeDemo === 'logistic'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm">Logistic Map</div>
              </button>
              <button
                onClick={() => setActiveDemo('threebody')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeDemo === 'threebody'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-sm">Three-Body Problem</div>
              </button>
            </div>

            <div className="rounded-lg overflow-hidden bg-black/60">
              {activeDemo === 'lorenz' && <LorenzVisualizer />}
              {activeDemo === 'logistic' && <LogisticMapVisualizer />}
              {activeDemo === 'threebody' && <ThreeBodyVisualizer />}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Explore all 6 systems with full parameter control</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Systems Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Six Chaotic Systems</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all">
              <div className="text-4xl mb-4">🌀</div>
              <h3 className="text-xl font-bold mb-2 text-purple-300">Lorenz Attractor</h3>
              <p className="text-gray-400 text-sm mb-3">
                The iconic strange attractor discovered by Edward Lorenz while studying atmospheric convection.
                Demonstrates sensitive dependence and the butterfly effect.
              </p>
              <code className="text-xs text-purple-400">dx/dt = σ(y-x)</code>
            </div>

            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/60 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 text-pink-300">Logistic Map</h3>
              <p className="text-gray-400 text-sm mb-3">
                The period-doubling route to chaos. A simple equation exhibiting complex behavior including
                bifurcations, periodic orbits, and chaotic regions.
              </p>
              <code className="text-xs text-pink-400">x<sub>n+1</sub> = rx<sub>n</sub>(1-x<sub>n</sub>)</code>
            </div>

            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/60 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-blue-300">Double Pendulum</h3>
              <p className="text-gray-400 text-sm mb-3">
                A classic demonstration of chaos in mechanical systems. Two coupled pendulums exhibit
                wildly different trajectories from near-identical initial conditions.
              </p>
              <code className="text-xs text-blue-400">Lagrangian mechanics</code>
            </div>

            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition-all">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-300">Three-Body Problem</h3>
              <p className="text-gray-400 text-sm mb-3">
                Gravitational chaos: three masses interacting under Newton's laws. No general closed-form solution exists,
                making this a cornerstone problem in celestial mechanics.
              </p>
              <code className="text-xs text-yellow-400">F = Gm₁m₂/r²</code>
            </div>

            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 hover:border-green-400/60 transition-all">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2 text-green-300">Mandelbrot Set</h3>
              <p className="text-gray-400 text-sm mb-3">
                Infinite complexity at every scale. A fractal generated by iterating a simple complex function,
                revealing self-similar structures and the boundary of chaos.
              </p>
              <code className="text-xs text-green-400">z<sub>n+1</sub> = z<sub>n</sub>² + c</code>
            </div>

            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/30 hover:border-red-400/60 transition-all">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-bold mb-2 text-red-300">Cellular Automata</h3>
              <p className="text-gray-400 text-sm mb-3">
                Emergent complexity from simple local rules. Elementary cellular automata demonstrate how
                global chaotic behavior arises from deterministic local interactions.
              </p>
              <code className="text-xs text-red-400">Rule 30, 110, etc.</code>
            </div>
          </div>
        </div>

        {/* API Showcase */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Simple, Powerful API</h2>
          <div className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <p className="text-gray-300 mb-6 text-center">
              RESTful APIs providing immediate access to high-quality chaotic data.
              No authentication required for open research and education.
            </p>
            <div className="space-y-4 font-mono text-sm">
              <div className="bg-black/40 p-4 rounded-lg">
                <div className="text-gray-500 mb-1"># Lorenz attractor simulation</div>
                <div className="text-green-400">
                  curl https://caos.vercel.app/api/chaos/lorenz?steps=1000&sigma=10&rho=28
                </div>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <div className="text-gray-500 mb-1"># Three-body orbital dynamics</div>
                <div className="text-green-400">
                  curl https://caos.vercel.app/api/chaos/three-body?preset=figure8&duration=20
                </div>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <div className="text-gray-500 mb-1"># Mandelbrot set generation</div>
                <div className="text-green-400">
                  curl https://caos.vercel.app/api/chaos/mandelbrot?width=800&height=600
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/docs"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
              >
                View Full Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-2 text-purple-300">Deterministic</h3>
              <p className="text-sm text-gray-400">
                Every simulation is reproducible from initial conditions. Same input, same output, always.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-lg font-bold mb-2 text-purple-300">Scientifically Accurate</h3>
              <p className="text-sm text-gray-400">
                High-precision numerical methods (RK4, Verlet) ensure accurate long-term simulations.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-lg font-bold mb-2 text-purple-300">Openly Accessible</h3>
              <p className="text-sm text-gray-400">
                No authentication barriers. Free for research, education, and exploration.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 border-t border-gray-800 pt-8">
          <p className="mb-2 text-lg italic text-gray-400">
            "Chaos: When the present determines the future, but the approximate present does not approximately determine the future."
          </p>
          <p className="text-sm">— Edward Lorenz</p>
          <div className="mt-6 text-xs">
            <p>Built for researchers, educators, and explorers of complexity.</p>
            <p className="mt-2">CAOS © 2024 - Advancing chaos theory through computational accessibility</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
