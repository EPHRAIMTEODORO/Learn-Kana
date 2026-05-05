import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flashcards | Learn Kana',
  description: 'Practice kana and kanji flashcards while updating your local learner model.',
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
