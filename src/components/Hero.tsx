'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-10"
      >
        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-8 leading-tight">
          A personal attic,<br className="hidden md:block" /> not a museum.
        </h1>
        <p className="text-lg md:text-xl font-light text-white leading-relaxed max-w-2xl mx-auto italic font-serif">
          Things I wanted to keep.
        </p>
        
        <div className="mt-16 max-w-lg mx-auto text-sm md:text-base font-light text-text-muted leading-relaxed tracking-wide">
          This is a quiet corner of the internet. A collection of fragments gathered over time. No noise, no metrics, just memory.
        </div>
      </motion.div>

      {/* Hero Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </section>
  );
}
