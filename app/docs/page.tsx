'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ApiExample {
  title: string;
  description: string;
  endpoint: string;
  method: string;
  example: string;
  params: { name: string; type: string; default: string; description: string }[];
}

const apiExamples: ApiExample[] = [
  {
    title: 'Lorenz Attractor',
    description: 'Generate trajectories of the famous Lorenz strange attractor. A cornerstone of chaos theory.',
    endpoint: '/api/chaos/lorenz',
    method: 'GET',
    example: '/api/chaos/lorenz?steps=500&sigma=10&rho=28&beta=2.667',
    params: [
      { name: 'sigma', type: 'number', default: '10', description: 'Prandtl number' },
      { name: 'rho', type: 'number', default: '28', description: 'Rayleigh number' },
      { name: 'beta', type: 'number', default: '2.667', description: 'Geometric factor' },
      { name: 'steps', type: 'number', default: '1000', description: 'Number of steps (max 10000)' },
      { name: 'dt', type: 'number', default: '0.01', description: 'Time step' },
    ],
  },
  {
    title: 'Logistic Map',
    description: 'Explore the logistic map and its famous period-doubling route to chaos.',
    endpoint: '/api/chaos/logistic-map',
    method: 'GET',
    example: '/api/chaos/logistic-map?mode=timeseries&r=3.7&iterations=100',
    params: [
      { name: 'mode', type: 'string', default: 'bifurcation', description: 'bifurcation or timeseries' },
      { name: 'r', type: 'number', default: '3.5', description: 'Growth rate parameter' },
      { name: 'x0', type: 'number', default: '0.5', description: 'Initial population' },
      { name: 'iterations', type: 'number', default: '300', description: 'Total iterations' },
    ],
  },
  {
    title: 'Double Pendulum',
    description: 'Simulate the chaotic motion of a double pendulum system.',
    endpoint: '/api/chaos/double-pendulum',
    method: 'GET',
    example: '/api/chaos/double-pendulum?theta1=1.5&theta2=2.5&duration=5',
    params: [
      { name: 'theta1', type: 'number', default: '1.0', description: 'Initial angle 1 (radians)' },
      { name: 'theta2', type: 'number', default: '2.0', description: 'Initial angle 2 (radians)' },
      { name: 'duration', type: 'number', default: '10', description: 'Simulation duration (seconds)' },
      { name: 'dt', type: 'number', default: '0.01', description: 'Time step' },
    ],
  },
  {
    title: 'Mandelbrot Set',
    description: 'Generate iteration data for the iconic Mandelbrot fractal.',
    endpoint: '/api/chaos/mandelbrot',
    method: 'GET',
    example: '/api/chaos/mandelbrot?width=400&height=300&max_iterations=100',
    params: [
      { name: 'width', type: 'number', default: '800', description: 'Image width (max 1920)' },
      { name: 'height', type: 'number', default: '600', description: 'Image height (max 1080)' },
      { name: 'x_min', type: 'number', default: '-2.5', description: 'Min real component' },
      { name: 'x_max', type: 'number', default: '1.0', description: 'Max real component' },
      { name: 'max_iterations', type: 'number', default: '100', description: 'Max iterations (max 1000)' },
    ],
  },
  {
    title: 'Cellular Automata',
    description: 'Generate patterns using elementary cellular automaton rules.',
    endpoint: '/api/chaos/cellular-automata',
    method: 'GET',
    example: '/api/chaos/cellular-automata?rule=110&width=150&generations=150',
    params: [
      { name: 'rule', type: 'number', default: '30', description: 'Wolfram rule (0-255)' },
      { name: 'width', type: 'number', default: '200', description: 'Grid width (max 500)' },
      { name: 'generations', type: 'number', default: '100', description: 'Generations (max 500)' },
      { name: 'initial', type: 'string', default: 'single', description: 'single or random' },
    ],
  },
];

export default function DocsPage() {
  const [selectedApi, setSelectedApi] = useState<ApiExample>(apiExamples[0]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleTryIt = async () => {
    setLoading(true);
    setResponse('Loading...');

    try {
      const res = await fetch(selectedApi.example);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            API Documentation
          </h1>
          <p className="text-xl text-gray-300">
            Comprehensive guide to all CAOS endpoints
          </p>
        </div>

        {/* API Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {apiExamples.map((api, index) => (
            <button
              key={index}
              onClick={() => setSelectedApi(api)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedApi.title === api.title
                  ? 'bg-purple-600/30 border-purple-400'
                  : 'bg-black/40 border-purple-500/30 hover:border-purple-400/60'
              }`}
            >
              <h3 className="text-xl font-bold mb-2 text-purple-300">{api.title}</h3>
              <p className="text-sm text-gray-400">{api.description}</p>
              <div className="mt-3 text-xs font-mono text-gray-500">{api.method}</div>
            </button>
          ))}
        </div>

        {/* API Details */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold mb-4 text-purple-300">
              {selectedApi.title}
            </h2>
            <p className="text-gray-300 mb-6">{selectedApi.description}</p>

            {/* Endpoint */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">ENDPOINT</label>
              <div className="bg-black/60 p-4 rounded-lg font-mono text-sm text-green-400 break-all">
                <span className="text-purple-400">{selectedApi.method}</span>{' '}
                {selectedApi.endpoint}
              </div>
            </div>

            {/* Parameters */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">PARAMETERS</label>
              <div className="space-y-3">
                {selectedApi.params.map((param, index) => (
                  <div
                    key={index}
                    className="bg-black/60 p-4 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-purple-400">{param.name}</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {param.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{param.description}</p>
                    <p className="text-xs text-gray-500">
                      Default: <span className="text-gray-400">{param.default}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Request */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">EXAMPLE REQUEST</label>
              <div className="bg-black/60 p-4 rounded-lg">
                <div className="font-mono text-sm text-green-400 break-all mb-3">
                  curl {origin}
                  {selectedApi.example}
                </div>
                <button
                  onClick={handleTryIt}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-semibold transition-all"
                >
                  {loading ? 'Loading...' : 'Try It Now'}
                </button>
              </div>
            </div>

            {/* Response */}
            {response && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">RESPONSE</label>
                <div className="bg-black/60 p-4 rounded-lg max-h-96 overflow-auto">
                  <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
                    {response}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Quick Start</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-200">1. No Authentication Required</h3>
                <p className="text-gray-400">
                  All endpoints are currently open during beta. Simply make GET requests to any endpoint.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-200">2. Response Format</h3>
                <p className="text-gray-400">
                  All responses are in JSON format with consistent structure including parameters, data, and metadata.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-200">3. Rate Limits</h3>
                <p className="text-gray-400">
                  Reasonable use limits apply. Please don't abuse the service. Commercial rate limits coming soon.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-200">4. CORS Enabled</h3>
                <p className="text-gray-400">
                  Make requests from any domain. Perfect for web applications and experiments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
