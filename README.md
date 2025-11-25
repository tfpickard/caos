# CAOS - Chaotic Algorithms Operating Service

> **C**haotic **A**lgorithms **O**perating **S**ervice

A beautiful, feature-rich chaos-as-a-service platform offering deterministic chaotic systems through a clean API and interactive visualizations.

## 🌀 What is CAOS?

CAOS brings the fascinating world of chaos theory to your fingertips. Unlike random number generators, CAOS provides truly chaotic systems - deterministic, sensitive to initial conditions, yet perfectly reproducible.

## ✨ Features

### Chaotic Systems
- **Lorenz Attractor** - The iconic strange attractor with butterfly-like structure
- **Logistic Map** - Period-doubling route to chaos and bifurcation diagrams
- **Double Pendulum** - Classic demonstration of sensitive dependence
- **Mandelbrot Set** - Infinite fractal complexity from simple equations
- **Cellular Automata** - Elementary rules producing complex patterns

### Interactive Tools
- 🎨 **Real-time Visualizations** - Beautiful canvas-based animations
- 🎮 **Playground** - Experiment with parameters in real-time
- 📚 **API Documentation** - Complete with live examples
- 🚀 **RESTful APIs** - Simple GET requests, JSON responses

## 🚀 Quick Start

### API Usage

No authentication required during beta. Simply make GET requests:

```bash
# Generate Lorenz attractor data
curl https://caos.vercel.app/api/chaos/lorenz?steps=500&sigma=10&rho=28

# Create bifurcation diagram
curl https://caos.vercel.app/api/chaos/logistic-map?mode=bifurcation&r_steps=500

# Simulate double pendulum
curl https://caos.vercel.app/api/chaos/double-pendulum?theta1=1.5&theta2=2.5&duration=10

# Generate Mandelbrot set
curl https://caos.vercel.app/api/chaos/mandelbrot?width=400&height=300

# Cellular automata patterns
curl https://caos.vercel.app/api/chaos/cellular-automata?rule=110&width=200
```

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📖 API Endpoints

### `/api/chaos/lorenz`
Generate Lorenz attractor trajectories using RK4 integration.

**Parameters:**
- `sigma` (default: 10) - Prandtl number
- `rho` (default: 28) - Rayleigh number
- `beta` (default: 2.667) - Geometric factor
- `steps` (default: 1000, max: 10000) - Integration steps
- `dt` (default: 0.01) - Time step

### `/api/chaos/logistic-map`
Generate logistic map bifurcation diagrams or time series.

**Parameters:**
- `mode` (default: "bifurcation") - "bifurcation" or "timeseries"
- `r` (default: 3.5) - Growth rate parameter
- `r_min` (default: 2.5) - Min r value (bifurcation mode)
- `r_max` (default: 4.0) - Max r value (bifurcation mode)
- `iterations` (default: 300) - Total iterations

### `/api/chaos/double-pendulum`
Simulate chaotic double pendulum motion.

**Parameters:**
- `theta1`, `theta2` - Initial angles (radians)
- `omega1`, `omega2` - Initial angular velocities
- `duration` (default: 10) - Simulation time (seconds)
- `m1`, `m2`, `L1`, `L2` - Mass and length parameters

### `/api/chaos/mandelbrot`
Generate Mandelbrot set iteration data.

**Parameters:**
- `width`, `height` (max: 1920x1080) - Resolution
- `x_min`, `x_max`, `y_min`, `y_max` - Complex plane bounds
- `max_iterations` (max: 1000) - Escape threshold

### `/api/chaos/cellular-automata`
Generate elementary cellular automaton patterns.

**Parameters:**
- `rule` (0-255) - Wolfram rule number
- `width` (max: 500) - Grid width
- `generations` (max: 500) - Evolution steps
- `initial` ("single" or "random") - Initial pattern

## 🎨 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Canvas API** - Real-time visualizations
- **Vercel** - Deployment platform

## 🧮 Mathematical Background

### Lorenz System
```
dx/dt = σ(y - x)
dy/dt = x(ρ - z) - y
dz/dt = xy - βz
```

### Logistic Map
```
x_{n+1} = r · x_n · (1 - x_n)
```

### Mandelbrot Set
```
z_{n+1} = z_n² + c
```

## 🌟 Use Cases

- **Education** - Teach chaos theory and nonlinear dynamics
- **Research** - Generate data for scientific analysis
- **Art** - Create beautiful chaotic visualizations
- **Testing** - Deterministic pseudo-random sequences
- **Demos** - Showcase complex mathematical concepts

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! This is an educational project exploring the beauty of chaos theory.

## 🔗 Links

- **Documentation**: /docs
- **Playground**: /playground

---

*"Chaos: When the present determines the future, but the approximate present does not approximately determine the future."* - Edward Lorenz