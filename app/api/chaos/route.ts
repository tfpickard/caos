import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    service: 'CAOS - Chaotic Algorithms Operating Service',
    version: '1.0.0',
    description: 'Deterministic chaos as a service. Generate beautiful, reproducible chaotic systems.',
    endpoints: {
      '/api/chaos/lorenz': {
        description: 'Generate Lorenz attractor trajectories',
        method: 'GET',
        parameters: {
          sigma: { type: 'number', default: 10, description: 'Prandtl number' },
          rho: { type: 'number', default: 28, description: 'Rayleigh number' },
          beta: { type: 'number', default: 2.667, description: 'Geometric factor' },
          steps: { type: 'number', default: 1000, max: 10000, description: 'Number of integration steps' },
          dt: { type: 'number', default: 0.01, description: 'Time step' },
          x0: { type: 'number', default: 0.1, description: 'Initial x position' },
          y0: { type: 'number', default: 0, description: 'Initial y position' },
          z0: { type: 'number', default: 0, description: 'Initial z position' },
        },
        example: '/api/chaos/lorenz?steps=500&sigma=10&rho=28',
      },
      '/api/chaos/logistic-map': {
        description: 'Generate logistic map bifurcation diagram or time series',
        method: 'GET',
        parameters: {
          mode: { type: 'string', default: 'bifurcation', options: ['bifurcation', 'timeseries'] },
          r: { type: 'number', default: 3.5, description: 'Growth rate parameter (for timeseries)' },
          x0: { type: 'number', default: 0.5, description: 'Initial population (0-1)' },
          r_min: { type: 'number', default: 2.5, description: 'Minimum r value (for bifurcation)' },
          r_max: { type: 'number', default: 4.0, description: 'Maximum r value (for bifurcation)' },
          r_steps: { type: 'number', default: 500, max: 1000, description: 'Number of r values to sample' },
          iterations: { type: 'number', default: 300, description: 'Total iterations' },
          plot_last: { type: 'number', default: 100, description: 'Number of final iterations to record' },
        },
        example: '/api/chaos/logistic-map?mode=timeseries&r=3.7&iterations=100',
      },
      '/api/chaos/double-pendulum': {
        description: 'Simulate double pendulum motion',
        method: 'GET',
        parameters: {
          theta1: { type: 'number', default: 1.0, description: 'Initial angle of first pendulum (radians)' },
          theta2: { type: 'number', default: 2.0, description: 'Initial angle of second pendulum (radians)' },
          omega1: { type: 'number', default: 0, description: 'Initial angular velocity of first pendulum' },
          omega2: { type: 'number', default: 0, description: 'Initial angular velocity of second pendulum' },
          duration: { type: 'number', default: 10, description: 'Simulation duration (seconds)' },
          dt: { type: 'number', default: 0.01, description: 'Time step' },
          m1: { type: 'number', default: 1, description: 'Mass of first pendulum' },
          m2: { type: 'number', default: 1, description: 'Mass of second pendulum' },
          L1: { type: 'number', default: 1, description: 'Length of first pendulum' },
          L2: { type: 'number', default: 1, description: 'Length of second pendulum' },
          g: { type: 'number', default: 9.81, description: 'Gravitational acceleration' },
        },
        example: '/api/chaos/double-pendulum?theta1=1.5&theta2=2.5&duration=5',
      },
      '/api/chaos/mandelbrot': {
        description: 'Generate Mandelbrot set data',
        method: 'GET',
        parameters: {
          width: { type: 'number', default: 800, max: 1920, description: 'Image width' },
          height: { type: 'number', default: 600, max: 1080, description: 'Image height' },
          x_min: { type: 'number', default: -2.5, description: 'Minimum real component' },
          x_max: { type: 'number', default: 1.0, description: 'Maximum real component' },
          y_min: { type: 'number', default: -1.0, description: 'Minimum imaginary component' },
          y_max: { type: 'number', default: 1.0, description: 'Maximum imaginary component' },
          max_iterations: { type: 'number', default: 100, max: 1000, description: 'Maximum iterations' },
        },
        example: '/api/chaos/mandelbrot?width=400&height=300&max_iterations=50',
      },
      '/api/chaos/cellular-automata': {
        description: 'Generate elementary cellular automaton patterns',
        method: 'GET',
        parameters: {
          rule: { type: 'number', default: 30, min: 0, max: 255, description: 'Wolfram rule number' },
          width: { type: 'number', default: 200, max: 500, description: 'Grid width' },
          generations: { type: 'number', default: 100, max: 500, description: 'Number of generations' },
          initial: { type: 'string', default: 'single', options: ['single', 'random'], description: 'Initial pattern' },
        },
        example: '/api/chaos/cellular-automata?rule=110&width=150&generations=150',
      },
    },
    usage: {
      authentication: 'None required (public beta)',
      rate_limit: 'Coming soon',
      cors: 'Enabled for all origins',
    },
    links: {
      documentation: '/docs',
      playground: '/playground',
      github: 'https://github.com/yourusername/caos',
    },
  });
}
