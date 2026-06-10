import { getAllPoems } from '@/lib/content';
import PoemsList from '@/components/PoemsList';
import Footer from '@/components/Footer';

export default function PoemsPage() {
  const poems = getAllPoems();


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow px-6 md:px-12 max-w-5xl mx-auto w-full pt-40">
        <header className="mb-32 text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-10 italic font-serif">
            Phir Bhi
          </h1>
          <p className="text-lg md:text-xl font-light text-text-muted max-w-2xl mx-auto leading-relaxed">
            Words gathered in quiet moments. Arranged with breath and spacing.
          </p>
          <div className="h-px w-32 bg-accent-warm/20 mx-auto mt-16" />
        </header>

        <PoemsList poems={poems} />
      </main>

      <Footer />
    </div>
  );
}
