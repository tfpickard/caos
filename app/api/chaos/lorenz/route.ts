import { NextRequest, NextResponse } from 'next/server';

interface Point3D {
  x: number;
  y: number;
  z: number;
  t: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters with defaults
  const sigma = parseFloat(searchParams.get('sigma') || '10');
  const rho = parseFloat(searchParams.get('rho') || '28');
  const beta = parseFloat(searchParams.get('beta') || '2.667');
  const steps = parseInt(searchParams.get('steps') || '1000');
  const dt = parseFloat(searchParams.get('dt') || '0.01');
  const x0 = parseFloat(searchParams.get('x0') || '0.1');
  const y0 = parseFloat(searchParams.get('y0') || '0');
  const z0 = parseFloat(searchParams.get('z0') || '0');

  // Validate parameters
  if (steps > 10000) {
    return NextResponse.json(
      { error: 'Steps cannot exceed 10000' },
      { status: 400 }
    );
  }

  if (dt <= 0 || dt > 1) {
    return NextResponse.json(
      { error: 'dt must be between 0 and 1' },
      { status: 400 }
    );
  }

  // Generate Lorenz attractor data
  const points: Point3D[] = [];
  let x = x0;
  let y = y0;
  let z = z0;

  for (let i = 0; i < steps; i++) {
    points.push({ x, y, z, t: i * dt });

    // Lorenz equations using RK4 method for better accuracy
    const k1x = sigma * (y - x);
    const k1y = x * (rho - z) - y;
    const k1z = x * y - beta * z;

    const k2x = sigma * ((y + dt * k1y / 2) - (x + dt * k1x / 2));
    const k2y = (x + dt * k1x / 2) * (rho - (z + dt * k1z / 2)) - (y + dt * k1y / 2);
    const k2z = (x + dt * k1x / 2) * (y + dt * k1y / 2) - beta * (z + dt * k1z / 2);

    const k3x = sigma * ((y + dt * k2y / 2) - (x + dt * k2x / 2));
    const k3y = (x + dt * k2x / 2) * (rho - (z + dt * k2z / 2)) - (y + dt * k2y / 2);
    const k3z = (x + dt * k2x / 2) * (y + dt * k2y / 2) - beta * (z + dt * k2z / 2);

    const k4x = sigma * ((y + dt * k3y) - (x + dt * k3x));
    const k4y = (x + dt * k3x) * (rho - (z + dt * k3z)) - (y + dt * k3y);
    const k4z = (x + dt * k3x) * (y + dt * k3y) - beta * (z + dt * k3z);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    z += (dt / 6) * (k1z + 2 * k2z + 2 * k3z + k4z);
  }

  return NextResponse.json({
    system: 'lorenz',
    parameters: { sigma, rho, beta, dt },
    initial_conditions: { x0, y0, z0 },
    points,
    metadata: {
      steps: points.length,
      description: 'The Lorenz attractor is a set of chaotic solutions to the Lorenz system',
    },
  });
}
