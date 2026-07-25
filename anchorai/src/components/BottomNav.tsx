// ============================================================
// AnchorAI — Bottom Navigation Component
// Persistent navigation bar across all main pages
// ============================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/learn', label: 'Learn', icon: '📚' },
  { href: '/journal', label: 'Journal', icon: '📝' },
  { href: '/caregiver', label: 'Care', icon: '💜' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]
                ${isActive
                  ? 'text-[#22c55e] bg-[rgba(34,197,94,0.1)]'
                  : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#22c55e]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
