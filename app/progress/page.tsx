'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CharacterProgress } from '@/types/kana';
import { getAllProgress, clearAllProgress } from '@/utils/progress';

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<CharacterProgress[]>([]);
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const data = getAllProgress();
    setProgressData(data);
  };

  const handleClearProgress = () => {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      clearAllProgress();
      loadProgress();
    }
  };

  const calculateAccuracy = (progress: CharacterProgress) => {
    const total = progress.correct + progress.incorrect;
    if (total === 0) return 0;
    return Math.round((progress.correct / total) * 100);
  };

  const filteredData = progressData.filter(item => {
    if (filter === 'all') return true;
    const accuracy = calculateAccuracy(item);
    if (filter === 'mastered') return accuracy >= 80;
    if (filter === 'learning') return accuracy < 80;
    return true;
  });

  const totalCharactersStudied = progressData.length;
  const totalCorrect = progressData.reduce((sum, item) => sum + item.correct, 0);
  const totalIncorrect = progressData.reduce((sum, item) => sum + item.incorrect, 0);
  const overallAccuracy = totalCorrect + totalIncorrect > 0
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Progress
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Summary Stats */}
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
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Correct Answers</p>
            <p className="text-3xl font-bold text-blue-600">{totalCorrect}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Incorrect Answers</p>
            <p className="text-3xl font-bold text-orange-600">{totalIncorrect}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All ({progressData.length})
          </button>
          <button
            onClick={() => setFilter('learning')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'learning'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Learning (&lt;80%)
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'mastered'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Mastered (≥80%)
          </button>
        </div>

        {/* Progress Table */}
        {filteredData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              No progress data yet. Start learning to track your progress!
            </p>
            <Link
              href="/learn"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Learning
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Character
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Correct
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Incorrect
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Reviewed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredData.map((item) => {
                      const accuracy = calculateAccuracy(item);
                      const lastReviewed = new Date(item.lastReviewed).toLocaleDateString();
                      
                      return (
                        <tr key={item.character} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-3xl">{item.character}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {item.correct}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                            {item.incorrect}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2 max-w-[100px]">
                                <div
                                  className={`h-2 rounded-full ${
                                    accuracy >= 80 ? 'bg-green-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${accuracy}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {accuracy}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {lastReviewed}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clear Progress Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleClearProgress}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Clear All Progress
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
