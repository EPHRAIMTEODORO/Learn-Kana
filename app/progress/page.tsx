'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { kanjiGradeSections } from '@/data/kanji';
import { CharacterProgress, LearningItemCategory } from '@/types/kana';
import { getAllProgress } from '@/utils/progress';

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
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-green-600 dark:text-green-400 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Analytics
          </h1>
          <Link href="/settings" className="text-green-600 dark:text-green-400 hover:underline">
            Settings
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Characters Studied</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCharactersStudied}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Overall Accuracy</p>
            <p className="text-3xl font-bold text-green-600">{overallAccuracy}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Total Attempts</p>
            <p className="text-3xl font-bold text-blue-600">{totalAttempts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Study Streak</p>
            <p className="text-3xl font-bold text-orange-600">{streak} days</p>
          </div>
        </div>

        {progressData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              No learning data yet. Start a quiz or flashcard session to build your learner model.
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accuracy by Category</h2>
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category}>
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <span>{stat.label}</span>
                      <span>{stat.accuracy}% ({stat.attempts} attempts)</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-3 rounded-full bg-green-500" style={{ width: `${stat.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weakest 10 Characters</h2>
              <div className="space-y-3">
                {weakestCharacters.map((item) => (
                  <div key={item.character} className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                    <span className="text-2xl">{item.character}</span>
                    <span>{calculateAccuracy(item)}% accuracy, {item.incorrect} missed</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Mistakes</h2>
              {recentMistakes.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No recent mistakes recorded.</p>
              ) : (
                <div className="space-y-3">
                  {recentMistakes.map((mistake) => (
                    <div key={`${mistake.character}-${mistake.timestamp}`} className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                      <span className="text-2xl">{mistake.character}</span>
                      <span>{getCategoryLabel(mistake.category)} · {formatDate(mistake.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kanji Completion by Grade</h2>
              <div className="space-y-4">
                {gradeCompletion.map((grade) => (
                  <div key={grade.grade}>
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <span>{grade.grade}</span>
                      <span>{grade.learned}/{grade.total}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
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
