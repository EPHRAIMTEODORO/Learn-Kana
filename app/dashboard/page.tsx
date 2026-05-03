'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LearnerStats } from '@/types/kana';
import { getLearnerStats } from '@/services/analyticsService';
import { clearAttempts } from '@/storage/attemptRepository';
import { clearAllProgress } from '@/utils/progress';

function formatMs(value: number): string {
  if (!value) return '0 ms';
  return `${value.toLocaleString()} ms`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<LearnerStats | null>(null);

  const loadStats = () => {
    setStats(getLearnerStats());
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearData = () => {
    if (confirm('Clear all local attempt logs and progress data?')) {
      clearAttempts();
      clearAllProgress();
      loadStats();
    }
  };

  if (!stats) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learner Dashboard
          </h1>
          <Link
            href="/quiz"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Practice
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Total Attempts</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalAttempts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Overall Accuracy</p>
            <p className="text-3xl font-bold text-green-600">{stats.overallAccuracy}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Average Response</p>
            <p className="text-3xl font-bold text-blue-600">{formatMs(stats.averageResponseTimeMs)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Incorrect Attempts</p>
            <p className="text-3xl font-bold text-orange-600">{stats.incorrectAttempts}</p>
          </div>
        </div>

        {stats.totalAttempts === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              No attempt logs yet. Take a kana quiz to populate learner analytics.
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Quiz
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weakest Kana</h2>
              <div className="space-y-2">
                {stats.weakestKana.map((kana) => (
                  <div key={kana.character} className="flex justify-between text-gray-800 dark:text-gray-200">
                    <span className="text-2xl">{kana.character}</span>
                    <span>{kana.accuracy}% accuracy, {kana.incorrect} missed</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Most Confused Pairs</h2>
              {stats.mostConfusedPairs.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No confusion pairs detected yet.</p>
              ) : (
                <div className="space-y-2">
                  {stats.mostConfusedPairs.slice(0, 8).map((pair) => (
                    <div key={pair.pair} className="flex justify-between text-gray-800 dark:text-gray-200">
                      <span>{pair.pair}</span>
                      <span>{pair.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accuracy by Group</h2>
              <div className="space-y-2">
                {stats.accuracyByGroup.map((group) => (
                  <div key={group.group} className="flex justify-between text-gray-800 dark:text-gray-200">
                    <span>{group.group}</span>
                    <span>{group.accuracy}% ({group.attempts} attempts)</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Progress</h2>
              {stats.recentlyImprovedKana.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">More attempts are needed to compare recent improvement.</p>
              ) : (
                <div className="space-y-2">
                  {stats.recentlyImprovedKana.map((kana) => (
                    <div key={kana.character} className="flex justify-between text-gray-800 dark:text-gray-200">
                      <span className="text-2xl">{kana.character}</span>
                      <span>+{kana.improvement} percentage points</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended Next Practice Set</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {stats.recommendedNextPracticeSet.map((kana) => (
                  <span
                    key={kana.character}
                    className="inline-flex items-center justify-center min-w-12 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-2xl text-gray-900 dark:text-white"
                  >
                    {kana.character}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  href="/quiz"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Practice Recommended Kana
                </Link>
                <button
                  onClick={handleClearData}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Clear Local Prototype Data
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
