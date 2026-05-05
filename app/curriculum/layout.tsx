import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curriculum | Learn Kana',
  description: 'Review the kana and kanji curriculum, grade groupings, dataset notes, and assumptions.',
};

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
