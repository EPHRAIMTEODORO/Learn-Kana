import {
  LearningItemProgress,
  QuizAttempt,
  UserData,
} from '@/types/kana';
import { getLearningItem } from '@/lib/items';
import {
  createInitialProgress,
  updateSpacedRepetition,
} from '@/lib/spacedRepetition';

const USER_DATA_KEY = 'learn-kana-user-data';
const LEGACY_PROGRESS_KEY = 'kana-progress';
const LEGACY_ATTEMPTS_KEY = 'kana-attempts';

function isBrowser() {
  return typeof window !== 'undefined';
}

function createEmptyUserData(): UserData {
  const now = new Date().toISOString();
  return {
    version: 1,
    progress: {},
    attempts: [],
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeProgress(value: Partial<LearningItemProgress>): LearningItemProgress {
  const character = value.character ?? value.itemId ?? '';
  const item = getLearningItem(character);
  const base = createInitialProgress(item, value.firstSeen ?? Date.now());
  const correct = value.correct ?? 0;
  const incorrect = value.incorrect ?? 0;
  const attempts = value.attempts ?? correct + incorrect;
  const lastSeen = value.lastSeen ?? value.lastReviewed ?? base.lastSeen;

  return {
    ...base,
    ...value,
    itemId: value.itemId ?? item.id,
    character: item.character,
    category: value.category ?? item.category,
    grade: value.grade ?? item.grade,
    correct,
    incorrect,
    attempts,
    lastSeen,
    lastReviewed: value.lastReviewed ?? lastSeen ?? base.lastReviewed,
    easeFactor: value.easeFactor ?? base.easeFactor,
    interval: value.interval ?? base.interval,
    nextReviewAt: value.nextReviewAt ?? base.nextReviewAt,
    consecutiveCorrect: value.consecutiveCorrect ?? 0,
    recentFailures: value.recentFailures ?? [],
  };
}

function migrateLegacyData(): UserData {
  const data = createEmptyUserData();

  try {
    const progressValue = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (progressValue) {
      const legacyProgress = JSON.parse(progressValue) as Record<
        string,
        Partial<LearningItemProgress>
      >;

      Object.values(legacyProgress).forEach((progress) => {
        const normalized = normalizeProgress(progress);
        data.progress[normalized.itemId] = normalized;
      });
    }

    const attemptsValue = localStorage.getItem(LEGACY_ATTEMPTS_KEY);
    if (attemptsValue) {
      data.attempts = JSON.parse(attemptsValue) as QuizAttempt[];
    }
  } catch (error) {
    console.error('Error migrating learner data:', error);
  }

  return data;
}

function persistUserData(userData: UserData): UserData {
  const updated = {
    ...userData,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
  return updated;
}

export function getUserData(): UserData {
  if (!isBrowser()) return createEmptyUserData();

  try {
    const value = localStorage.getItem(USER_DATA_KEY);
    if (value) {
      const parsed = JSON.parse(value) as UserData;
      const progress = Object.fromEntries(
        Object.entries(parsed.progress ?? {}).map(([key, item]) => [
          key,
          normalizeProgress(item),
        ])
      );
      return {
        ...createEmptyUserData(),
        ...parsed,
        progress,
        attempts: parsed.attempts ?? [],
      };
    }

    const migrated = migrateLegacyData();
    persistUserData(migrated);
    return migrated;
  } catch (error) {
    console.error('Error loading learner data:', error);
    return createEmptyUserData();
  }
}

export function updateUserData(
  updater: UserData | ((current: UserData) => UserData)
): UserData {
  if (!isBrowser()) return createEmptyUserData();

  const current = getUserData();
  const next = typeof updater === 'function' ? updater(current) : updater;
  return persistUserData(next);
}

export function recordItemResult(character: string, isCorrect: boolean): LearningItemProgress {
  const item = getLearningItem(character);
  let updatedProgress = createInitialProgress(item);

  updateUserData((current) => {
    const existing = current.progress[item.id]
      ? normalizeProgress(current.progress[item.id])
      : createInitialProgress(item);

    updatedProgress = updateSpacedRepetition(existing, isCorrect);

    return {
      ...current,
      progress: {
        ...current.progress,
        [item.id]: updatedProgress,
      },
    };
  });

  return updatedProgress;
}

export function addAttempt(attempt: QuizAttempt): void {
  updateUserData((current) => ({
    ...current,
    attempts: [...current.attempts, attempt],
  }));
}

export function resetData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(LEGACY_PROGRESS_KEY);
  localStorage.removeItem(LEGACY_ATTEMPTS_KEY);
}
