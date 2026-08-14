import type { Metadata } from 'next';
import AppNav from '@/components/AppNav';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Create Account | Learn Kana',
  description: 'Create a Learn Kana account.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
