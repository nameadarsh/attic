import { getAllJournalEntries } from '@/lib/content';
import JournalList from '@/components/JournalList';
import Footer from '@/components/Footer';

export default function HeroKaunPage() {
  const entries = getAllJournalEntries();


  return (
    <div className="min-h-screen font-mono flex flex-col selection:bg-white/20">
      <main className="flex-grow px-6 md:px-12 max-w-4xl mx-auto w-full pt-40">
        <header className="mb-32 border-b border-white/10 pb-20">
          <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white uppercase mb-10">
            Hero Kaun
          </h1>
          <p className="text-base md:text-lg font-light text-text-muted max-w-2xl leading-relaxed uppercase tracking-[0.4em]">
            Stored logs of a lived life. Digital fragments of analog memories.
          </p>
        </header>

        <JournalList entries={entries} />
      </main>

      <Footer />
    </div>
  );
}
