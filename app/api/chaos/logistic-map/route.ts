import { NextRequest, NextResponse } from 'next/server';

interface LogisticPoint {
  r: number;
  x: number;
  iteration: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters
  const mode = searchParams.get('mode') || 'bifurcation'; // 'bifurcation' or 'timeseries'
  const r = parseFloat(searchParams.get('r') || '3.5');
  const x0 = parseFloat(searchParams.get('x0') || '0.5');
  const rMin = parseFloat(searchParams.get('r_min') || '2.5');
  const rMax = parseFloat(searchParams.get('r_max') || '4.0');
  const rSteps = parseInt(searchParams.get('r_steps') || '500');
  const iterations = parseInt(searchParams.get('iterations') || '300');
  const plotLast = parseInt(searchParams.get('plot_last') || '100');

  // Validate parameters
  if (x0 < 0 || x0 > 1) {
    return NextResponse.json(
      { error: 'x0 must be between 0 and 1' },
      { status: 400 }
    );
  }

  if (mode === 'timeseries') {
    // Generate time series for a specific r value
    const points: { iteration: number; x: number }[] = [];
    let x = x0;

    for (let i = 0; i < iterations; i++) {
      points.push({ iteration: i, x });
      x = r * x * (1 - x);
    }

    return NextResponse.json({
      system: 'logistic_map',
      mode: 'timeseries',
      parameters: { r, x0, iterations },
      points,
      metadata: {
        description: 'Time series evolution of the logistic map',
        equation: 'x_{n+1} = r * x_n * (1 - x_n)',
      },
    });
  } else {
    // Generate bifurcation diagram
    if (rSteps > 1000) {
      return NextResponse.json(
        { error: 'r_steps cannot exceed 1000' },
        { status: 400 }
      );
    }

    const points: LogisticPoint[] = [];

    for (let i = 0; i < rSteps; i++) {
      const rVal = rMin + (i / rSteps) * (rMax - rMin);
      let x = x0;

      // Skip transient iterations
      for (let j = 0; j < iterations - plotLast; j++) {
        x = rVal * x * (1 - x);
      }

      // Record the attractor points
      for (let j = 0; j < plotLast; j++) {
        x = rVal * x * (1 - x);
        points.push({ r: rVal, x, iteration: j });
      }
    }

    return NextResponse.json({
      system: 'logistic_map',
      mode: 'bifurcation',
      parameters: { r_min: rMin, r_max: rMax, r_steps: rSteps, iterations, plot_last: plotLast },
      points,
      metadata: {
        description: 'Bifurcation diagram showing the transition to chaos',
        equation: 'x_{n+1} = r * x_n * (1 - x_n)',
        note: 'Notice the period-doubling route to chaos',
      },
    });
  }
}
