import { LearnerStats, QuizAttempt } from '@/types/kana';

const QUICK_RESPONSE_MS = 1800;
const SLOW_RESPONSE_MS = 4500;

function findKanaStats(attempt: QuizAttempt, learnerStats: LearnerStats) {
  return learnerStats.accuracyByKana.find(
    (kana) => kana.character === attempt.characterShown
  );
}

export function generateFeedback(
  attempt: QuizAttempt,
  learnerStats: LearnerStats
): string {
  const kanaStats = findKanaStats(attempt, learnerStats);

  if (attempt.isCorrect) {
    if (attempt.responseTimeMs <= QUICK_RESPONSE_MS) {
      return 'Correct. You answered quickly.';
    }

    if (kanaStats && kanaStats.improvement > 0) {
      return 'Correct. This kana is improving compared to your previous attempts.';
    }

    if (attempt.responseTimeMs >= SLOW_RESPONSE_MS) {
      return 'Correct. Keep reviewing it until recognition feels faster.';
    }

    return 'Correct.';
  }

  if (attempt.confusionPair) {
    return `Incorrect. You confused ${attempt.confusionPair.replace(
      '/',
      ' with '
    )}. These are visually similar.`;
  }

  if (kanaStats && kanaStats.incorrect >= 2) {
    return 'Incorrect. You often miss this kana, so it will appear more often in review.';
  }

  return 'Incorrect. This kana will be prioritized for more practice.';
}
