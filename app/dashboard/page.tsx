'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LearnerStats, RecommendationTrace, RecommendedLearningItem, UserData, VirtualTAFeedback } from '@/types/kana';
import { getLearnerStats } from '@/services/analyticsService';
import { getRecommendationTrace, getRecommendedNext } from '@/lib/recommendations';
import { getUserData } from '@/lib/storage';
import { generateVirtualTAFeedback } from '@/lib/virtualTA';
import AppNav from '@/components/AppNav';
import RecommendedSection from '@/components/RecommendedSection';

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
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold text-academic-text">
              What should the learner do next?
            </h1>
            <p className="mt-3 max-w-2xl text-academic-muted">
              Recommendations, Virtual TA feedback, and analytics explain the next best practice step.
            </p>
          </div>
          <Link
            href="/quiz"
            className="rounded-md bg-academic-primary px-4 py-3 text-center font-semibold text-white outline-none hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary"
          >
            Practice
          </Link>
        </div>

        <div className="mb-8">
          <RecommendedSection />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <p className="text-academic-muted text-sm mb-1">Total Attempts</p>
            <p className="text-3xl font-bold text-academic-text">{stats.totalAttempts}</p>
          </div>
          <div className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <p className="text-academic-muted text-sm mb-1">Overall Accuracy</p>
            <p className="text-3xl font-bold text-academic-primary">{stats.overallAccuracy}%</p>
          </div>
          <div className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <p className="text-academic-muted text-sm mb-1">Average Response</p>
            <p className="text-3xl font-bold text-blue-600">{formatMs(stats.averageResponseTimeMs)}</p>
          </div>
          <div className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <p className="text-academic-muted text-sm mb-1">Incorrect Attempts</p>
            <p className="text-3xl font-bold text-orange-600">{stats.incorrectAttempts}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-academic-text">Virtual TA Feedback</h2>
              <Link href="/research-alignment" className="text-sm text-academic-primary hover:underline">
                Lab alignment
              </Link>
            </div>
            <p className="text-academic-muted mb-3">{virtualTA.summary}</p>
            <div className="rounded border border-[#D7E5DC] bg-[#E7F0EA] p-3 text-sm text-[#355C3F]">
              {virtualTA.nextAction}
            </div>
            <div className="mt-4 space-y-2">
              {virtualTA.evidence.map((item) => (
                <p key={item} className="text-sm text-academic-muted">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-academic-text mb-2">Adaptive UI Policy</h2>
            <p className="text-sm text-academic-muted mb-4">{trace.policy}</p>
            <div className="grid grid-cols-4 gap-3 mb-4 text-center">
              <div className="rounded bg-academic-section p-3">
                <p className="text-2xl font-bold text-academic-text">{trace.dueCount}</p>
                <p className="text-xs text-academic-muted">Due</p>
              </div>
              <div className="rounded bg-academic-section p-3">
                <p className="text-2xl font-bold text-academic-text">{trace.weakCount}</p>
                <p className="text-xs text-academic-muted">Weak</p>
              </div>
              <div className="rounded bg-academic-section p-3">
                <p className="text-2xl font-bold text-academic-text">{trace.newCount}</p>
                <p className="text-xs text-academic-muted">New</p>
              </div>
              <div className="rounded bg-academic-section p-3">
                <p className="text-2xl font-bold text-academic-text">{trace.selectedCount}</p>
                <p className="text-xs text-academic-muted">Selected</p>
              </div>
            </div>
            <div className="space-y-2">
              {trace.signals.map((signal) => (
                <div key={signal.name} className="flex justify-between gap-4 text-sm text-academic-muted">
                  <span>{signal.name}</span>
                  <span className="text-right">{signal.weight}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {stats.totalAttempts === 0 ? (
          <div className="rounded-lg border border-academic-border bg-white p-8 text-center shadow-sm">
            <p className="text-academic-muted mb-4">
              No attempt logs yet. Take a kana quiz to populate learner analytics.
            </p>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-academic-text mb-3">Recommended for you</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {recommended.slice(0, 10).map((item) => (
                  <span
                    key={item.itemId}
                    className="inline-flex min-w-10 items-center justify-center rounded bg-academic-section px-3 py-2 text-2xl text-academic-text"
                  >
                    {item.character}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/quiz"
              className="inline-block bg-[#4F7D5A] hover:bg-[#355C3F] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Quiz
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-academic-text mb-4">Weakest Kana</h2>
              <div className="space-y-2">
                {stats.weakestKana.map((kana) => (
                  <div key={kana.character} className="flex justify-between text-academic-text">
                    <span className="text-2xl">{kana.character}</span>
                    <span>{kana.accuracy}% accuracy, {kana.incorrect} missed</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-academic-text mb-4">Most Confused Pairs</h2>
              {stats.mostConfusedPairs.length === 0 ? (
                <p className="text-academic-muted">No confusion pairs detected yet.</p>
              ) : (
                <div className="space-y-2">
                  {stats.mostConfusedPairs.slice(0, 8).map((pair) => (
                    <div key={pair.pair} className="flex justify-between text-academic-text">
                      <span>{pair.pair}</span>
                      <span>{pair.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-academic-text mb-4">Accuracy by Group</h2>
              <div className="space-y-2">
                {stats.accuracyByGroup.map((group) => (
                  <div key={group.group} className="flex justify-between text-academic-text">
                    <span>{group.group}</span>
                    <span>{group.accuracy}% ({group.attempts} attempts)</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-academic-text mb-4">Recent Progress</h2>
              {stats.recentlyImprovedKana.length === 0 ? (
                <p className="text-academic-muted">More attempts are needed to compare recent improvement.</p>
              ) : (
                <div className="space-y-2">
                  {stats.recentlyImprovedKana.map((kana) => (
                    <div key={kana.character} className="flex justify-between text-academic-text">
                      <span className="text-2xl">{kana.character}</span>
                      <span>+{kana.improvement} percentage points</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
