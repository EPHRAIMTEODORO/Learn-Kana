import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Analytics | Learn Kana',
  description: 'Track accuracy by category, weak characters, recent mistakes, grade completion, and study streaks.',
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
