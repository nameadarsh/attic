'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Info, Share2, Star } from 'lucide-react';
import { VisualMetadata } from '@/types';

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
    if (visual) {
      window.history.pushState(null, '', `/visuals/${visual.slug}`);
      document.body.style.overflow = 'hidden';
      setHasError(false); // Reset error state for new visual
      
      // Focus management: focus the modal when it opens
      modalRef.current?.focus();
    } else {
      window.history.pushState(null, '', '/visuals');
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
        aria-label={`Visual viewer: ${visual.title}`}
        tabIndex={-1}
        ref={modalRef}
      >
        {/* Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-2 md:gap-4 z-[110]">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} 
            className="p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} 
            className="p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className={`p-2 transition-colors ${showInfo ? 'text-white' : 'text-white/40 hover:text-white'}`}
            aria-label="Show info"
            aria-pressed={showInfo}
          >
            <Info size={20} />
          </button>
          <button 
            onClick={handleShare} 
            className="p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Share"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 text-white/40 hover:text-white transition-colors ml-4"
            aria-label="Close"
          >
            <X size={24} />
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
              className="relative max-w-full max-h-full aspect-auto shadow-2xl bg-neutral-900"
              layoutId={`visual-${visual.slug}`}
              style={{ scale: zoom }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {visual.type === 'video' ? (
                <video 
                  src={`/media/${visual.filename}`} 
                  controls 
                  autoPlay 
                  loop 
                  onError={() => setHasError(true)}
                  className="max-w-full max-h-[85vh] block"
                />
              ) : (
                <div className="relative max-w-full max-h-[85vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/media/${visual.filename}`} 
                    alt={visual.title}
                    onError={() => setHasError(true)}
                    className="max-w-full max-h-[85vh] object-contain block"
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
                    className="absolute inset-y-0 right-0 w-72 md:w-80 bg-black/80 backdrop-blur-xl p-8 border-l border-white/10 overflow-y-auto z-[120]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-2xl font-light text-white mb-6">{visual.title}</h2>
                  <div className="text-base font-light text-white/70 leading-relaxed whitespace-pre-wrap">
                    {visual.description}
                  </div>
                  {visual.highlight && (
                    <div className="mt-8 flex items-center gap-3 text-accent-warm">
                      <Star size={16} fill="currentColor" />
                      <span className="text-xs uppercase tracking-widest">Highlighted Work</span>
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
