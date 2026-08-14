import Link from 'next/link';

const navItems = [
  { href: '/learn', label: 'Learn' },
  { href: '/chart', label: 'Chart' },
  { href: '/quiz', label: 'Practice' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/curriculum', label: 'Curriculum' },
];

export default function AppNav() {
  return (
    <header className="border-b border-academic-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-academic-text outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
        >
          Learn Kana
        </Link>
        <nav aria-label="Primary navigation" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-academic-muted outline-none transition-colors hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
