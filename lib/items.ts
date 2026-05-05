import { allKanaData } from '@/data/kana';
import { getAllKanji } from '@/data/kanji';
import { KanaType, LearningItemCategory } from '@/types/kana';

export interface LearningItem {
  id: string;
  character: string;
  category: LearningItemCategory;
  label: string;
  grade?: string;
  romaji?: string;
  meanings?: string[];
}

export function getAllLearningItems(): LearningItem[] {
  const kanaItems = allKanaData.map((kana) => ({
    id: kana.character,
    character: kana.character,
    category: kana.type,
    label: kana.romaji,
    romaji: kana.romaji,
  }));

  const kanjiItems = getAllKanji().map((kanji) => ({
    id: kanji.character,
    character: kanji.character,
    category: 'kanji' as const,
    grade: kanji.grade,
    label: kanji.meanings[0] ?? kanji.character,
    meanings: kanji.meanings,
  }));

  return [...kanaItems, ...kanjiItems];
}

export function getLearningItem(character: string): LearningItem {
  const found = getAllLearningItems().find((item) => item.character === character);

  if (found) return found;

  return {
    id: character,
    character,
    category: 'kanji',
    label: character,
  };
}

export function getItemsByScope(scope?: KanaType | 'mixed' | 'kanji'): LearningItem[] {
  const items = getAllLearningItems();
  if (!scope || scope === 'mixed') return items.filter((item) => item.category !== 'kanji');
  if (scope === 'kanji') return items.filter((item) => item.category === 'kanji');
  return items.filter((item) => item.category === scope);
}
