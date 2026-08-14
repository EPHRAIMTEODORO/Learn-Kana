'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hydrateUserDataFromMongo } from '@/lib/storage';

type AuthMode = 'login' | 'signup';

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  useEffect(() => {
    const errorCode = new URLSearchParams(window.location.search).get('error');
    const messages: Record<string, string> = {
      google_not_configured: 'Google login is not configured yet.',
      google_state_mismatch: 'Google login expired. Try again.',
      google_auth_failed: 'Google login failed. Try again.',
    };

    if (errorCode && messages[errorCode]) {
      setError(messages[errorCode]);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? 'Something went wrong.');
        return;
      }

      await hydrateUserDataFromMongo();
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Could not reach the server. Try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-lg border border-academic-border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-academic-text">
          {isSignup ? 'Create Account' : 'Log In'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-academic-muted">
          {isSignup
            ? 'Save practice history and recommendations to your learner account.'
            : 'Return to your saved learner profile.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <label className="block text-sm font-semibold text-academic-text">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              autoComplete="name"
              className="mt-2 w-full rounded-md border border-academic-border bg-white px-3 py-3 text-academic-text outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
            />
          </label>
        )}

        <label className="block text-sm font-semibold text-academic-text">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-academic-border bg-white px-3 py-3 text-academic-text outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          />
        </label>

        <label className="block text-sm font-semibold text-academic-text">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            pattern={isSignup ? '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}' : undefined}
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            title={
              isSignup
                ? 'Use at least 8 characters with uppercase, lowercase, number, and special character.'
                : undefined
            }
            className="mt-2 w-full rounded-md border border-academic-border bg-white px-3 py-3 text-academic-text outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
          />
        </label>

        {isSignup && (
          <p className="text-xs leading-5 text-academic-muted">
            Use at least 8 characters with uppercase, lowercase, number, and special character.
          </p>
        )}

        {error && (
          <p className="rounded-md border border-[#E8C8C8] bg-[#F8EAEA] p-3 text-sm font-medium text-[#8E3F3F]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-academic-primary px-4 py-3 font-semibold text-white outline-none transition-colors hover:bg-academic-primaryDark disabled:cursor-not-allowed disabled:bg-[#999999] focus-visible:ring-2 focus-visible:ring-academic-primary"
        >
          {isSubmitting ? 'Working...' : isSignup ? 'Create Account' : 'Log In'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-academic-border" />
        <span className="text-xs font-semibold uppercase text-academic-muted">or</span>
        <div className="h-px flex-1 bg-academic-border" />
      </div>

      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-3 rounded-md border border-academic-border bg-white px-4 py-3 font-semibold text-academic-text outline-none transition-colors hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
      >
        <span className="text-lg font-bold text-academic-primary">G</span>
        Continue with Google
      </a>

      <p className="mt-5 text-center text-sm text-academic-muted">
        {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link
          href={isSignup ? '/login' : '/signup'}
          className="font-semibold text-academic-primary hover:underline"
        >
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </section>
  );
}
