'use client';

import { useParams, useRouter } from 'next/navigation';
import VisualCard from '@/components/VisualCard';
import VisualViewer from '@/components/VisualViewer';
import { VisualMetadata } from '@/types';
import Masonry from 'react-masonry-css';

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

  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {visuals.map((visual) => (
          <div key={visual.slug} className="mb-6 md:mb-10 lg:mb-12">
            <VisualCard
              visual={visual}
              onClick={() => openVisual(visual)}
            />
          </div>
        ))}
      </Masonry>

      {visuals.length === 0 && (
        <div className="py-32 text-center text-white/20 font-light italic">
          The visual archive is currently empty.
        </div>
      )}

      <VisualViewer visual={selectedVisual} onClose={closeVisual} />
    </>
  );
}
