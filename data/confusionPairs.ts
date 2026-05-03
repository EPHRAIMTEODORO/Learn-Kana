import { ConfusionDetection } from '@/types/kana';

export const visualSimilarityPairs = [
  ['シ', 'ツ'],
  ['ソ', 'ン'],
  ['し', 'つ'],
  ['め', 'ぬ'],
  ['わ', 'れ'],
  ['は', 'ほ'],
  ['さ', 'き'],
  ['ね', 'れ'],
  ['ク', 'ケ'],
  ['マ', 'ム'],
] as const;

const normalizedPairs = visualSimilarityPairs.map(([first, second]) => ({
  first,
  second,
  key: [first, second].sort().join('/'),
  label: `${first}/${second}`,
}));

export function findVisualSimilarityPair(
  expectedKana: string,
  userKana: string
): ConfusionDetection | null {
  const key = [expectedKana, userKana].sort().join('/');
  const pair = normalizedPairs.find((item) => item.key === key);

  if (!pair) return null;

  return {
    confusionType: 'visual_similarity',
    confusionPair: pair.label,
  };
}
