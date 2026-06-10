'use client';

import { useParams, useRouter } from 'next/navigation';
import VisualCard from '@/components/VisualCard';
import VisualViewer from '@/components/VisualViewer';
import { VisualMetadata } from '@/types';

interface VisualsGridProps {
  visuals: VisualMetadata[];
}

export default function VisualsGrid({ visuals }: VisualsGridProps) {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : undefined;
  const selectedVisual = slug ? visuals.find((v) => v.slug === slug) ?? null : null;

  const openVisual = (visual: VisualMetadata) => {
    router.push(`/FallingTrees/${visual.slug}`);
  };

  const closeVisual = () => {
    router.push('/FallingTrees');
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 lg:gap-12">
        {visuals.map((visual) => (
          <VisualCard
            key={visual.slug}
            visual={visual}
            onClick={() => openVisual(visual)}
          />
        ))}
      </div>

      {visuals.length === 0 && (
        <div className="py-32 text-center text-white/20 font-light italic">
          The visual archive is currently empty.
        </div>
      )}

      <VisualViewer visual={selectedVisual} onClose={closeVisual} />
    </>
  );
}
