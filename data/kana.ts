import { KanaCharacter } from '@/types/kana';

/**
 * Complete Hiragana character set
 * Includes basic monographs organized by vowel rows
 */
export const hiraganaData: KanaCharacter[] = [
  // Vowels
  { character: 'あ', romaji: 'a', type: 'hiragana' },
  { character: 'い', romaji: 'i', type: 'hiragana' },
  { character: 'う', romaji: 'u', type: 'hiragana' },
  { character: 'え', romaji: 'e', type: 'hiragana' },
  { character: 'お', romaji: 'o', type: 'hiragana' },
  
  // K-row
  { character: 'か', romaji: 'ka', type: 'hiragana' },
  { character: 'き', romaji: 'ki', type: 'hiragana' },
  { character: 'く', romaji: 'ku', type: 'hiragana' },
  { character: 'け', romaji: 'ke', type: 'hiragana' },
  { character: 'こ', romaji: 'ko', type: 'hiragana' },
  
  // S-row
  { character: 'さ', romaji: 'sa', type: 'hiragana' },
  { character: 'し', romaji: 'shi', type: 'hiragana' },
  { character: 'す', romaji: 'su', type: 'hiragana' },
  { character: 'せ', romaji: 'se', type: 'hiragana' },
  { character: 'そ', romaji: 'so', type: 'hiragana' },
  
  // T-row
  { character: 'た', romaji: 'ta', type: 'hiragana' },
  { character: 'ち', romaji: 'chi', type: 'hiragana' },
  { character: 'つ', romaji: 'tsu', type: 'hiragana' },
  { character: 'て', romaji: 'te', type: 'hiragana' },
  { character: 'と', romaji: 'to', type: 'hiragana' },
  
  // N-row
  { character: 'な', romaji: 'na', type: 'hiragana' },
  { character: 'に', romaji: 'ni', type: 'hiragana' },
  { character: 'ぬ', romaji: 'nu', type: 'hiragana' },
  { character: 'ね', romaji: 'ne', type: 'hiragana' },
  { character: 'の', romaji: 'no', type: 'hiragana' },
  
  // H-row
  { character: 'は', romaji: 'ha', type: 'hiragana' },
  { character: 'ひ', romaji: 'hi', type: 'hiragana' },
  { character: 'ふ', romaji: 'fu', type: 'hiragana' },
  { character: 'へ', romaji: 'he', type: 'hiragana' },
  { character: 'ほ', romaji: 'ho', type: 'hiragana' },
  
  // M-row
  { character: 'ま', romaji: 'ma', type: 'hiragana' },
  { character: 'み', romaji: 'mi', type: 'hiragana' },
  { character: 'む', romaji: 'mu', type: 'hiragana' },
  { character: 'め', romaji: 'me', type: 'hiragana' },
  { character: 'も', romaji: 'mo', type: 'hiragana' },
  
  // Y-row
  { character: 'や', romaji: 'ya', type: 'hiragana' },
  { character: 'ゆ', romaji: 'yu', type: 'hiragana' },
  { character: 'よ', romaji: 'yo', type: 'hiragana' },
  
  // R-row
  { character: 'ら', romaji: 'ra', type: 'hiragana' },
  { character: 'り', romaji: 'ri', type: 'hiragana' },
  { character: 'る', romaji: 'ru', type: 'hiragana' },
  { character: 'れ', romaji: 're', type: 'hiragana' },
  { character: 'ろ', romaji: 'ro', type: 'hiragana' },
  
  // W-row
  { character: 'わ', romaji: 'wa', type: 'hiragana' },
  { character: 'を', romaji: 'wo', type: 'hiragana' },
  
  // N
  { character: 'ん', romaji: 'n', type: 'hiragana' },
];

/**
 * Complete Katakana character set
 * Organized identically to Hiragana for consistency
 */
export const katakanaData: KanaCharacter[] = [
  // Vowels
  { character: 'ア', romaji: 'a', type: 'katakana' },
  { character: 'イ', romaji: 'i', type: 'katakana' },
  { character: 'ウ', romaji: 'u', type: 'katakana' },
  { character: 'エ', romaji: 'e', type: 'katakana' },
  { character: 'オ', romaji: 'o', type: 'katakana' },
  
  // K-row
  { character: 'カ', romaji: 'ka', type: 'katakana' },
  { character: 'キ', romaji: 'ki', type: 'katakana' },
  { character: 'ク', romaji: 'ku', type: 'katakana' },
  { character: 'ケ', romaji: 'ke', type: 'katakana' },
  { character: 'コ', romaji: 'ko', type: 'katakana' },
  
  // S-row
  { character: 'サ', romaji: 'sa', type: 'katakana' },
  { character: 'シ', romaji: 'shi', type: 'katakana' },
  { character: 'ス', romaji: 'su', type: 'katakana' },
  { character: 'セ', romaji: 'se', type: 'katakana' },
  { character: 'ソ', romaji: 'so', type: 'katakana' },
  
  // T-row
  { character: 'タ', romaji: 'ta', type: 'katakana' },
  { character: 'チ', romaji: 'chi', type: 'katakana' },
  { character: 'ツ', romaji: 'tsu', type: 'katakana' },
  { character: 'テ', romaji: 'te', type: 'katakana' },
  { character: 'ト', romaji: 'to', type: 'katakana' },
  
  // N-row
  { character: 'ナ', romaji: 'na', type: 'katakana' },
  { character: 'ニ', romaji: 'ni', type: 'katakana' },
  { character: 'ヌ', romaji: 'nu', type: 'katakana' },
  { character: 'ネ', romaji: 'ne', type: 'katakana' },
  { character: 'ノ', romaji: 'no', type: 'katakana' },
  
  // H-row
  { character: 'ハ', romaji: 'ha', type: 'katakana' },
  { character: 'ヒ', romaji: 'hi', type: 'katakana' },
  { character: 'フ', romaji: 'fu', type: 'katakana' },
  { character: 'ヘ', romaji: 'he', type: 'katakana' },
  { character: 'ホ', romaji: 'ho', type: 'katakana' },
  
  // M-row
  { character: 'マ', romaji: 'ma', type: 'katakana' },
  { character: 'ミ', romaji: 'mi', type: 'katakana' },
  { character: 'ム', romaji: 'mu', type: 'katakana' },
  { character: 'メ', romaji: 'me', type: 'katakana' },
  { character: 'モ', romaji: 'mo', type: 'katakana' },
  
  // Y-row
  { character: 'ヤ', romaji: 'ya', type: 'katakana' },
  { character: 'ユ', romaji: 'yu', type: 'katakana' },
  { character: 'ヨ', romaji: 'yo', type: 'katakana' },
  
  // R-row
  { character: 'ラ', romaji: 'ra', type: 'katakana' },
  { character: 'リ', romaji: 'ri', type: 'katakana' },
  { character: 'ル', romaji: 'ru', type: 'katakana' },
  { character: 'レ', romaji: 're', type: 'katakana' },
  { character: 'ロ', romaji: 'ro', type: 'katakana' },
  
  // W-row
  { character: 'ワ', romaji: 'wa', type: 'katakana' },
  { character: 'ヲ', romaji: 'wo', type: 'katakana' },
  
  // N
  { character: 'ン', romaji: 'n', type: 'katakana' },
];

/**
 * Combined dataset for mixed mode learning
 */
export const allKanaData: KanaCharacter[] = [...hiraganaData, ...katakanaData];
