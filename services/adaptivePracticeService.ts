import { allKanaData } from '@/data/kana';
import { KanaCharacter, KanaPracticeMode, KanaStats, KanaType, QuizAttempt } from '@/types/kana';
import { getAttempts } from '@/storage/attemptRepository';
import { calculateLearnerStats } from '@/services/analyticsService';
import { getRecommendedNext } from '@/lib/recommendations';
import { getUserData } from '@/lib/storage';

export interface AdaptiveCandidate {
  kana: KanaCharacter;
  priorityScore: number;
  reasons: string[];
}

const TARGET_RESPONSE_TIME_MS = 3500;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getKanaStats(stats: KanaStats[], character: string): KanaStats | undefined {
  return stats.find((item) => item.character === character);
}

function getRecentIncorrectWeight(attempts: QuizAttempt[], character: string): number {
  const recentAttempts = attempts
    .filter((attempt) => attempt.characterShown === character)
    .slice(-3);

  if (recentAttempts.some((attempt) => !attempt.isCorrect)) return 25;
  return 0;
}

function getRecencyWeight(kanaStats?: KanaStats): number {
  if (!kanaStats?.lastPracticedAt) return 20;

  const elapsedHours =
    (Date.now() - new Date(kanaStats.lastPracticedAt).getTime()) / (1000 * 60 * 60);

  return Math.min(20, Math.round(elapsedHours / 6));
}

function scoreKana(
  kana: KanaCharacter,
  attempts: QuizAttempt[],
  stats: KanaStats[]
): AdaptiveCandidate {
  const kanaStats = getKanaStats(stats, kana.character);
  const lowAccuracyWeight = kanaStats?.attempts
    ? Math.max(0, 100 - kanaStats.accuracy) * 0.35
    : 12;
  const mistakeWeight = Math.min((kanaStats?.incorrect ?? 0) * 8, 32);
  const slowResponseWeight = kanaStats?.averageResponseTimeMs
    ? Math.min(
        Math.max(0, kanaStats.averageResponseTimeMs - TARGET_RESPONSE_TIME_MS) / 180,
        20
      )
    : 0;
  const recencyWeight = getRecencyWeight(kanaStats);
  const confusionWeight = Math.min((kanaStats?.confusionCount ?? 0) * 12, 30);
  const recentIncorrectWeight = getRecentIncorrectWeight(attempts, kana.character);

  const reasons = [
    mistakeWeight > 0 ? 'missed before' : null,
    lowAccuracyWeight >= 16 ? 'low accuracy' : null,
    slowResponseWeight > 0 ? 'slow response' : null,
    recencyWeight >= 12 ? 'needs review' : null,
    confusionWeight > 0 ? 'confusion pair' : null,
    recentIncorrectWeight > 0 ? 'recent mistake' : null,
  ].filter((reason): reason is string => Boolean(reason));

  return {
    kana,
    priorityScore:
      mistakeWeight +
      lowAccuracyWeight +
      slowResponseWeight +
      recencyWeight +
      confusionWeight +
      recentIncorrectWeight,
    reasons,
  };
}

function filterByKanaType(data: KanaCharacter[], kanaType?: KanaType | 'mixed') {
  if (!kanaType || kanaType === 'mixed') return data;
  return data.filter((kana) => kana.type === kanaType);
}

/**
 * Adaptive selection supports personalized learning with transparent scoring:
 * mistakes, low accuracy, slow answers, recency, and confusion pairs all matter.
 */
export function getAdaptiveCandidates(
  kanaType?: KanaType | 'mixed',
  attempts: QuizAttempt[] = getAttempts()
): AdaptiveCandidate[] {
  const learnerStats = calculateLearnerStats(attempts);
  return filterByKanaType(allKanaData, kanaType)
    .map((kana) => scoreKana(kana, attempts, learnerStats.accuracyByKana))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getRecommendedPracticeKana(
  count: number,
  kanaType?: KanaType | 'mixed',
  attempts: QuizAttempt[] = getAttempts()
): KanaCharacter[] {
  const category = kanaType && kanaType !== 'mixed' ? kanaType : undefined;
  const recommendedCharacters = getRecommendedNext(getUserData(), {
    category,
    limit: count,
  }).map((item) => item.character);
  const recommendedKana = allKanaData.filter((kana) =>
    recommendedCharacters.includes(kana.character)
  );

  if (recommendedKana.length >= count) {
    return recommendedKana.slice(0, count);
  }

  const candidates = getAdaptiveCandidates(kanaType, attempts);
  const topPool = candidates.slice(0, Math.max(count * 2, count));
  const explorationPool = candidates.slice(Math.max(count * 2, count));
  const selected = shuffle(topPool).slice(0, Math.ceil(count * 0.8));

  if (selected.length < count) {
    selected.push(...shuffle(explorationPool).slice(0, count - selected.length));
  }

  return selected.slice(0, count).map((candidate) => candidate.kana);
}

export function getReviewMistakeKana(
  count: number,
  kanaType?: KanaType | 'mixed',
  attempts: QuizAttempt[] = getAttempts()
): KanaCharacter[] {
  const learnerStats = calculateLearnerStats(attempts);
  const missedCharacters = learnerStats.mostMissedKana
    .filter((kana) => !kanaType || kanaType === 'mixed' || kana.kanaType === kanaType)
    .map((kana) => kana.character);
  const missedKana = allKanaData.filter((kana) => missedCharacters.includes(kana.character));

  if (missedKana.length >= count) return shuffle(missedKana).slice(0, count);

  const fallback = getRecommendedPracticeKana(count, kanaType, attempts).filter(
    (kana) => !missedCharacters.includes(kana.character)
  );

  return [...shuffle(missedKana), ...fallback].slice(0, count);
}

export function getPracticeKana(
  practiceMode: KanaPracticeMode,
  count: number,
  kanaType?: KanaType | 'mixed'
): KanaCharacter[] {
  if (practiceMode === 'recommended') {
    return getRecommendedPracticeKana(count, kanaType);
  }

  if (practiceMode === 'review_mistakes') {
    return getReviewMistakeKana(count, kanaType);
  }

  return shuffle(filterByKanaType(allKanaData, kanaType)).slice(0, count);
}
