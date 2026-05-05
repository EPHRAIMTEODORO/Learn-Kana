import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kanji by Grade | Learn Kana',
  description: 'Study Jōyō kanji organized by Japanese school grade with readings and meanings.',
};

export default function KanjiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
