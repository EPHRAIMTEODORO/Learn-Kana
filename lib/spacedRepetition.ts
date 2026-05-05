import {
  LearningItemCategory,
  LearningItemProgress,
  UserData,
} from '@/types/kana';
import { LearningItem, getAllLearningItems } from '@/lib/items';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

export interface ReviewSelection {
  dueItems: LearningItemProgress[];
  weakItems: LearningItemProgress[];
  newItems: LearningItem[];
}

function clampEase(value: number): number {
  return Number(Math.max(MIN_EASE_FACTOR, value).toFixed(2));
}

export function createInitialProgress(
  item: LearningItem,
  now = Date.now()
): LearningItemProgress {
  return {
    itemId: item.id,
    character: item.character,
    category: item.category,
    grade: item.grade,
    correct: 0,
    incorrect: 0,
    attempts: 0,
    lastSeen: null,
    lastReviewed: now,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    nextReviewAt: now,
    consecutiveCorrect: 0,
    recentFailures: [],
    firstSeen: now,
  };
}

export function updateSpacedRepetition(
  progress: LearningItemProgress,
  isCorrect: boolean,
  now = Date.now()
): LearningItemProgress {
  const attempts = progress.attempts + 1;
  const correct = progress.correct + (isCorrect ? 1 : 0);
  const incorrect = progress.incorrect + (isCorrect ? 0 : 1);
  const consecutiveCorrect = isCorrect ? progress.consecutiveCorrect + 1 : 0;
  const quality = isCorrect ? 4 : 2;
  const easeDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  const easeFactor = clampEase(progress.easeFactor + easeDelta);

  const interval = isCorrect
    ? consecutiveCorrect === 1
      ? 1
      : Math.max(1, Math.round(Math.max(progress.interval, 1) * easeFactor))
    : 0;

  return {
    ...progress,
    correct,
    incorrect,
    attempts,
    lastSeen: now,
    lastReviewed: now,
    easeFactor,
    interval,
    nextReviewAt: isCorrect ? now + interval * DAY_MS : now,
    consecutiveCorrect,
    recentFailures: isCorrect
      ? progress.recentFailures
      : [now, ...progress.recentFailures].slice(0, 5),
  };
}

function getAccuracy(progress: LearningItemProgress): number {
  if (progress.attempts === 0) return 0;
  return progress.correct / progress.attempts;
}

function weaknessScore(progress: LearningItemProgress, now: number): number {
  const accuracyPenalty = (1 - getAccuracy(progress)) * 100;
  const failurePenalty = progress.recentFailures.some(
    (timestamp) => now - timestamp < DAY_MS
  )
    ? 35
    : 0;
  const practicePenalty = Math.min(progress.incorrect * 8, 40);
  return accuracyPenalty + failurePenalty + practicePenalty;
}

export function getNextReviewItems(
  userData: UserData,
  options: {
    category?: LearningItemCategory;
    grade?: string;
    limit?: number;
    now?: number;
  } = {}
): ReviewSelection {
  const now = options.now ?? Date.now();
  const limit = options.limit ?? 10;
  const scopeMatches = (item: { category: LearningItemCategory; grade?: string }) =>
    (!options.category || item.category === options.category) &&
    (!options.grade || item.grade === options.grade);

  const progressItems = Object.values(userData.progress).filter(scopeMatches);
  const dueItems = progressItems
    .filter((item) => item.attempts > 0 && item.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
    .slice(0, limit);

  const weakItems = progressItems
    .filter((item) => item.attempts > 0)
    .sort((a, b) => weaknessScore(b, now) - weaknessScore(a, now))
    .slice(0, limit);

  const seen = new Set(progressItems.map((item) => item.itemId));
  const newItems = getAllLearningItems()
    .filter(scopeMatches)
    .filter((item) => !seen.has(item.id))
    .slice(0, limit);

  return {
    dueItems,
    weakItems,
    newItems,
  };
}
