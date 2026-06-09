'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import JournalReader from '@/components/JournalReader';
import { JournalMetadata } from '@/types';

interface JournalListProps {
  entries: JournalMetadata[];
}

export default function JournalList({ entries }: JournalListProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalMetadata | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params?.slug) {
      const entry = entries.find(e => e.slug === params.slug);
      if (entry) {
        setSelectedEntry(entry);
      }
    }
  }, [params, entries]);

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
            onClick={() => setSelectedEntry(entry)}
            className="group cursor-pointer py-6 flex items-baseline justify-between border-b border-white/[0.03] hover:border-white/10 transition-colors duration-500"
          >
            <div className="flex items-baseline gap-12">
              <span className="text-xs text-white/20 tracking-widest w-24 flex-shrink-0">{entry.date}</span>
              <h2 className="text-base font-light text-white/60 group-hover:text-white transition-colors duration-500">
                {entry.title}
              </h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/10 group-hover:text-white/40 transition-colors duration-500">
              Open Log
            </span>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div className="py-32 text-center text-white/10 text-xs tracking-widest uppercase">
            No logs found in current directory.
          </div>
        )}
      </div>

      <JournalReader 
        entry={selectedEntry} 
        onClose={() => setSelectedEntry(null)} 
      />
    </>
  );
}
