'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Falling Trees', href: '/FallingTrees' },
  { name: 'Phir Bhi', href: '/PhirBhi' },
  { name: 'Hero Kaun', href: '/HeroKaun' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-[100] h-24 flex justify-center items-center px-4 pointer-events-none"
    >
      <div className="flex items-center justify-center gap-0 px-2 h-14 border border-white/10 bg-black/90 rounded-full shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'h-full flex items-center px-4 md:px-8 text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-full cursor-pointer touch-manipulation select-none',
                active
                  ? 'text-white font-medium bg-white/10'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
