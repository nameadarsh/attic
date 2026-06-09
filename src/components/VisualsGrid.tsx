'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VisualCard from '@/components/VisualCard';
import VisualViewer from '@/components/VisualViewer';
import { VisualMetadata } from '@/types';

interface VisualsGridProps {
  visuals: VisualMetadata[];
}

export default function VisualsGrid({ visuals }: VisualsGridProps) {
  const [selectedVisual, setSelectedVisual] = useState<VisualMetadata | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params?.slug) {
      const visual = visuals.find(v => v.slug === params.slug);
      if (visual) {
        setSelectedVisual(visual);
      }
    }
  }, [params, visuals]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {visuals.map((visual) => (
          <VisualCard 
            key={visual.slug} 
            visual={visual} 
            onClick={() => setSelectedVisual(visual)} 
          />
        ))}
      </div>

      {visuals.length === 0 && (
        <div className="py-32 text-center text-white/20 font-light italic">
          The visual archive is currently empty.
        </div>
      )}

      <VisualViewer 
        visual={selectedVisual} 
        onClose={() => setSelectedVisual(null)} 
      />
    </>
  );
}
