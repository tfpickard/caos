import { NextRequest, NextResponse } from 'next/server';

interface Point {
  t: number;
  x: number;
  v: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const alpha = parseFloat(searchParams.get('alpha') || '-1');
  const beta = parseFloat(searchParams.get('beta') || '1');
  const delta = parseFloat(searchParams.get('delta') || '0.2');
  const gamma = parseFloat(searchParams.get('gamma') || '0.3');
  const omega = parseFloat(searchParams.get('omega') || '1.2');
  const x0 = parseFloat(searchParams.get('x0') || '0.1');
  const v0 = parseFloat(searchParams.get('v0') || '0');
  const duration = parseFloat(searchParams.get('duration') || '100');
  const dt = parseFloat(searchParams.get('dt') || '0.01');

  const steps = Math.floor(duration / dt);
  if (steps > 20000) {
    return NextResponse.json(
      { error: 'Too many steps. Reduce duration or increase dt' },
      { status: 400 }
    );
  }

  const points: Point[] = [];
  let x = x0;
  let v = v0;

  for (let step = 0; step < steps; step++) {
    const t = step * dt;

    if (step % 5 === 0) {
      points.push({ t, x, v });
    }

    // Duffing oscillator: x'' + delta*x' + alpha*x + beta*x^3 = gamma*cos(omega*t)
    // Let v = x', then v' = -delta*v - alpha*x - beta*x^3 + gamma*cos(omega*t)

    const acceleration = -delta * v - alpha * x - beta * Math.pow(x, 3) + gamma * Math.cos(omega * t);

    // RK4 integration
    const k1v = acceleration;
    const k1x = v;

    const v_mid1 = v + k1v * dt / 2;
    const x_mid1 = x + k1x * dt / 2;
    const t_mid1 = t + dt / 2;
    const k2v = -delta * v_mid1 - alpha * x_mid1 - beta * Math.pow(x_mid1, 3) + gamma * Math.cos(omega * t_mid1);
    const k2x = v_mid1;

    const v_mid2 = v + k2v * dt / 2;
    const x_mid2 = x + k2x * dt / 2;
    const t_mid2 = t + dt / 2;
    const k3v = -delta * v_mid2 - alpha * x_mid2 - beta * Math.pow(x_mid2, 3) + gamma * Math.cos(omega * t_mid2);
    const k3x = v_mid2;

    const v_end = v + k3v * dt;
    const x_end = x + k3x * dt;
    const t_end = t + dt;
    const k4v = -delta * v_end - alpha * x_end - beta * Math.pow(x_end, 3) + gamma * Math.cos(omega * t_end);
    const k4x = v_end;

    v += (k1v + 2 * k2v + 2 * k3v + k4v) * dt / 6;
    x += (k1x + 2 * k2x + 2 * k3x + k4x) * dt / 6;
  }

  return NextResponse.json({
    system: 'duffing',
    parameters: { alpha, beta, delta, gamma, omega, x0, v0, dt, duration },
    points,
    metadata: {
      description: 'Duffing oscillator - a nonlinear driven damped oscillator',
      equation: "x'' + δx' + αx + βx³ = γcos(ωt)",
      note: 'Classic chaotic parameters: α=-1, β=1, δ=0.2, γ=0.3, ω=1.2',
      behavior: 'Exhibits period-doubling bifurcations and chaotic attractors',
    },
  });
}
