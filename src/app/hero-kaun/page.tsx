import { getAllJournalEntries } from '@/lib/content';
import JournalList from '@/components/JournalList';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function HeroKaunPage() {
  const entries = getAllJournalEntries();

  return (
    <div className="min-h-screen bg-black text-white/80 font-mono flex flex-col selection:bg-white/20">
      <Navbar />
      <main className="flex-grow px-6 md:px-12 max-w-4xl mx-auto w-full pt-32">
        <header className="mb-48 border-b border-white/10 pb-20">
          <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white uppercase mb-10">
            Hero Kaun
          </h1>
          <p className="text-sm font-light text-white/40 max-w-xl leading-relaxed uppercase tracking-[0.4em]">
            Stored logs of a lived life. Digital fragments of analog memories.
          </p>
        </header>

        <JournalList entries={entries} />
      </main>

      <Footer />
    </div>
  );
}
