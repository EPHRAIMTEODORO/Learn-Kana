'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forgetCachedUserData } from '@/lib/storage';

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export default function AuthStatus() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((payload: { user: AuthUser | null }) => {
        if (!isMounted) return;
        setUser(payload.user);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    forgetCachedUserData();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return <span className="px-3 py-2 text-sm text-academic-muted">Account</span>;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link
          href="/login"
          className="rounded-md px-3 py-2 text-sm font-medium text-academic-muted outline-none transition-colors hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-academic-primary px-3 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="max-w-40 truncate px-2 py-2 text-sm font-medium text-academic-muted">
        {user.name}
      </span>
      <button
        onClick={handleLogout}
        className="rounded-md border border-academic-border bg-white px-3 py-2 text-sm font-semibold text-academic-text outline-none transition-colors hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
      >
        Log out
      </button>
    </div>
  );
}
