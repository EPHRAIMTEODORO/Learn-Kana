'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { kanjiGradeSections } from '@/data/kanji';
import { CharacterProgress, LearningItemCategory } from '@/types/kana';
import { getAllProgress } from '@/utils/progress';
import AppNav from '@/components/AppNav';
import ProgressSummary from '@/components/ProgressSummary';

function calculateAccuracy(progress: CharacterProgress) {
  const attempts = progress.attempts ?? progress.correct + progress.incorrect;
  if (attempts === 0) return 0;
  return Math.round((progress.correct / attempts) * 100);
}

function formatDate(timestamp?: number | null) {
  if (!timestamp) return 'Not reviewed';
  return new Date(timestamp).toLocaleDateString();
}

function getCategoryLabel(category?: LearningItemCategory) {
  if (category === 'hiragana') return 'Hiragana';
  if (category === 'katakana') return 'Katakana';
  return 'Kanji';
}

function getStudyStreak(progressData: CharacterProgress[]) {
  const studiedDays = new Set(
    progressData
      .filter((item) => item.lastReviewed)
      .map((item) => new Date(item.lastReviewed).toDateString())
  );

  let streak = 0;
  const cursor = new Date();

  while (studiedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<CharacterProgress[]>([]);

  useEffect(() => {
    setProgressData(getAllProgress());
  }, []);

  const totalCharactersStudied = progressData.length;
  const totalCorrect = progressData.reduce((sum, item) => sum + item.correct, 0);
  const totalAttempts = progressData.reduce(
    (sum, item) => sum + (item.attempts ?? item.correct + item.incorrect),
    0
  );
  const overallAccuracy = totalAttempts > 0
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0;
  const streak = getStudyStreak(progressData);

  const categoryStats = (['hiragana', 'katakana', 'kanji'] as LearningItemCategory[]).map((category) => {
    const items = progressData.filter((item) => item.category === category);
    const attempts = items.reduce(
      (sum, item) => sum + (item.attempts ?? item.correct + item.incorrect),
      0
    );
    const correct = items.reduce((sum, item) => sum + item.correct, 0);

    return {
      category,
      label: getCategoryLabel(category),
      attempts,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    };
  });

  const weakestCharacters = [...progressData]
    .filter((item) => (item.attempts ?? item.correct + item.incorrect) > 0)
    .sort((a, b) => calculateAccuracy(a) - calculateAccuracy(b) || b.incorrect - a.incorrect)
    .slice(0, 10);

  const recentMistakes = progressData
    .flatMap((item) =>
      (item.recentFailures ?? []).map((timestamp) => ({
        character: item.character,
        category: item.category,
        timestamp,
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  const gradeCompletion = kanjiGradeSections.map((section) => {
    const learned = section.kanji.filter((kanji) => {
      const progress = progressData.find((item) => item.character === kanji.character);
      return progress && (progress.attempts ?? progress.correct + progress.incorrect) > 0;
    }).length;

    return {
      grade: section.gradeName,
      learned,
      total: section.kanji.length,
      percent: section.kanji.length > 0 ? Math.round((learned / section.kanji.length) * 100) : 0,
    };
  });

  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
              Learning dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold text-academic-text">
              Progress and weak areas
            </h1>
            <p className="mt-3 max-w-2xl text-academic-muted">
              Use these signals to decide whether to learn new items or review mistakes next.
            </p>
          </div>
          <Link href="/settings" className="rounded-md px-3 py-2 text-sm font-semibold text-academic-primary outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-academic-primary">
            Settings
          </Link>
        </div>

        <div className="mb-8">
          <ProgressSummary
            totalLearned={totalCharactersStudied}
            accuracy={overallAccuracy}
            streak={streak}
            attempts={totalAttempts}
          />
        </div>

        {progressData.length === 0 ? (
          <div className="rounded-lg border border-academic-border bg-white p-12 text-center shadow-sm">
            <p className="mb-4 text-xl text-academic-muted">
              No learning data yet. Start a quiz or flashcard session to build your learner model.
            </p>
            <Link
              href="/quiz"
              className="inline-block rounded-md bg-academic-primary px-5 py-3 font-semibold text-white outline-none hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary"
            >
              Start Practice
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-academic-text">Progress by Category</h2>
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category}>
                    <div className="mb-1 flex justify-between text-sm text-academic-muted">
                      <span>{stat.label}</span>
                      <span>{stat.accuracy}% ({stat.attempts} attempts)</span>
                    </div>
                    <div className="h-3 rounded-full bg-academic-section">
                      <div className="h-3 rounded-full bg-academic-primary" style={{ width: `${stat.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-academic-text">Weak Areas</h2>
              <div className="space-y-3">
                {weakestCharacters.map((item) => (
                  <div key={item.character} className="flex items-center justify-between text-academic-text">
                    <span className="text-2xl">{item.character}</span>
                    <span>{calculateAccuracy(item)}% accuracy, {item.incorrect} missed</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-academic-text">Recent Mistakes</h2>
              {recentMistakes.length === 0 ? (
                <p className="text-academic-muted">No recent mistakes recorded.</p>
              ) : (
                <div className="space-y-3">
                  {recentMistakes.map((mistake) => (
                    <div key={`${mistake.character}-${mistake.timestamp}`} className="flex items-center justify-between text-academic-text">
                      <span className="text-2xl">{mistake.character}</span>
                      <span>{getCategoryLabel(mistake.category)} · {formatDate(mistake.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-academic-text">Kanji Completion by Grade</h2>
              <div className="space-y-4">
                {gradeCompletion.map((grade) => (
                  <div key={grade.grade}>
                    <div className="mb-1 flex justify-between text-sm text-academic-muted">
                      <span>{grade.grade}</span>
                      <span>{grade.learned}/{grade.total}</span>
                    </div>
                    <div className="h-3 rounded-full bg-academic-section">
                      <div className="h-3 rounded-full bg-blue-500" style={{ width: `${grade.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
