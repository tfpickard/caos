'use client';

import { useState } from 'react';
import Link from 'next/link';
import LorenzVisualizer from './components/LorenzVisualizer';
import LogisticMapVisualizer from './components/LogisticMapVisualizer';

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<'lorenz' | 'logistic'>('lorenz');

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse-slow">
            CAOS
          </h1>
          <p className="text-2xl md:text-3xl text-purple-300 mb-4 font-mono">
            Chaotic Algorithms Operating Service
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Harness the power of deterministic chaos. Beautiful, unpredictable, yet perfectly reproducible chaotic systems at your fingertips.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/docs"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Explore APIs
            </Link>
            <Link
              href="/playground"
              className="px-8 py-3 bg-transparent border-2 border-purple-400 hover:bg-purple-400/20 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Try Playground
            </Link>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <div className="flex gap-4 mb-6 justify-center flex-wrap">
              <button
                onClick={() => setActiveDemo('lorenz')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeDemo === 'lorenz'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Lorenz Attractor
              </button>
              <button
                onClick={() => setActiveDemo('logistic')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeDemo === 'logistic'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Logistic Map
              </button>
            </div>

            <div className="rounded-lg overflow-hidden bg-black/60">
              {activeDemo === 'lorenz' && <LorenzVisualizer />}
              {activeDemo === 'logistic' && <LogisticMapVisualizer />}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all">
            <div className="text-4xl mb-4">🌀</div>
            <h3 className="text-xl font-bold mb-2 text-purple-300">Strange Attractors</h3>
            <p className="text-gray-400">
              Lorenz, Rössler, Chua, and more. Generate beautiful chaotic trajectories in 2D and 3D space.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/60 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-pink-300">Chaotic Maps</h3>
            <p className="text-gray-400">
              Logistic map, Henon map, bifurcation diagrams. Explore the edge of chaos with simple equations.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/60 transition-all">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2 text-blue-300">Fractal Generation</h3>
            <p className="text-gray-400">
              Mandelbrot, Julia sets, and more. Infinite detail from simple recursive processes.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 hover:border-green-400/60 transition-all">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-bold mb-2 text-green-300">Cellular Automata</h3>
            <p className="text-gray-400">
              Conway's Life, Rule 30, and custom rules. Emergent complexity from simple local interactions.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition-all">
            <div className="text-4xl mb-4">🌊</div>
            <h3 className="text-xl font-bold mb-2 text-yellow-300">Fluid Dynamics</h3>
            <p className="text-gray-400">
              Navier-Stokes simulations, turbulence models. Watch chaos unfold in fluid systems.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/30 hover:border-red-400/60 transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-red-300">Double Pendulum</h3>
            <p className="text-gray-400">
              Classic chaos demonstration. Tiny initial differences lead to wildly different outcomes.
            </p>
          </div>
        </div>

        {/* API Example Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">Simple, Powerful API</h2>
          <div className="bg-black/60 rounded-xl p-6 border border-purple-500/30 font-mono text-sm">
            <div className="text-gray-400 mb-2"># Generate Lorenz attractor data</div>
            <div className="text-green-400">
              curl https://caos.vercel.app/api/chaos/lorenz?steps=1000&sigma=10&rho=28&beta=2.667
            </div>
            <div className="mt-4 text-gray-400 mb-2"># Generate bifurcation diagram</div>
            <div className="text-green-400">
              curl https://caos.vercel.app/api/chaos/logistic-map?r_min=2.5&r_max=4.0&iterations=100
            </div>
            <div className="mt-4 text-gray-400 mb-2"># Simulate double pendulum</div>
            <div className="text-green-400">
              curl https://caos.vercel.app/api/chaos/double-pendulum?duration=10&theta1=1.0&theta2=2.0
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p>Built with chaos and determinism. No randomness, just beautiful mathematics.</p>
        </footer>
      </div>
    </main>
  );
}
