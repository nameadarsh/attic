'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import JournalReader from '@/components/JournalReader';
import { JournalMetadata } from '@/types';

interface JournalListProps {
  entries: JournalMetadata[];
}

export default function JournalList({ entries }: JournalListProps) {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : undefined;
  const selectedEntry = slug ? entries.find((e) => e.slug === slug) ?? null : null;

  const openEntry = (entry: JournalMetadata) => {
    router.push(`/HeroKaun/${entry.slug}`);
  };

  const closeEntry = () => {
    router.push('/HeroKaun');
  };

  return (
    <>
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.8 }}
            onClick={() => openEntry(entry)}
            className="group cursor-pointer py-8 md:py-10 flex items-center justify-between border-b border-white/[0.05] hover:border-accent-warm/20 transition-all duration-700 px-4 -mx-4 rounded-sm hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-8 md:gap-16">
              <span className="text-xs text-text-dim tracking-widest w-24 flex-shrink-0 group-hover:text-text-muted transition-colors duration-500">{entry.date}</span>
              <h2 className="text-lg md:text-xl font-light text-white group-hover:text-accent-warm transition-colors duration-500">
                {entry.title}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-dim group-hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                Open Log
              </span>
              <div className="w-8 h-px bg-white/10 group-hover:bg-accent-warm group-hover:w-12 transition-all duration-700" />
            </div>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div className="py-32 text-center text-white/10 text-xs tracking-widest uppercase">
            No logs found in current directory.
          </div>
        )}
      </div>

      <JournalReader entry={selectedEntry} onClose={closeEntry} />
    </>
  );
}
