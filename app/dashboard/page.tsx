'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LearnerStats, RecommendationTrace, RecommendedLearningItem, UserData, VirtualTAFeedback } from '@/types/kana';
import { getLearnerStats } from '@/services/analyticsService';
import { getRecommendationTrace, getRecommendedNext } from '@/lib/recommendations';
import { getUserData } from '@/lib/storage';
import { generateVirtualTAFeedback } from '@/lib/virtualTA';

function formatMs(value: number): string {
  if (!value) return '0 ms';
  return `${value.toLocaleString()} ms`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [recommended, setRecommended] = useState<RecommendedLearningItem[]>([]);
  const [trace, setTrace] = useState<RecommendationTrace | null>(null);
  const [virtualTA, setVirtualTA] = useState<VirtualTAFeedback | null>(null);

  const loadStats = () => {
    const userData: UserData = getUserData();
    const nextStats = getLearnerStats();
    const nextRecommended = getRecommendedNext(userData, { limit: 12 });

    setStats(nextStats);
    setRecommended(nextRecommended);
    setTrace(getRecommendationTrace(userData, { limit: 12 }));
    setVirtualTA(generateVirtualTAFeedback(userData, nextStats, nextRecommended));
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats || !trace || !virtualTA) return null;

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

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Virtual TA Feedback</h2>
              <Link href="/research-alignment" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                Lab alignment
              </Link>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{virtualTA.summary}</p>
            <div className="rounded border border-green-100 bg-green-50 p-3 text-sm text-green-900 dark:border-gray-700 dark:bg-gray-700 dark:text-green-100">
              {virtualTA.nextAction}
            </div>
            <div className="mt-4 space-y-2">
              {virtualTA.evidence.map((item) => (
                <p key={item} className="text-sm text-gray-600 dark:text-gray-300">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Adaptive UI Policy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{trace.policy}</p>
            <div className="grid grid-cols-4 gap-3 mb-4 text-center">
              <div className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trace.dueCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Due</p>
              </div>
              <div className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trace.weakCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Weak</p>
              </div>
              <div className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trace.newCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">New</p>
              </div>
              <div className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trace.selectedCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Selected</p>
              </div>
            </div>
            <div className="space-y-2">
              {trace.signals.map((signal) => (
                <div key={signal.name} className="flex justify-between gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <span>{signal.name}</span>
                  <span className="text-right">{signal.weight}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {stats.totalAttempts === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              No attempt logs yet. Take a kana quiz to populate learner analytics.
            </p>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Recommended for you</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {recommended.slice(0, 10).map((item) => (
                  <span
                    key={item.itemId}
                    className="inline-flex min-w-10 items-center justify-center rounded bg-gray-100 px-3 py-2 text-2xl text-gray-900 dark:bg-gray-700 dark:text-white"
                  >
                    {item.character}
                  </span>
                ))}
              </div>
            </div>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Recommended for you</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Prioritized from due reviews, low accuracy items, and recently missed characters.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {recommended.map((item) => (
                  <div
                    key={item.itemId}
                    className="min-w-24 rounded bg-gray-100 dark:bg-gray-700 px-3 py-2"
                  >
                    <div className="text-2xl text-gray-900 dark:text-white">{item.character}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {item.reasons[0] ?? `${item.accuracy}% accuracy`}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  href="/quiz"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Practice Recommendations
                </Link>
                <Link
                  href="/settings"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Settings
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
