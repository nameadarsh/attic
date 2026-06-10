import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GalaxyBackground from "@/components/GalaxyBackground";

export const metadata: Metadata = {
  title: "ATTIC",
  description: "A personal attic, not a museum.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen selection:bg-accent-warm/30">
        <GalaxyBackground />
        <div className="grain-overlay" />
        <main className="relative z-10">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
