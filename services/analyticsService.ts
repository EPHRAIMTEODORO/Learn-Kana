import { allKanaData } from '@/data/kana';
import {
  ConfusionPairStats,
  GroupStats,
  KanaStats,
  LearnerStats,
  QuizAttempt,
} from '@/types/kana';
import { getAttempts } from '@/storage/attemptRepository';
import { getKanaGroup } from '@/services/kanaMetadata';

const RECENT_WINDOW = 5;

function roundPercent(value: number): number {
  return Math.round(value * 100);
}

function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return roundPercent(correct / total);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getAttemptsForKana(attempts: QuizAttempt[], character: string) {
  return attempts.filter((attempt) => attempt.characterShown === character);
}

function sortByWeakness(a: KanaStats, b: KanaStats) {
  if (a.attempts === 0 && b.attempts > 0) return 1;
  if (b.attempts === 0 && a.attempts > 0) return -1;
  if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
  if (a.incorrect !== b.incorrect) return b.incorrect - a.incorrect;
  return b.averageResponseTimeMs - a.averageResponseTimeMs;
}

/**
 * Attempt logs support educational data mining by turning quiz events into
 * reusable learner statistics instead of one-off UI state.
 */
export function calculateLearnerStats(attempts: QuizAttempt[]): LearnerStats {
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((attempt) => attempt.isCorrect).length;
  const incorrectAttempts = totalAttempts - correctAttempts;
  const overallAccuracy = calculateAccuracy(correctAttempts, totalAttempts);
  const averageResponseTimeMs = average(
    attempts.map((attempt) => attempt.responseTimeMs)
  );

  const accuracyByKana: KanaStats[] = allKanaData.map((kana) => {
    const kanaAttempts = getAttemptsForKana(attempts, kana.character);
    const correct = kanaAttempts.filter((attempt) => attempt.isCorrect).length;
    const incorrect = kanaAttempts.length - correct;
    const recentAttempts = kanaAttempts.slice(-RECENT_WINDOW);
    const previousAttempts = kanaAttempts.slice(-RECENT_WINDOW * 2, -RECENT_WINDOW);
    const recentCorrect = recentAttempts.filter((attempt) => attempt.isCorrect).length;
    const previousCorrect = previousAttempts.filter((attempt) => attempt.isCorrect).length;
    const recentAccuracy = calculateAccuracy(recentCorrect, recentAttempts.length);
    const previousAccuracy = calculateAccuracy(previousCorrect, previousAttempts.length);

    return {
      character: kana.character,
      romaji: kana.romaji,
      kanaType: kana.type,
      group: getKanaGroup(kana),
      attempts: kanaAttempts.length,
      correct,
      incorrect,
      accuracy: calculateAccuracy(correct, kanaAttempts.length),
      averageResponseTimeMs: average(
        kanaAttempts.map((attempt) => attempt.responseTimeMs)
      ),
      lastPracticedAt: kanaAttempts.at(-1)?.createdAt,
      recentAccuracy,
      previousAccuracy,
      improvement:
        previousAttempts.length > 0 && recentAttempts.length > 0
          ? recentAccuracy - previousAccuracy
          : 0,
      confusionCount: kanaAttempts.filter((attempt) => attempt.confusionPair).length,
    };
  });

  const groupMap = new Map<string, GroupStats>();
  attempts.forEach((attempt) => {
    const group = attempt.group ?? 'unknown';
    const existing =
      groupMap.get(group) ??
      ({
        group,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
      } satisfies GroupStats);

    existing.attempts += 1;
    if (attempt.isCorrect) {
      existing.correct += 1;
    } else {
      existing.incorrect += 1;
    }
    existing.accuracy = calculateAccuracy(existing.correct, existing.attempts);
    groupMap.set(group, existing);
  });

  const confusionMap = new Map<string, number>();
  attempts.forEach((attempt) => {
    if (!attempt.confusionPair) return;
    confusionMap.set(
      attempt.confusionPair,
      (confusionMap.get(attempt.confusionPair) ?? 0) + 1
    );
  });

  const mostConfusedPairs: ConfusionPairStats[] = Array.from(confusionMap.entries())
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count);

  const practicedKana = accuracyByKana.filter((kana) => kana.attempts > 0);
  const weakestKana = [...practicedKana].sort(sortByWeakness).slice(0, 8);
  const strongestKana = [...practicedKana]
    .sort((a, b) => {
      if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
      return b.attempts - a.attempts;
    })
    .slice(0, 8);

  return {
    totalAttempts,
    correctAttempts,
    incorrectAttempts,
    overallAccuracy,
    averageResponseTimeMs,
    accuracyByKana,
    accuracyByGroup: Array.from(groupMap.values()).sort((a, b) =>
      a.group.localeCompare(b.group)
    ),
    averageResponseTimeByKana: accuracyByKana.map((kana) => ({
      character: kana.character,
      averageResponseTimeMs: kana.averageResponseTimeMs,
    })),
    mostMissedKana: [...practicedKana]
      .sort((a, b) => b.incorrect - a.incorrect || a.accuracy - b.accuracy)
      .slice(0, 8),
    mostConfusedPairs,
    recentlyImprovedKana: [...practicedKana]
      .filter((kana) => kana.improvement > 0)
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 8),
    weakestKana,
    strongestKana,
    recommendedNextPracticeSet: weakestKana.slice(0, 10),
  };
}

export function getLearnerStats(): LearnerStats {
  return calculateLearnerStats(getAttempts());
}
