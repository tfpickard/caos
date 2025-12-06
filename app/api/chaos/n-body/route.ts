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
  bodies: { id: number; x: number; y: number; vx: number; vy: number; mass: number }[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const n = parseInt(searchParams.get('n') || '5');
  const duration = parseFloat(searchParams.get('duration') || '20');
  const dt = parseFloat(searchParams.get('dt') || '0.001');
  const G = parseFloat(searchParams.get('G') || '1');
  const preset = searchParams.get('preset') || 'random';

  if (n < 2 || n > 20) {
    return NextResponse.json({ error: 'n must be between 2 and 20' }, { status: 400 });
  }

  if (duration > 50) {
    return NextResponse.json({ error: 'Duration cannot exceed 50' }, { status: 400 });
  }

  const steps = Math.floor(duration / dt);
  if (steps > 30000) {
    return NextResponse.json({ error: 'Too many steps' }, { status: 400 });
  }

  let bodies: Body[] = [];

  if (preset === 'random') {
    // Random initial conditions
    for (let i = 0; i < n; i++) {
      bodies.push({
        id: i,
        mass: 0.5 + Math.random() * 1.5,
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  } else if (preset === 'circular') {
    // Bodies in circular orbit
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const radius = 2;
      const speed = 0.5;
      bodies.push({
        id: i,
        mass: 1,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        vx: -speed * Math.sin(angle),
        vy: speed * Math.cos(angle),
      });
    }
  } else if (preset === 'collision') {
    // Two clusters heading toward each other
    const halfN = Math.floor(n / 2);
    for (let i = 0; i < halfN; i++) {
      bodies.push({
        id: i,
        mass: 1,
        x: -2 + (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 1.5,
        vx: 0.3,
        vy: 0,
      });
    }
    for (let i = halfN; i < n; i++) {
      bodies.push({
        id: i,
        mass: 1,
        x: 2 + (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 1.5,
        vx: -0.3,
        vy: 0,
      });
    }
  }

  const states: StateSnapshot[] = [];
  const sampleInterval = Math.max(1, Math.floor(steps / 1500));

  for (let step = 0; step < steps; step++) {
    if (step % sampleInterval === 0) {
      states.push({
        t: step * dt,
        bodies: bodies.map(b => ({ id: b.id, x: b.x, y: b.y, vx: b.vx, vy: b.vy, mass: b.mass })),
      });
    }

    // Calculate accelerations
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

    // Update velocities and positions
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].vx += accelerations[i].ax * dt;
      bodies[i].vy += accelerations[i].ay * dt;
      bodies[i].x += bodies[i].vx * dt;
      bodies[i].y += bodies[i].vy * dt;
    }
  }

  return NextResponse.json({
    system: 'n_body',
    parameters: { n, G, dt, duration, preset },
    states,
    metadata: {
      steps: states.length,
      description: `${n}-body gravitational simulation`,
      presets: {
        random: 'Random initial conditions',
        circular: 'Circular orbital configuration',
        collision: 'Two clusters colliding',
      },
    },
  });
}
