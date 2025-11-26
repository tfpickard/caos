'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LorenzVisualizer from './components/LorenzVisualizer';
import LogisticMapVisualizer from './components/LogisticMapVisualizer';
import ThreeBodyVisualizer from './components/ThreeBodyVisualizer';

type SystemType = 'lorenz' | 'logistic' | 'threebody';

const systems: SystemType[] = ['lorenz', 'logistic', 'threebody'];

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<SystemType>('lorenz');

  useEffect(() => {
    // Randomly select a system on page load
    const randomSystem = systems[Math.floor(Math.random() * systems.length)];
    setActiveDemo(randomSystem);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Minimal Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-9xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            CAOS
          </h1>
          <p className="text-xl text-gray-400 mb-8">Chaotic Algorithms Operating Service</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/docs"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
            >
              API Docs
            </Link>
            <Link
              href="/playground"
              className="px-6 py-2 border border-purple-500 hover:bg-purple-500/20 rounded-lg transition-all"
            >
              Playground
            </Link>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <div className="rounded-lg overflow-hidden bg-black/60">
            {activeDemo === 'lorenz' && <LorenzVisualizer />}
            {activeDemo === 'logistic' && <LogisticMapVisualizer />}
            {activeDemo === 'threebody' && <ThreeBodyVisualizer />}
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 text-center">
            <div className="text-2xl mb-1">🌀</div>
            <div className="text-xs text-gray-400">Lorenz</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-pink-500/20 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-gray-400">Logistic</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs text-gray-400">Pendulum</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-yellow-500/20 text-center">
            <div className="text-2xl mb-1">🌍</div>
            <div className="text-xs text-gray-400">Three-Body</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-green-500/20 text-center">
            <div className="text-2xl mb-1">🎨</div>
            <div className="text-xs text-gray-400">Mandelbrot</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 text-center">
            <div className="text-2xl mb-1">🔬</div>
            <div className="text-xs text-gray-400">Cellular</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 text-center">
            <div className="text-2xl mb-1">🪐</div>
            <div className="text-xs text-gray-400">N-Body</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-cyan-500/20 text-center">
            <div className="text-2xl mb-1">🐦</div>
            <div className="text-xs text-gray-400">Boids</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-orange-500/20 text-center">
            <div className="text-2xl mb-1">💫</div>
            <div className="text-xs text-gray-400">Hénon</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/20 text-center">
            <div className="text-2xl mb-1">〰️</div>
            <div className="text-xs text-gray-400">Duffing</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-xs text-gray-600">
          Deterministic chaos through computation
        </footer>
      </div>
    </main>
  );
}
