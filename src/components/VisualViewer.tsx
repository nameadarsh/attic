'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Info, Share2, Star } from 'lucide-react';
import { VisualMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface VisualViewerProps {
  visual: VisualMetadata | null;
  onClose: () => void;
}

export default function VisualViewer({ visual, onClose }: VisualViewerProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hasError, setHasError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visual) return;

    document.body.style.overflow = 'hidden';
    setHasError(false);
    modalRef.current?.focus();

    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [visual, onClose]);

  const handleShare = async () => {
    if (!visual) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  if (!visual) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-label={`Falling Trees viewer: ${visual.title}`}
        tabIndex={-1}
        ref={modalRef}
      >
        {/* Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-1 md:gap-2 z-[110]">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} 
            className="p-4 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md rounded-full group"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} 
            className="p-4 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md rounded-full group"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className={cn(
              "p-4 transition-colors bg-black/20 backdrop-blur-md rounded-full group",
              showInfo ? 'text-accent-warm' : 'text-white/60 hover:text-white'
            )}
            aria-label="Show info"
            aria-pressed={showInfo}
          >
            <Info size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleShare} 
            className="p-4 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md rounded-full group"
            aria-label="Share"
          >
            <Share2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onClose} 
            className="p-4 text-white/60 hover:text-white transition-colors ml-2 bg-black/40 backdrop-blur-md rounded-full group border border-white/10"
            aria-label="Close"
          >
            <X size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Viewer Content */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {hasError ? (
            <div className="text-white/40 font-light italic">
              Failed to load media.
            </div>
          ) : (
            <motion.div 
              className="relative max-w-full max-h-full shadow-2xl bg-neutral-900/50"
              layoutId={`visual-${visual.slug}`}
              style={{ scale: zoom }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {visual.type === 'video' ? (
                <video 
                  src={`/media/${visual.filename}`} 
                  controls 
                  autoPlay 
                  loop 
                  onError={() => setHasError(true)}
                  className={cn(
                    "max-w-full max-h-[85vh] block",
                    visual.rotation === 90 && "rotate-90",
                    visual.rotation === 180 && "rotate-180",
                    visual.rotation === 270 && "-rotate-90"
                  )}
                />
              ) : (
                <div className="relative max-w-full max-h-[85vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/media/${visual.filename}`} 
                    alt={visual.title}
                    onError={() => setHasError(true)}
                    className={cn(
                      "max-w-full max-h-[85vh] object-contain block",
                      visual.rotation === 90 && "rotate-90",
                      visual.rotation === 180 && "rotate-180",
                      visual.rotation === 270 && "-rotate-90"
                    )}
                  />
                </div>
              )}

              {/* Info Panel Overlay */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute inset-y-0 right-0 w-72 md:w-96 bg-black/95 backdrop-blur-3xl p-10 border-l border-white/10 overflow-y-auto z-[120]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-2xl font-light text-white mb-6">{visual.title}</h2>
                  <div className="text-base font-light text-white/90 leading-relaxed whitespace-pre-wrap">
                    {visual.description}
                  </div>
                  {visual.highlight && (
                    <div className="mt-8 flex items-center gap-3 text-accent-warm">
                      <Star size={16} fill="currentColor" />
                      <span className="text-xs uppercase tracking-widest font-medium">Highlighted Work</span>
                    </div>
                  )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
