import PoemsPage from '../page';

export default function PoemsDeepLinkPage() {
  return <PoemsPage />;
}

import { getAllPoems } from '@/lib/content';

export async function generateStaticParams() {
  const poems = getAllPoems();
  return poems.map((poem) => ({
    slug: poem.slug,
  }));
}
