import { getAllVisuals } from '@/lib/content';
import VisualsGrid from '@/components/VisualsGrid';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function VisualsPage() {
  const visuals = getAllVisuals();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-grow px-6 md:px-12 max-w-[1800px] mx-auto w-full pt-32">
        <header className="mb-32 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
            Visuals
          </h1>
          <p className="text-base font-light text-white/50 max-w-lg leading-relaxed">
            A collection of moments captured in light and motion. Chronological, quiet, and kept.
          </p>
        </header>

        <VisualsGrid visuals={visuals} />
      </main>

      <Footer />
    </div>
  );
}
