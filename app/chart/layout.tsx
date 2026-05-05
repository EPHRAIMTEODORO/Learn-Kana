import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kana Chart | Learn Kana',
  description: 'View hiragana and katakana in a structured kana chart with romaji readings.',
};

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
