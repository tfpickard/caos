import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters
  const rule = parseInt(searchParams.get('rule') || '30');
  const width = parseInt(searchParams.get('width') || '200');
  const generations = parseInt(searchParams.get('generations') || '100');
  const initialPattern = searchParams.get('initial') || 'single'; // 'single', 'random', 'custom'

  // Validate parameters
  if (rule < 0 || rule > 255) {
    return NextResponse.json(
      { error: 'Rule must be between 0 and 255' },
      { status: 400 }
    );
  }

  if (width > 500 || generations > 500) {
    return NextResponse.json(
      { error: 'Maximum width and generations are 500' },
      { status: 400 }
    );
  }

  // Convert rule number to binary lookup table
  const ruleBinary = rule.toString(2).padStart(8, '0');
  const ruleTable: { [key: string]: number } = {
    '111': parseInt(ruleBinary[0]),
    '110': parseInt(ruleBinary[1]),
    '101': parseInt(ruleBinary[2]),
    '100': parseInt(ruleBinary[3]),
    '011': parseInt(ruleBinary[4]),
    '010': parseInt(ruleBinary[5]),
    '001': parseInt(ruleBinary[6]),
    '000': parseInt(ruleBinary[7]),
  };

  // Initialize first generation
  let current: number[] = new Array(width).fill(0);

  if (initialPattern === 'single') {
    current[Math.floor(width / 2)] = 1;
  } else if (initialPattern === 'random') {
    current = current.map(() => (Math.random() > 0.5 ? 1 : 0));
  }

  const grid: number[][] = [current.slice()];

  // Generate subsequent generations
  for (let gen = 1; gen < generations; gen++) {
    const next: number[] = new Array(width).fill(0);

    for (let i = 0; i < width; i++) {
      const left = current[(i - 1 + width) % width];
      const center = current[i];
      const right = current[(i + 1) % width];

      const key = `${left}${center}${right}`;
      next[i] = ruleTable[key];
    }

    grid.push(next);
    current = next;
  }

  return NextResponse.json({
    system: 'cellular_automata',
    type: 'elementary',
    parameters: {
      rule,
      width,
      generations,
      initial_pattern: initialPattern,
    },
    grid,
    metadata: {
      description: `Elementary cellular automaton Rule ${rule}`,
      note: 'Rule 30 is chaotic, Rule 110 is Turing complete, Rule 90 creates Sierpinski triangles',
      famous_rules: {
        30: 'Chaotic - used in random number generation',
        90: 'Sierpinski triangle pattern',
        110: 'Turing complete - can perform universal computation',
        184: 'Traffic flow model',
      },
    },
  });
}
