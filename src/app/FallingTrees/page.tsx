import { getAllVisuals } from '@/lib/content';
import VisualsGrid from '@/components/VisualsGrid';
import Footer from '@/components/Footer';

export default function VisualsPage() {
  const visuals = getAllVisuals();


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow px-6 md:px-12 max-w-[1600px] mx-auto w-full pt-40">      <header className="mb-32 text-center md:text-left max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-8">
            Falling Trees
          </h1>
          <p className="text-lg md:text-xl font-light text-text-muted leading-relaxed max-w-2xl">
            A collection of moments captured in light and motion. Chronological, quiet, and kept.
          </p>
          <div className="h-px w-24 bg-accent-warm/30 mt-12 hidden md:block" />
        </header>

        <VisualsGrid visuals={visuals} />
      </main>

      <Footer />
    </div>
  );
}
