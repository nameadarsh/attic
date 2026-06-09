import { getAllVisuals, getAllPoems, getAllJournalEntries } from '@/lib/content';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  const visuals = getAllVisuals();
  const poems = getAllPoems();
  const journalEntries = getAllJournalEntries();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Landing Hero */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-8">
          A personal attic, not a museum.
        </h1>
        <p className="text-xl md:text-2xl font-light text-white/90 max-w-2xl leading-relaxed">
          Poems, photographs, videos and thoughts.<br />
          Things I wanted to keep.
        </p>
        
        <div className="mt-16 max-w-lg text-base font-light text-text-muted leading-relaxed">
          This is a quiet corner of the internet. A collection of fragments gathered over time. No noise, no metrics, just memory.
        </div>
      </section>

      <Navbar />

      {/* Sections reveal on scroll */}
      <div className="space-y-48 pb-48">
        <SectionPreview 
          title="Visuals" 
          href="/visuals" 
          items={visuals.slice(0, 3)} 
          renderItem={(item: any) => (
            <div className="w-[300px] md:w-[450px] aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden flex-shrink-0 group relative">
              {item.type === 'video' ? (
                <video 
                  src={`/media/${item.filename}`}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: `rotate(${item.rotation || 0}deg)` }}
                />
              ) : (
                <img 
                  src={`/media/${item.filename}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ transform: `rotate(${item.rotation || 0}deg)` }}
                />
              )}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
                <span className="text-base font-light text-white">{item.title}</span>
              </div>
            </div>
          )}
        />

        <SectionPreview 
          title="Poems" 
          href="/poems" 
          items={poems.slice(0, 3)} 
          renderItem={(item) => (
            <div className="w-[300px] md:w-[380px] aspect-[3/4] p-10 border border-white/10 bg-white/[0.03] rounded-sm flex-shrink-0 flex flex-col group hover:border-white/20 transition-colors duration-700">
              <h3 className="text-xl font-light text-white/95 mb-6">{item.title}</h3>
              <p className="text-base font-light text-text-muted line-clamp-8 leading-relaxed italic font-serif">
                {item.content}
              </p>
            </div>
          )}
        />

        <SectionPreview 
          title="Hero Kaun" 
          href="/hero-kaun" 
          items={journalEntries.slice(0, 3)} 
          renderItem={(item) => (
            <div className="w-[320px] md:w-[420px] p-8 border border-white/10 bg-black rounded-sm flex-shrink-0 font-mono group hover:border-white/30 transition-colors duration-700">
              <div className="text-xs text-text-dim mb-4 uppercase tracking-widest">{item.date}</div>
              <h3 className="text-base font-light text-white/90 mb-4 group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-sm text-text-muted line-clamp-4 leading-relaxed">
                {item.content}
              </p>
            </div>
          )}
        />
      </div>

      <Footer />
    </div>
  );
}

function SectionPreview({ 
  title, 
  href, 
  items, 
  renderItem 
}: { 
  title: string, 
  href: string, 
  items: any[], 
  renderItem: (item: any) => React.ReactNode 
}) {
  return (
    <section className="px-6 md:px-12">
      <div className="flex items-baseline justify-between mb-8">
        <Link href={href} className="group flex items-baseline gap-3">
          <h2 className="text-xl font-light text-white/50 group-hover:text-white transition-colors duration-500 uppercase tracking-[0.2em]">
            {title}
          </h2>
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        {items.map((item, i) => (
          <div key={item.slug || i}>
            {renderItem(item)}
          </div>
        ))}
        
        {/* See All card */}
        <Link 
          href={href}
          className="flex-shrink-0 w-[150px] flex flex-col items-center justify-center border border-dashed border-white/5 hover:border-white/20 hover:bg-white/[0.01] transition-all duration-500 rounded-sm group"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white/60">See All</span>
        </Link>
      </div>
    </section>
  );
}
