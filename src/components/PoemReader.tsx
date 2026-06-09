'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { PoemMetadata } from '@/types';

interface PoemReaderProps {
  poem: PoemMetadata | null;
  onClose: () => void;
}

export default function PoemReader({ poem, onClose }: PoemReaderProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (poem) {
      window.history.pushState(null, '', `/poems/${poem.slug}`);
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      window.history.pushState(null, '', '/poems');
      document.body.style.overflow = 'auto';
    }

    const handlePopState = () => onClose();
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [poem, onClose]);

  if (!poem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-label={`Poem reader: ${poem.title}`}
        tabIndex={-1}
        ref={modalRef}
      >
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-black/80 backdrop-blur-2xl border border-white/10 p-12 md:p-20 overflow-y-auto rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Poem Content */}
            <article className="font-serif">
              <header className="mb-16">
                <div className="flex items-center gap-6 mb-4">
                  <h2 className="text-4xl md:text-5xl font-light text-white italic leading-tight">
                    {poem.title}
                  </h2>
                  {poem.highlight && <Star size={20} className="text-accent-warm fill-current" />}
                </div>
                <div className="h-px w-20 bg-accent-warm/40 mt-10" />
              </header>
              
              <div className="text-xl md:text-2xl text-white/90 leading-[1.8] whitespace-pre-wrap space-y-10">
                {poem.content}
              </div>

              <footer className="mt-20 pt-12 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim italic text-center">
                  Finis
                </p>
              </footer>
            </article>
          </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
