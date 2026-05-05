import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learner Dashboard | Learn Kana',
  description: 'Review adaptive recommendations, learner analytics, weak items, and practice signals.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
