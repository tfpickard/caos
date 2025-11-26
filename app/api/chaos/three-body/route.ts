import { NextRequest, NextResponse } from 'next/server';

interface Body {
  id: number;
  mass: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface StateSnapshot {
  t: number;
  bodies: {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  }[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters
  const duration = parseFloat(searchParams.get('duration') || '20');
  const dt = parseFloat(searchParams.get('dt') || '0.001');
  const G = parseFloat(searchParams.get('G') || '1'); // Gravitational constant

  // Initial conditions for bodies (can be customized)
  const preset = searchParams.get('preset') || 'figure8';

  // Validate parameters
  if (duration > 100) {
    return NextResponse.json(
      { error: 'Duration cannot exceed 100 time units' },
      { status: 400 }
    );
  }

  const steps = Math.floor(duration / dt);
  if (steps > 50000) {
    return NextResponse.json(
      { error: 'Too many steps. Reduce duration or increase dt' },
      { status: 400 }
    );
  }

  // Initialize bodies based on preset
  let bodies: Body[] = [];

  switch (preset) {
    case 'figure8':
      // Famous figure-8 solution discovered by Chenciner and Montgomery
      bodies = [
        { id: 1, mass: 1, x: 0.97000436, y: -0.24308753, vx: 0.466203685, vy: 0.43236573 },
        { id: 2, mass: 1, x: -0.97000436, y: 0.24308753, vx: 0.466203685, vy: 0.43236573 },
        { id: 3, mass: 1, x: 0, y: 0, vx: -0.93240737, vy: -0.86473146 },
      ];
      break;

    case 'lagrange':
      // Lagrange triangular solution
      bodies = [
        { id: 1, mass: 1, x: -0.5, y: -0.288675, vx: 0.5, vy: -0.866025 },
        { id: 2, mass: 1, x: 0.5, y: -0.288675, vx: 0.5, vy: 0.866025 },
        { id: 3, mass: 1, x: 0, y: 0.57735, vx: -1, vy: 0 },
      ];
      break;

    case 'butterfly':
      // Butterfly I orbit
      bodies = [
        { id: 1, mass: 1, x: -1, y: 0, vx: 0.347111, vy: 0.532728 },
        { id: 2, mass: 1, x: 1, y: 0, vx: 0.347111, vy: 0.532728 },
        { id: 3, mass: 1, x: 0, y: 0, vx: -0.694222, vy: -1.065456 },
      ];
      break;

    case 'random':
      // Random chaotic configuration
      bodies = [
        { id: 1, mass: 1, x: -1, y: 0, vx: 0, vy: 0.5 },
        { id: 2, mass: 1, x: 1, y: 0, vx: 0, vy: -0.5 },
        { id: 3, mass: 1, x: 0, y: 1.5, vx: -0.3, vy: 0 },
      ];
      break;

    default:
      // Default: simple triangle
      bodies = [
        { id: 1, mass: 1, x: -1, y: 0, vx: 0, vy: 0.5 },
        { id: 2, mass: 1, x: 1, y: 0, vx: 0, vy: -0.5 },
        { id: 3, mass: 1, x: 0, y: 1, vx: -0.3, vy: 0 },
      ];
  }

  // Simulation using velocity Verlet integration
  const states: StateSnapshot[] = [];
  const sampleInterval = Math.max(1, Math.floor(steps / 2000)); // Sample to keep data manageable

  for (let step = 0; step < steps; step++) {
    // Record state at intervals
    if (step % sampleInterval === 0) {
      states.push({
        t: step * dt,
        bodies: bodies.map(b => ({
          id: b.id,
          x: b.x,
          y: b.y,
          vx: b.vx,
          vy: b.vy,
        })),
      });
    }

    // Calculate accelerations
    const accelerations = bodies.map(() => ({ ax: 0, ay: 0 }));

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const dx = bodies[j].x - bodies[i].x;
        const dy = bodies[j].y - bodies[i].y;
        const r = Math.sqrt(dx * dx + dy * dy);

        // Prevent singularity with softening parameter
        const r3 = Math.max(r * r * r, 0.001);

        const fx = G * dx / r3;
        const fy = G * dy / r3;

        accelerations[i].ax += bodies[j].mass * fx;
        accelerations[i].ay += bodies[j].mass * fy;
        accelerations[j].ax -= bodies[i].mass * fx;
        accelerations[j].ay -= bodies[i].mass * fy;
      }
    }

    // Update velocities (half step)
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].vx += accelerations[i].ax * dt * 0.5;
      bodies[i].vy += accelerations[i].ay * dt * 0.5;
    }

    // Update positions
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].x += bodies[i].vx * dt;
      bodies[i].y += bodies[i].vy * dt;
    }

    // Recalculate accelerations at new positions
    accelerations.forEach(a => { a.ax = 0; a.ay = 0; });

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

    // Update velocities (half step)
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].vx += accelerations[i].ax * dt * 0.5;
      bodies[i].vy += accelerations[i].ay * dt * 0.5;
    }
  }

  return NextResponse.json({
    system: 'three_body',
    parameters: { G, dt, duration, preset },
    states,
    metadata: {
      steps: states.length,
      description: 'Three-body gravitational system - a classic example of deterministic chaos',
      note: 'The three-body problem has no general closed-form solution and exhibits sensitive dependence on initial conditions',
      presets: {
        figure8: 'The famous figure-8 periodic orbit',
        lagrange: 'Lagrange triangular solution (stable)',
        butterfly: 'Butterfly I choreography',
        random: 'Chaotic configuration',
      },
    },
  });
}
