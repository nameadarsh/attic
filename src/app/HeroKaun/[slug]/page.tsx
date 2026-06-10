import HeroKaunPage from '../page';

export default function HeroKaunDeepLinkPage() {
  return <HeroKaunPage />;
}

import { getAllJournalEntries } from '@/lib/content';

export async function generateStaticParams() {
  const entries = getAllJournalEntries();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}
