'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetData } from '@/lib/storage';

export default function SettingsPage() {
  const [resetComplete, setResetComplete] = useState(false);

  const handleReset = () => {
    if (confirm('Reset learning data? This removes progress, review schedules, and attempt logs from MongoDB and this browser cache.')) {
      resetData();
      setResetComplete(true);
    }
  };

  return (
    <main className="min-h-screen bg-academic-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-academic-muted hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-academic-text">Settings</h1>
          <div className="w-24" />
        </div>

        <section className="mx-auto max-w-2xl bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-academic-text mb-2">Learning Data</h2>
          <p className="text-academic-muted mb-6">
            Progress, review schedules, and attempt logs are stored in MongoDB when configured. This browser keeps a small cache so practice can stay responsive while data syncs.
          </p>
          <button
            onClick={handleReset}
            className="bg-[#B85C5C] hover:bg-[#8E3F3F] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Reset Learning Data
          </button>
          {resetComplete && (
            <p className="mt-4 text-sm text-green-700">
              Learning data has been reset for this learner profile.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
