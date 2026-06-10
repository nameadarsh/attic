'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import PoemReader from '@/components/PoemReader';
import { PoemMetadata } from '@/types';

interface PoemsListProps {
  poems: PoemMetadata[];
}

export default function PoemsList({ poems }: PoemsListProps) {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : undefined;
  const selectedPoem = slug ? poems.find((p) => p.slug === slug) ?? null : null;

  const openPoem = (poem: PoemMetadata) => {
    router.push(`/PhirBhi/${poem.slug}`);
  };

  const closePoem = () => {
    router.push('/PhirBhi');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32">
        {poems.map((poem, index) => (
          <motion.div
            key={poem.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => openPoem(poem)}
            className="group cursor-pointer flex flex-col space-y-8 p-6 -m-6 rounded-sm hover:bg-white/[0.02] transition-colors duration-700"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-light text-white group-hover:text-accent-warm transition-colors duration-700 italic">
                {poem.title}
              </h2>
              <div className="h-px w-12 bg-white/10 group-hover:w-20 group-hover:bg-accent-warm transition-all duration-700" />
            </div>

            <div className="relative">
              <p className="text-lg font-serif font-light text-text-muted group-hover:text-white/90 transition-colors duration-700 leading-relaxed line-clamp-8 whitespace-pre-wrap italic">
                {poem.content}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
            </div>
          </motion.div>
        ))}
      </div>

      {poems.length === 0 && (
        <div className="py-32 text-center text-white/20 font-serif italic font-light">
          The archive is silent for now.
        </div>
      )}

      <PoemReader poem={selectedPoem} onClose={closePoem} />
    </>
  );
}
