'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetData } from '@/lib/storage';

export default function SettingsPage() {
  const [resetComplete, setResetComplete] = useState(false);

  const handleReset = () => {
    if (confirm('Reset local learning data on this device? This removes progress, review schedules, and attempt logs.')) {
      resetData();
      setResetComplete(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <div className="w-24" />
        </div>

        <section className="mx-auto max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Learning Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Progress, review schedules, and attempt logs are stored locally in this browser so the system can adapt practice to your performance.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Reset Learning Data
          </button>
          {resetComplete && (
            <p className="mt-4 text-sm text-green-700 dark:text-green-300">
              Learning data has been reset on this device.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
