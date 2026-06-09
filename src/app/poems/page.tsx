import { getAllPoems } from '@/lib/content';
import PoemsList from '@/components/PoemsList';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function PoemsPage() {
  const poems = getAllPoems();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-grow px-6 md:px-12 max-w-5xl mx-auto w-full pt-32">
        <header className="mb-32 text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-8 italic font-serif">
            Poems
          </h1>
          <p className="text-base font-light text-white/50 max-w-lg mx-auto leading-relaxed">
            Words gathered in quiet moments. Arranged with breath and spacing.
          </p>
          <div className="h-px w-32 bg-white/10 mx-auto mt-16" />
        </header>

        <PoemsList poems={poems} />
      </main>

      <Footer />
    </div>
  );
}
