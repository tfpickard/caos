import { NextRequest, NextResponse } from 'next/server';

interface PendulumState {
  t: number;
  theta1: number;
  theta2: number;
  omega1: number;
  omega2: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters
  const theta1_0 = parseFloat(searchParams.get('theta1') || '1.0');
  const theta2_0 = parseFloat(searchParams.get('theta2') || '2.0');
  const omega1_0 = parseFloat(searchParams.get('omega1') || '0');
  const omega2_0 = parseFloat(searchParams.get('omega2') || '0');
  const duration = parseFloat(searchParams.get('duration') || '10');
  const dt = parseFloat(searchParams.get('dt') || '0.01');
  const m1 = parseFloat(searchParams.get('m1') || '1');
  const m2 = parseFloat(searchParams.get('m2') || '1');
  const L1 = parseFloat(searchParams.get('L1') || '1');
  const L2 = parseFloat(searchParams.get('L2') || '1');
  const g = parseFloat(searchParams.get('g') || '9.81');

  const steps = Math.floor(duration / dt);

  // Validate parameters
  if (steps > 10000) {
    return NextResponse.json(
      { error: 'Duration and dt would result in too many steps (max 10000)' },
      { status: 400 }
    );
  }

  // Simulate double pendulum using RK4
  const states: PendulumState[] = [];
  let theta1 = theta1_0;
  let theta2 = theta2_0;
  let omega1 = omega1_0;
  let omega2 = omega2_0;

  for (let i = 0; i < steps; i++) {
    const t = i * dt;

    // Calculate Cartesian coordinates for visualization
    const x1 = L1 * Math.sin(theta1);
    const y1 = -L1 * Math.cos(theta1);
    const x2 = x1 + L2 * Math.sin(theta2);
    const y2 = y1 - L2 * Math.cos(theta2);

    states.push({
      t,
      theta1,
      theta2,
      omega1,
      omega2,
      x1,
      y1,
      x2,
      y2,
    });

    // RK4 integration
    const k1 = derivatives(theta1, theta2, omega1, omega2, m1, m2, L1, L2, g);
    const k2 = derivatives(
      theta1 + dt * k1.dtheta1 / 2,
      theta2 + dt * k1.dtheta2 / 2,
      omega1 + dt * k1.domega1 / 2,
      omega2 + dt * k1.domega2 / 2,
      m1,
      m2,
      L1,
      L2,
      g
    );
    const k3 = derivatives(
      theta1 + dt * k2.dtheta1 / 2,
      theta2 + dt * k2.dtheta2 / 2,
      omega1 + dt * k2.domega1 / 2,
      omega2 + dt * k2.domega2 / 2,
      m1,
      m2,
      L1,
      L2,
      g
    );
    const k4 = derivatives(
      theta1 + dt * k3.dtheta1,
      theta2 + dt * k3.dtheta2,
      omega1 + dt * k3.domega1,
      omega2 + dt * k3.domega2,
      m1,
      m2,
      L1,
      L2,
      g
    );

    theta1 += (dt / 6) * (k1.dtheta1 + 2 * k2.dtheta1 + 2 * k3.dtheta1 + k4.dtheta1);
    theta2 += (dt / 6) * (k1.dtheta2 + 2 * k2.dtheta2 + 2 * k3.dtheta2 + k4.dtheta2);
    omega1 += (dt / 6) * (k1.domega1 + 2 * k2.domega1 + 2 * k3.domega1 + k4.domega1);
    omega2 += (dt / 6) * (k1.domega2 + 2 * k2.domega2 + 2 * k3.domega2 + k4.domega2);
  }

  return NextResponse.json({
    system: 'double_pendulum',
    parameters: { m1, m2, L1, L2, g, dt },
    initial_conditions: {
      theta1: theta1_0,
      theta2: theta2_0,
      omega1: omega1_0,
      omega2: omega2_0,
    },
    states,
    metadata: {
      steps: states.length,
      duration,
      description: 'Double pendulum simulation showing sensitive dependence on initial conditions',
      note: 'Try small changes in initial angles to see dramatically different outcomes',
    },
  });
}

function derivatives(
  theta1: number,
  theta2: number,
  omega1: number,
  omega2: number,
  m1: number,
  m2: number,
  L1: number,
  L2: number,
  g: number
) {
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

  return {
    dtheta1: omega1,
    dtheta2: omega2,
    domega1,
    domega2,
  };
}
