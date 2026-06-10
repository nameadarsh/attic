'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { VisualMetadata } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VisualCardProps {
  visual: VisualMetadata;
  onClick: () => void;
}

export default function VisualCard({ visual, onClick }: VisualCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Only handling errors now since autoPlay handles the playing
  }, [hasError]);

  if (hasError) return null; // Issue 3: Hide broken visuals

  return (
    <motion.div
      layoutId={`visual-${visual.slug}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View ${visual.title}`}
      className="relative bg-neutral-900 overflow-hidden cursor-pointer group rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent-warm/50"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {visual.type === 'video' ? (
        <video
          ref={videoRef}
          src={`/media/${visual.filename}`}
          muted
          loop
          autoPlay
          playsInline
          onError={() => setHasError(true)}
          className={cn(
            "w-full h-auto object-cover transition-opacity duration-700 block",
            visual.rotation === 90 && "rotate-90 scale-[1.25]",
            visual.rotation === 180 && "rotate-180",
            visual.rotation === 270 && "-rotate-90 scale-[1.25]"
          )}
        />
      ) : (
        <div className="relative w-full h-auto overflow-hidden block">
          <Image
            src={`/media/${visual.filename}`}
            alt={visual.title}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setHasError(true)}
            className={cn(
              "w-full h-auto transition-opacity duration-1000",
              visual.rotation === 90 && "rotate-90 scale-[1.25]",
              visual.rotation === 180 && "rotate-180",
              visual.rotation === 270 && "-rotate-90 scale-[1.25]"
            )}
          />
        </div>
      )}

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-light text-white tracking-wide group-hover:text-accent-warm transition-colors duration-500">{visual.title}</h3>
        </div>
        <p className="text-xs font-light text-white/90 line-clamp-2 leading-relaxed tracking-wide">
          {visual.description}
        </p>
      </div>
    </motion.div>
  );
}
