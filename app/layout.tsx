import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAOS - Chaotic Algorithms Operating Service",
  description: "Chaos as a Service - Generate deterministic chaos through beautiful algorithms, simulations, and visualizations",
  keywords: ["chaos theory", "lorenz attractor", "strange attractors", "chaos api", "chaotic systems", "fractals"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {children}
      </body>
    </html>
  );
}
