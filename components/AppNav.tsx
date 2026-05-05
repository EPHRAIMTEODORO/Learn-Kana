import Link from 'next/link';

const navItems = [
  { href: '/learn', label: 'Learn' },
  { href: '/quiz', label: 'Practice' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/curriculum', label: 'Curriculum' },
];

export default function AppNav() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-slate-950 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white"
        >
          Learn Kana
        </Link>
        <nav aria-label="Primary navigation" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
