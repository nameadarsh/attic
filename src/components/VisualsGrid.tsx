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
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-10 lg:gap-12 space-y-6 md:space-y-10 lg:space-y-12">
        {visuals.map((visual) => (
          <div key={visual.slug} className="break-inside-avoid">
            <VisualCard
              visual={visual}
              onClick={() => openVisual(visual)}
            />
          </div>
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
