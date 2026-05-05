import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adaptive Quiz | Learn Kana',
  description: 'Take adaptive Japanese kana and kanji quizzes based on review timing, accuracy, and mistakes.',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
