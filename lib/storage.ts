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
const USER_DATA_API_PATH = '/api/user-data';

let cachedUserData: UserData | null = null;
let pendingRemoteSync: Promise<void> | null = null;

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

function hasLearningData(userData: UserData): boolean {
  return Object.keys(userData.progress).length > 0 || userData.attempts.length > 0;
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
  cachedUserData = updated;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
  return updated;
}

function mergeUserData(localData: UserData, remoteData: UserData): UserData {
  const attemptsById = new Map<string, QuizAttempt>();

  [...remoteData.attempts, ...localData.attempts].forEach((attempt) => {
    attemptsById.set(attempt.id, attempt);
  });

  return {
    ...remoteData,
    progress: {
      ...remoteData.progress,
      ...localData.progress,
    },
    attempts: Array.from(attemptsById.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    ),
    createdAt:
      remoteData.createdAt < localData.createdAt ? remoteData.createdAt : localData.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

async function putRemoteUserData(userData: UserData): Promise<UserData | null> {
  if (!isBrowser()) return null;

  try {
    const response = await fetch(USER_DATA_API_PATH, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { userData?: UserData };
    return payload.userData ?? null;
  } catch (error) {
    console.error('Error syncing learner data to MongoDB:', error);
    return null;
  }
}

function syncUserDataToMongo(userData: UserData): void {
  if (!isBrowser()) return;

  pendingRemoteSync = (pendingRemoteSync ?? Promise.resolve())
    .then(async () => {
      const remoteData = await putRemoteUserData(userData);
      if (remoteData) {
        persistUserData(remoteData);
      }
    })
    .catch((error) => {
      console.error('Error queueing learner data sync:', error);
    })
    .finally(() => {
      pendingRemoteSync = null;
    });
}

export function getUserData(): UserData {
  if (!isBrowser()) return createEmptyUserData();
  if (cachedUserData) return cachedUserData;

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
      cachedUserData = {
        ...createEmptyUserData(),
        ...parsed,
        progress,
        attempts: parsed.attempts ?? [],
      };
      return cachedUserData;
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
  const persisted = persistUserData(next);
  syncUserDataToMongo(persisted);
  return persisted;
}

export async function hydrateUserDataFromMongo(): Promise<UserData> {
  if (!isBrowser()) return createEmptyUserData();

  const localData = getUserData();

  try {
    const response = await fetch(USER_DATA_API_PATH);
    if (!response.ok) return localData;

    const payload = (await response.json()) as { userData?: UserData };
    const remoteData = payload.userData;
    if (!remoteData) return localData;

    const nextData = hasLearningData(localData)
      ? mergeUserData(localData, remoteData)
      : remoteData;

    const persisted = persistUserData(nextData);

    if (hasLearningData(localData)) {
      syncUserDataToMongo(persisted);
    }

    return persisted;
  } catch (error) {
    console.error('Error loading learner data from MongoDB:', error);
    return localData;
  }
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
  cachedUserData = createEmptyUserData();
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(LEGACY_PROGRESS_KEY);
  localStorage.removeItem(LEGACY_ATTEMPTS_KEY);
  fetch(USER_DATA_API_PATH, { method: 'DELETE' }).catch((error) => {
    console.error('Error clearing learner data from MongoDB:', error);
  });
}

export function forgetCachedUserData(): void {
  if (!isBrowser()) return;
  cachedUserData = null;
  localStorage.removeItem(USER_DATA_KEY);
}
