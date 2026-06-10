import { getAllVisuals, getAllPoems, getAllJournalEntries } from '@/lib/content';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  const visuals = getAllVisuals();

  const poems = getAllPoems();
  const journalEntries = getAllJournalEntries();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />{/* Sections reveal on scroll */}
      <div className="space-y-48 pb-48">
        <SectionPreview 
          title="Falling Trees" 
          href="/FallingTrees" 
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
          title="Phir Bhi" 
          href="/PhirBhi" 
          items={poems.slice(0, 3)} 
          renderItem={(item) => (
            <div className="w-[300px] md:w-[380px] aspect-[3/4] p-10 border border-white/10 bg-white/[0.03] rounded-sm flex-shrink-0 flex flex-col group hover:border-accent-warm/20 transition-all duration-700">
              <h3 className="text-xl font-light text-white mb-6 group-hover:text-accent-warm transition-colors duration-500">{item.title}</h3>
              <p className="text-base font-light text-text-muted line-clamp-8 leading-relaxed italic font-serif group-hover:text-white/90 transition-colors duration-500">
                {item.content}
              </p>
            </div>
          )}
        />

        <SectionPreview 
          title="Hero Kaun" 
          href="/HeroKaun" 
          items={journalEntries.slice(0, 3)} 
          renderItem={(item) => (
            <div className="w-[320px] md:w-[420px] p-8 border border-white/10 bg-black rounded-sm flex-shrink-0 font-mono group hover:border-accent-warm/20 transition-all duration-700">
              <div className="text-xs text-text-dim mb-4 uppercase tracking-widest">{item.date}</div>
              <h3 className="text-base font-light text-white mb-4 group-hover:text-accent-warm transition-colors duration-500">{item.title}</h3>
              <p className="text-sm text-text-muted line-clamp-4 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
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
    <section className="px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-12">
        <Link href={href} className="group flex items-baseline gap-4">
          <h2 className="text-2xl font-light text-white/40 group-hover:text-white transition-colors duration-500 uppercase tracking-[0.3em]">
            {title}
          </h2>
          <span className="h-px w-12 bg-white/10 group-hover:w-24 group-hover:bg-accent-warm transition-all duration-700" />
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
          className="flex-shrink-0 w-[180px] flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-accent-warm/40 hover:bg-accent-warm/[0.02] transition-all duration-700 rounded-sm group relative overflow-hidden"
        >
          <span className="text-[11px] uppercase tracking-[0.4em] text-text-muted group-hover:text-white transition-colors duration-500 z-10">
            See All
          </span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent-warm/5 to-transparent transition-opacity duration-700" />
        </Link>
      </div>
    </section>
  );
}
