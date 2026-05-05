import { LearnerStats, RecommendedLearningItem, UserData, VirtualTAFeedback } from '@/types/kana';

function plural(value: number, singular: string, pluralForm = `${singular}s`) {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

export function generateVirtualTAFeedback(
  userData: UserData,
  stats: LearnerStats,
  recommended: RecommendedLearningItem[]
): VirtualTAFeedback {
  const attemptedItems = Object.values(userData.progress).filter((item) => item.attempts > 0);
  const dueItems = attemptedItems.filter((item) => item.nextReviewAt <= Date.now());
  const recentFailures = attemptedItems.reduce(
    (sum, item) => sum + (item.recentFailures?.length ?? 0),
    0
  );
  const weakest = stats.weakestKana[0];
  const topRecommendation = recommended[0];

  if (stats.totalAttempts === 0) {
    return {
      summary: 'The learner model has not collected enough evidence yet.',
      nextAction: 'Start with an adaptive quiz so the system can estimate initial accuracy and response patterns.',
      evidence: [
        'No quiz attempt events are stored yet.',
        'Recommendations are currently seeded from new curriculum items.',
      ],
      researchSignals: [
        'Cold-start state for recommender evaluation.',
        'Useful baseline for comparing random practice against adaptive practice.',
      ],
    };
  }

  const summary = stats.overallAccuracy >= 80
    ? 'The learner is showing stable recall on recent practice.'
    : stats.overallAccuracy >= 60
      ? 'The learner is developing partial fluency but still has identifiable weak items.'
      : 'The learner needs focused review before adding many new characters.';

  const nextAction = topRecommendation
    ? `Review ${topRecommendation.character} next because it is ${topRecommendation.reasons.join(', ')}.`
    : 'Continue with adaptive practice to gather more item-level evidence.';

  return {
    summary,
    nextAction,
    evidence: [
      `${plural(stats.totalAttempts, 'attempt')} recorded with ${stats.overallAccuracy}% overall accuracy.`,
      `${plural(dueItems.length, 'item')} currently due in the spaced repetition schedule.`,
      weakest
        ? `Weakest kana signal: ${weakest.character} at ${weakest.accuracy}% accuracy.`
        : 'No weakest kana signal is available yet.',
      `${plural(recentFailures, 'recent failure')} stored across practiced items.`,
    ],
    researchSignals: [
      'Learner state is represented at item level, enabling educational data mining.',
      'Feedback is generated from transparent rules, supporting algorithmic transparency.',
      'Recommendations can be evaluated against later accuracy and response-time changes.',
    ],
  };
}
