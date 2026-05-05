'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LearningItemCategory, RecommendedLearningItem } from '@/types/kana';
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
  category,
  grade,
}: {
  title?: string;
  description?: string;
  limit?: number;
  compact?: boolean;
  category?: LearningItemCategory;
  grade?: string;
}) {
  const [items, setItems] = useState<RecommendedLearningItem[]>([]);

  useEffect(() => {
    setItems(getRecommendedNext(getUserData(), { category, grade, limit }));
  }, [category, grade, limit]);

  return (
    <section className="rounded-lg border-2 border-[#C8D0F0] bg-[#F0F2FC] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-academic-primary">
            Adaptive recommendation
          </p>
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} mt-1 font-bold text-academic-text`}>
            {title}
          </h2>
          <p className="mt-1 text-sm text-academic-muted">{description}</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-2 text-sm font-semibold text-academic-primary outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-academic-primary"
        >
          View evidence
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-academic-muted">
          Start a practice session to generate personalized recommendations.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, limit).map((item) => (
            <div
              key={item.itemId}
              className="rounded-md border border-[#DDE2F5] bg-white p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-3xl font-semibold text-academic-text">
                  {item.character}
                </span>
                <span className="rounded-full bg-[#E8EAF6] px-2 py-1 text-xs font-medium text-academic-primary">
                  {readableReason(item)}
                </span>
              </div>
              <p className="mt-2 text-xs text-academic-muted">
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
