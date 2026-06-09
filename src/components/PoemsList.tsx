'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import PoemReader from '@/components/PoemReader';
import { PoemMetadata } from '@/types';

interface PoemsListProps {
  poems: PoemMetadata[];
}

export default function PoemsList({ poems }: PoemsListProps) {
  const [selectedPoem, setSelectedPoem] = useState<PoemMetadata | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params?.slug) {
      const poem = poems.find(p => p.slug === params.slug);
      if (poem) {
        setSelectedPoem(poem);
      }
    }
  }, [params, poems]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {poems.map((poem, index) => (
          <motion.div
            key={poem.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 1 }}
            onClick={() => setSelectedPoem(poem)}
            className="group cursor-pointer flex flex-col space-y-6"
          >
            <h2 className="text-2xl font-serif font-light text-white/80 group-hover:text-white transition-colors duration-700 italic">
              {poem.title}
            </h2>
            
            <div className="relative">
              <p className="text-base font-serif font-light text-white/20 group-hover:text-white/40 transition-colors duration-700 leading-relaxed line-clamp-8 whitespace-pre-wrap italic">
                {poem.content}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>

      {poems.length === 0 && (
        <div className="py-32 text-center text-white/20 font-serif italic font-light">
          The archive is silent for now.
        </div>
      )}

      <PoemReader 
        poem={selectedPoem} 
        onClose={() => setSelectedPoem(null)} 
      />
    </>
  );
}
