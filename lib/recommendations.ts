import {
  LearningItemCategory,
  LearningItemProgress,
  RecommendationTrace,
  RecommendedLearningItem,
  UserData,
} from '@/types/kana';
import { getNextReviewItems } from '@/lib/spacedRepetition';
import { getAllLearningItems } from '@/lib/items';

const DAY_MS = 24 * 60 * 60 * 1000;

function accuracy(progress: LearningItemProgress): number {
  if (progress.attempts === 0) return 0;
  return Math.round((progress.correct / progress.attempts) * 100);
}

function toRecommendation(
  progress: LearningItemProgress,
  now: number
): RecommendedLearningItem {
  const itemAccuracy = accuracy(progress);
  const isDue = progress.nextReviewAt <= now;
  const recentFailure = progress.recentFailures.some(
    (timestamp) => now - timestamp < DAY_MS
  );

  const reasons = [
    isDue ? 'due for spaced review' : null,
    itemAccuracy < 70 ? 'low accuracy' : null,
    recentFailure ? 'recently missed' : null,
    progress.incorrect > 0 ? `${progress.incorrect} mistake${progress.incorrect === 1 ? '' : 's'}` : null,
  ].filter((reason): reason is string => Boolean(reason));

  return {
    itemId: progress.itemId,
    character: progress.character,
    category: progress.category,
    grade: progress.grade,
    accuracy: itemAccuracy,
    priorityScore:
      (isDue ? 100 : 0) +
      (100 - itemAccuracy) +
      (recentFailure ? 50 : 0) +
      Math.min(progress.incorrect * 8, 40),
    reasons,
    nextReviewAt: progress.nextReviewAt,
  };
}

export function getRecommendedNext(
  userData: UserData,
  options: {
    category?: LearningItemCategory;
    grade?: string;
    limit?: number;
    now?: number;
  } = {}
): RecommendedLearningItem[] {
  const now = options.now ?? Date.now();
  const limit = options.limit ?? 10;
  const selection = getNextReviewItems(userData, { ...options, limit, now });
  const byId = new Map<string, RecommendedLearningItem>();

  [...selection.dueItems, ...selection.weakItems].forEach((progress) => {
    byId.set(progress.itemId, toRecommendation(progress, now));
  });

  if (byId.size < limit) {
    selection.newItems.forEach((item, index) => {
      if (byId.size >= limit) return;
      byId.set(item.id, {
        itemId: item.id,
        character: item.character,
        category: item.category,
        grade: item.grade,
        accuracy: 0,
        priorityScore: 10 - index,
        reasons: ['new character'],
      });
    });
  }

  return Array.from(byId.values())
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit);
}

export function getRecommendedCharacters(
  userData: UserData,
  options: {
    category?: LearningItemCategory;
    grade?: string;
    limit?: number;
  } = {}
): string[] {
  const recommended = getRecommendedNext(userData, options);

  if (recommended.length > 0) {
    return recommended.map((item) => item.character);
  }

  return getAllLearningItems()
    .filter((item) => !options.category || item.category === options.category)
    .filter((item) => !options.grade || item.grade === options.grade)
    .slice(0, options.limit ?? 10)
    .map((item) => item.character);
}

export function getRecommendationTrace(
  userData: UserData,
  options: {
    category?: LearningItemCategory;
    grade?: string;
    limit?: number;
    now?: number;
  } = {}
): RecommendationTrace {
  const now = options.now ?? Date.now();
  const limit = options.limit ?? 10;
  const selection = getNextReviewItems(userData, { ...options, limit, now });
  const selectedCount = getRecommendedNext(userData, { ...options, limit, now }).length;

  return {
    policy: 'Due reviews first, then weak items, then new curriculum items',
    dueCount: selection.dueItems.length,
    weakCount: selection.weakItems.length,
    newCount: selection.newItems.length,
    selectedCount,
    signals: [
      {
        name: 'Review schedule',
        description: 'Items whose next review time has arrived are prioritized.',
        weight: '+100',
      },
      {
        name: 'Accuracy gap',
        description: 'Lower item accuracy increases ranking priority.',
        weight: '100 - accuracy',
      },
      {
        name: 'Recent failure',
        description: 'Items missed within the last day receive immediate attention.',
        weight: '+50',
      },
      {
        name: 'Mistake count',
        description: 'Repeated misses add bounded priority so hard items resurface.',
        weight: 'up to +40',
      },
    ],
  };
}
