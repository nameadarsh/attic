'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { JournalMetadata } from '@/types';

interface JournalReaderProps {
  entry: JournalMetadata | null;
  onClose: () => void;
}

export default function JournalReader({ entry, onClose }: JournalReaderProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!entry) return;

    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();
    setMediaErrors({});

    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const handleMediaError = (filename: string) => {
    setMediaErrors(prev => ({ ...prev, [filename]: true }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-label={`Journal entry: ${entry.title}`}
        tabIndex={-1}
        ref={modalRef}
      >
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl h-full max-h-[90vh] bg-black/95 backdrop-blur-3xl border border-white/10 rounded-sm overflow-hidden flex flex-col font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 md:px-10 py-4 md:py-6 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <span className="text-xs text-text-muted uppercase tracking-[0.4em]">Archive_Access</span>
              </div>
              <button 
                onClick={onClose}
                className="text-text-muted hover:text-white transition-colors p-4 md:p-6 bg-white/5 hover:bg-white/10 rounded-full group"
                aria-label="Close"
              >
                <X size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-10 md:p-16 scrollbar-hide">
              <article className="max-w-2xl mx-auto space-y-16">
                <header className="space-y-6 border-b border-white/10 pb-10">
                  <div className="text-xs text-text-dim tracking-[0.2em] uppercase">
                    Timestamp: {entry.date}
                  </div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-light text-white">
                      {entry.title}
                    </h2>
                    {entry.highlight && <Star size={16} className="text-accent-warm fill-current" />}
                  </div>
                </header>

                {/* Journal Content */}
                <div className="text-base md:text-lg text-white/90 leading-relaxed whitespace-pre-wrap space-y-8">
                  {entry.content}
                </div>

                {/* Media Section */}
                {entry.media && entry.media.length > 0 && (
                  <div className="space-y-12 pt-12">
                    <div className="text-xs text-text-muted uppercase tracking-[0.4em] border-b border-white/10 pb-4">
                      Attached_Media
                    </div>
                    <div className="grid grid-cols-1 gap-12">
                      {entry.media.map((filename, i) => {
                        if (mediaErrors[filename]) return null;
                        const isVideo = filename.toLowerCase().endsWith('.mp4');
                        return (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                            {isVideo ? (
                              <video 
                                src={`/journal_media/${filename}`} 
                                controls 
                                onError={() => handleMediaError(filename)}
                                className="w-full h-auto"
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={`/journal_media/${filename}`} 
                                alt={`Journal media ${i}`}
                                onError={() => handleMediaError(filename)}
                                className="w-full h-auto object-contain"
                              />
                            )}
                            <div className="px-6 py-4 text-xs text-text-dim font-mono">
                              File: {filename}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <footer className="pt-24 pb-12 text-center">
                  <div className="text-[10px] text-white/10 uppercase tracking-[0.5em]">
                    End_Of_Transmission
                  </div>
                </footer>
              </article>
            </div>
          </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
