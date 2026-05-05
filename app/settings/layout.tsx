import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Learn Kana',
  description: 'Manage local learning data used for adaptive Japanese practice.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
