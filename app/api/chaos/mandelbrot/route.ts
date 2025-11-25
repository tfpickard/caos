import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '600');
  const xMin = parseFloat(searchParams.get('x_min') || '-2.5');
  const xMax = parseFloat(searchParams.get('x_max') || '1.0');
  const yMin = parseFloat(searchParams.get('y_min') || '-1.0');
  const yMax = parseFloat(searchParams.get('y_max') || '1.0');
  const maxIterations = parseInt(searchParams.get('max_iterations') || '100');
  const format = searchParams.get('format') || 'array'; // 'array' or 'base64'

  // Validate parameters
  if (width > 1920 || height > 1080) {
    return NextResponse.json(
      { error: 'Maximum dimensions are 1920x1080' },
      { status: 400 }
    );
  }

  if (maxIterations > 1000) {
    return NextResponse.json(
      { error: 'max_iterations cannot exceed 1000' },
      { status: 400 }
    );
  }

  // Generate Mandelbrot set
  const data: number[][] = [];

  for (let py = 0; py < height; py++) {
    const row: number[] = [];
    const y = yMin + (py / height) * (yMax - yMin);

    for (let px = 0; px < width; px++) {
      const x = xMin + (px / width) * (xMax - xMin);

      let zx = 0;
      let zy = 0;
      let iteration = 0;

      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + x;
        zy = 2 * zx * zy + y;
        zx = xtemp;
        iteration++;
      }

      row.push(iteration);
    }
    data.push(row);
  }

  if (format === 'base64') {
    // Convert to grayscale PNG (simplified - in production use a proper image library)
    return NextResponse.json({
      system: 'mandelbrot',
      parameters: { width, height, x_min: xMin, x_max: xMax, y_min: yMin, y_max: yMax, max_iterations: maxIterations },
      format: 'array',
      data,
      metadata: {
        description: 'The Mandelbrot set - infinite complexity from a simple equation',
        equation: 'z_{n+1} = z_n^2 + c',
        note: 'Values represent iteration count before divergence',
      },
    });
  }

  return NextResponse.json({
    system: 'mandelbrot',
    parameters: { width, height, x_min: xMin, x_max: xMax, y_min: yMin, y_max: yMax, max_iterations: maxIterations },
    format: 'array',
    data,
    metadata: {
      description: 'The Mandelbrot set - infinite complexity from a simple equation',
      equation: 'z_{n+1} = z_n^2 + c',
      note: 'Values represent iteration count before divergence. Higher values = closer to the set',
    },
  });
}
