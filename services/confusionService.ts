import { findVisualSimilarityPair } from '@/data/confusionPairs';
import { ConfusionDetection, KanaType } from '@/types/kana';
import { getKanaCharacterForAnswer } from '@/services/kanaMetadata';

/**
 * Rule-based confusion detection supports targeted feedback for visually
 * similar kana before introducing any AI-driven diagnosis.
 */
export function detectConfusion(
  expectedAnswer: string,
  userAnswer: string,
  kanaType?: KanaType
): ConfusionDetection | null {
  const expectedKana = kanaType
    ? getKanaCharacterForAnswer(expectedAnswer, kanaType)
    : expectedAnswer;
  const userKana = kanaType
    ? getKanaCharacterForAnswer(userAnswer, kanaType)
    : userAnswer;

  if (expectedKana === userKana) return null;

  return findVisualSimilarityPair(expectedKana, userKana);
}
