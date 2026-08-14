import type { Metadata } from 'next';
import AppNav from '@/components/AppNav';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Log In | Learn Kana',
  description: 'Log in to your Learn Kana account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
