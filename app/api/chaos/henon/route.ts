import { NextRequest, NextResponse } from 'next/server';

interface Point {
  x: number;
  y: number;
  n: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const a = parseFloat(searchParams.get('a') || '1.4');
  const b = parseFloat(searchParams.get('b') || '0.3');
  const x0 = parseFloat(searchParams.get('x0') || '0');
  const y0 = parseFloat(searchParams.get('y0') || '0');
  const iterations = parseInt(searchParams.get('iterations') || '10000');

  if (iterations > 50000) {
    return NextResponse.json(
      { error: 'Iterations cannot exceed 50000' },
      { status: 400 }
    );
  }

  const points: Point[] = [];
  let x = x0;
  let y = y0;

  for (let n = 0; n < iterations; n++) {
    points.push({ x, y, n });

    // Hénon map equations
    const xNext = 1 - a * x * x + y;
    const yNext = b * x;

    x = xNext;
    y = yNext;
  }

  return NextResponse.json({
    system: 'henon',
    parameters: { a, b, x0, y0, iterations },
    points,
    metadata: {
      description: 'Hénon attractor - a discrete-time dynamical system exhibiting chaotic behavior',
      equation: 'x_{n+1} = 1 - ax_n^2 + y_n, y_{n+1} = bx_n',
      note: 'Classic parameters a=1.4, b=0.3 produce the iconic strange attractor',
      discovered: 'Michel Hénon, 1976',
    },
  });
}
