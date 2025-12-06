import { NextRequest, NextResponse } from 'next/server';

interface Boid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface StateSnapshot {
  t: number;
  boids: { id: number; x: number; y: number; vx: number; vy: number }[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const n = parseInt(searchParams.get('n') || '50');
  const duration = parseFloat(searchParams.get('duration') || '20');
  const dt = parseFloat(searchParams.get('dt') || '0.05');
  const separation = parseFloat(searchParams.get('separation') || '1.5');
  const alignment = parseFloat(searchParams.get('alignment') || '1.0');
  const cohesion = parseFloat(searchParams.get('cohesion') || '1.0');

  if (n < 2 || n > 200) {
    return NextResponse.json({ error: 'n must be between 2 and 200' }, { status: 400 });
  }

  if (duration > 30) {
    return NextResponse.json({ error: 'Duration cannot exceed 30' }, { status: 400 });
  }

  const steps = Math.floor(duration / dt);
  if (steps > 5000) {
    return NextResponse.json({ error: 'Too many steps' }, { status: 400 });
  }

  // Initialize boids
  const boids: Boid[] = [];
  for (let i = 0; i < n; i++) {
    boids.push({
      id: i,
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    });
  }

  const states: StateSnapshot[] = [];
  const sampleInterval = Math.max(1, Math.floor(steps / 500));

  const perceptionRadius = 2.5;
  const maxSpeed = 2.5;
  const maxForce = 0.1;
  const boundarySize = 15;

  for (let step = 0; step < steps; step++) {
    if (step % sampleInterval === 0) {
      states.push({
        t: step * dt,
        boids: boids.map(b => ({ id: b.id, x: b.x, y: b.y, vx: b.vx, vy: b.vy })),
      });
    }

    // Apply Reynolds' boids rules
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];
      let sepX = 0, sepY = 0, sepCount = 0;
      let aliX = 0, aliY = 0, aliCount = 0;
      let cohX = 0, cohY = 0, cohCount = 0;

      for (let j = 0; j < boids.length; j++) {
        if (i === j) continue;

        const other = boids[j];
        const dx = other.x - boid.x;
        const dy = other.y - boid.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < perceptionRadius && dist > 0) {
          // Separation
          if (dist < 1.0) {
            sepX -= dx / (dist * dist);
            sepY -= dy / (dist * dist);
            sepCount++;
          }

          // Alignment
          aliX += other.vx;
          aliY += other.vy;
          aliCount++;

          // Cohesion
          cohX += other.x;
          cohY += other.y;
          cohCount++;
        }
      }

      let ax = 0, ay = 0;

      // Separation
      if (sepCount > 0) {
        sepX /= sepCount;
        sepY /= sepCount;
        const sepMag = Math.sqrt(sepX * sepX + sepY * sepY);
        if (sepMag > 0) {
          sepX = (sepX / sepMag) * maxSpeed - boid.vx;
          sepY = (sepY / sepMag) * maxSpeed - boid.vy;
          ax += sepX * separation;
          ay += sepY * separation;
        }
      }

      // Alignment
      if (aliCount > 0) {
        aliX /= aliCount;
        aliY /= aliCount;
        const aliMag = Math.sqrt(aliX * aliX + aliY * aliY);
        if (aliMag > 0) {
          aliX = (aliX / aliMag) * maxSpeed - boid.vx;
          aliY = (aliY / aliMag) * maxSpeed - boid.vy;
          ax += aliX * alignment;
          ay += aliY * alignment;
        }
      }

      // Cohesion
      if (cohCount > 0) {
        cohX = cohX / cohCount - boid.x;
        cohY = cohY / cohCount - boid.y;
        const cohMag = Math.sqrt(cohX * cohX + cohY * cohY);
        if (cohMag > 0) {
          cohX = (cohX / cohMag) * maxSpeed - boid.vx;
          cohY = (cohY / cohMag) * maxSpeed - boid.vy;
          ax += cohX * cohesion;
          ay += cohY * cohesion;
        }
      }

      // Limit force
      const forceMag = Math.sqrt(ax * ax + ay * ay);
      if (forceMag > maxForce) {
        ax = (ax / forceMag) * maxForce;
        ay = (ay / forceMag) * maxForce;
      }

      // Update velocity
      boid.vx += ax;
      boid.vy += ay;

      // Limit speed
      const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
      if (speed > maxSpeed) {
        boid.vx = (boid.vx / speed) * maxSpeed;
        boid.vy = (boid.vy / speed) * maxSpeed;
      }

      // Update position
      boid.x += boid.vx * dt;
      boid.y += boid.vy * dt;

      // Wrap around boundaries
      if (boid.x > boundarySize) boid.x = -boundarySize;
      if (boid.x < -boundarySize) boid.x = boundarySize;
      if (boid.y > boundarySize) boid.y = -boundarySize;
      if (boid.y < -boundarySize) boid.y = boundarySize;
    }
  }

  return NextResponse.json({
    system: 'boids',
    parameters: { n, separation, alignment, cohesion, dt, duration },
    states,
    metadata: {
      steps: states.length,
      description: "Reynolds' boids flocking algorithm - emergent swarming behavior",
      note: 'Three simple rules (separation, alignment, cohesion) create complex flocking patterns',
    },
  });
}
