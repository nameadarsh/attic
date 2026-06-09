'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Visuals', href: '/visuals' },
  { name: 'Poems', href: '/poems' },
  { name: 'Hero Kaun', href: '/hero-kaun' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-8 md:gap-12 px-8 md:px-12 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-[10px] md:text-xs uppercase tracking-[0.3em] transition-colors duration-500",
                isActive ? "text-white font-medium" : "text-text-muted hover:text-white"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
