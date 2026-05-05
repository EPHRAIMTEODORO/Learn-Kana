'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecommendedLearningItem } from '@/types/kana';
import { getRecommendedNext } from '@/lib/recommendations';
import { getUserData } from '@/lib/storage';

function readableReason(item: RecommendedLearningItem) {
  if (item.reasons.some((reason) => reason.includes('due'))) return 'Needs review';
  if (item.reasons.some((reason) => reason.includes('low accuracy'))) return 'Low accuracy';
  if (item.reasons.some((reason) => reason.includes('new'))) return 'New item';
  if (item.reasons.some((reason) => reason.includes('missed'))) return 'Recent mistake';
  return item.reasons[0] ?? 'Recommended';
}

export default function RecommendedSection({
  title = 'Recommended for You',
  description = 'Personalized from review timing, accuracy, and recent mistakes.',
  limit = 8,
  compact = false,
}: {
  title?: string;
  description?: string;
  limit?: number;
  compact?: boolean;
}) {
  const [items, setItems] = useState<RecommendedLearningItem[]>([]);

  useEffect(() => {
    setItems(getRecommendedNext(getUserData(), { limit }));
  }, [limit]);

  return (
    <section className="rounded-lg border-2 border-indigo-200 bg-indigo-50/70 p-5 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Adaptive recommendation
          </p>
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} mt-1 font-bold text-slate-950 dark:text-white`}>
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{description}</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-2 text-sm font-semibold text-indigo-700 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-200 dark:hover:bg-slate-900"
        >
          View evidence
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Start a practice session to generate personalized recommendations.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, limit).map((item) => (
            <div
              key={item.itemId}
              className="rounded-md border border-indigo-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-3xl font-semibold text-slate-950 dark:text-white">
                  {item.character}
                </span>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                  {readableReason(item)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {item.category === 'kanji' ? 'Kanji' : item.category === 'hiragana' ? 'Hiragana' : 'Katakana'}
                {item.accuracy > 0 ? ` · ${item.accuracy}% accuracy` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
