import VisualsPage from '../page';

export default function VisualsDeepLinkPage() {
  return <VisualsPage />;
}

// Ensure static generation for all visuals
import { getAllVisuals } from '@/lib/content';

export async function generateStaticParams() {
  const visuals = getAllVisuals();
  return visuals.map((visual) => ({
    slug: visual.slug,
  }));
}
