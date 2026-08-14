import { KanaCharacter, KanaStudySet, KanaType } from '@/types/kana';

/**
 * Complete Hiragana character set
 * Includes basic monographs organized by vowel rows
 */
export const hiraganaBasicData: KanaCharacter[] = [
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
export const katakanaBasicData: KanaCharacter[] = [
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

export const hiraganaVoicedData: KanaCharacter[] = [
  { character: 'が', romaji: 'ga', type: 'hiragana' },
  { character: 'ぎ', romaji: 'gi', type: 'hiragana' },
  { character: 'ぐ', romaji: 'gu', type: 'hiragana' },
  { character: 'げ', romaji: 'ge', type: 'hiragana' },
  { character: 'ご', romaji: 'go', type: 'hiragana' },
  { character: 'ざ', romaji: 'za', type: 'hiragana' },
  { character: 'じ', romaji: 'ji', type: 'hiragana' },
  { character: 'ず', romaji: 'zu', type: 'hiragana' },
  { character: 'ぜ', romaji: 'ze', type: 'hiragana' },
  { character: 'ぞ', romaji: 'zo', type: 'hiragana' },
  { character: 'だ', romaji: 'da', type: 'hiragana' },
  { character: 'ぢ', romaji: 'ji', type: 'hiragana' },
  { character: 'づ', romaji: 'zu', type: 'hiragana' },
  { character: 'で', romaji: 'de', type: 'hiragana' },
  { character: 'ど', romaji: 'do', type: 'hiragana' },
  { character: 'ば', romaji: 'ba', type: 'hiragana' },
  { character: 'び', romaji: 'bi', type: 'hiragana' },
  { character: 'ぶ', romaji: 'bu', type: 'hiragana' },
  { character: 'べ', romaji: 'be', type: 'hiragana' },
  { character: 'ぼ', romaji: 'bo', type: 'hiragana' },
  { character: 'ぱ', romaji: 'pa', type: 'hiragana' },
  { character: 'ぴ', romaji: 'pi', type: 'hiragana' },
  { character: 'ぷ', romaji: 'pu', type: 'hiragana' },
  { character: 'ぺ', romaji: 'pe', type: 'hiragana' },
  { character: 'ぽ', romaji: 'po', type: 'hiragana' },
];

export const katakanaVoicedData: KanaCharacter[] = [
  { character: 'ガ', romaji: 'ga', type: 'katakana' },
  { character: 'ギ', romaji: 'gi', type: 'katakana' },
  { character: 'グ', romaji: 'gu', type: 'katakana' },
  { character: 'ゲ', romaji: 'ge', type: 'katakana' },
  { character: 'ゴ', romaji: 'go', type: 'katakana' },
  { character: 'ザ', romaji: 'za', type: 'katakana' },
  { character: 'ジ', romaji: 'ji', type: 'katakana' },
  { character: 'ズ', romaji: 'zu', type: 'katakana' },
  { character: 'ゼ', romaji: 'ze', type: 'katakana' },
  { character: 'ゾ', romaji: 'zo', type: 'katakana' },
  { character: 'ダ', romaji: 'da', type: 'katakana' },
  { character: 'ヂ', romaji: 'ji', type: 'katakana' },
  { character: 'ヅ', romaji: 'zu', type: 'katakana' },
  { character: 'デ', romaji: 'de', type: 'katakana' },
  { character: 'ド', romaji: 'do', type: 'katakana' },
  { character: 'バ', romaji: 'ba', type: 'katakana' },
  { character: 'ビ', romaji: 'bi', type: 'katakana' },
  { character: 'ブ', romaji: 'bu', type: 'katakana' },
  { character: 'ベ', romaji: 'be', type: 'katakana' },
  { character: 'ボ', romaji: 'bo', type: 'katakana' },
  { character: 'パ', romaji: 'pa', type: 'katakana' },
  { character: 'ピ', romaji: 'pi', type: 'katakana' },
  { character: 'プ', romaji: 'pu', type: 'katakana' },
  { character: 'ペ', romaji: 'pe', type: 'katakana' },
  { character: 'ポ', romaji: 'po', type: 'katakana' },
];

export const hiraganaCombinationData: KanaCharacter[] = [
  { character: 'きゃ', romaji: 'kya', type: 'hiragana' },
  { character: 'きゅ', romaji: 'kyu', type: 'hiragana' },
  { character: 'きょ', romaji: 'kyo', type: 'hiragana' },
  { character: 'しゃ', romaji: 'sha', type: 'hiragana' },
  { character: 'しゅ', romaji: 'shu', type: 'hiragana' },
  { character: 'しょ', romaji: 'sho', type: 'hiragana' },
  { character: 'ちゃ', romaji: 'cha', type: 'hiragana' },
  { character: 'ちゅ', romaji: 'chu', type: 'hiragana' },
  { character: 'ちょ', romaji: 'cho', type: 'hiragana' },
  { character: 'にゃ', romaji: 'nya', type: 'hiragana' },
  { character: 'にゅ', romaji: 'nyu', type: 'hiragana' },
  { character: 'にょ', romaji: 'nyo', type: 'hiragana' },
  { character: 'ひゃ', romaji: 'hya', type: 'hiragana' },
  { character: 'ひゅ', romaji: 'hyu', type: 'hiragana' },
  { character: 'ひょ', romaji: 'hyo', type: 'hiragana' },
  { character: 'みゃ', romaji: 'mya', type: 'hiragana' },
  { character: 'みゅ', romaji: 'myu', type: 'hiragana' },
  { character: 'みょ', romaji: 'myo', type: 'hiragana' },
  { character: 'りゃ', romaji: 'rya', type: 'hiragana' },
  { character: 'りゅ', romaji: 'ryu', type: 'hiragana' },
  { character: 'りょ', romaji: 'ryo', type: 'hiragana' },
  { character: 'ぎゃ', romaji: 'gya', type: 'hiragana' },
  { character: 'ぎゅ', romaji: 'gyu', type: 'hiragana' },
  { character: 'ぎょ', romaji: 'gyo', type: 'hiragana' },
  { character: 'じゃ', romaji: 'ja', type: 'hiragana' },
  { character: 'じゅ', romaji: 'ju', type: 'hiragana' },
  { character: 'じょ', romaji: 'jo', type: 'hiragana' },
  { character: 'びゃ', romaji: 'bya', type: 'hiragana' },
  { character: 'びゅ', romaji: 'byu', type: 'hiragana' },
  { character: 'びょ', romaji: 'byo', type: 'hiragana' },
  { character: 'ぴゃ', romaji: 'pya', type: 'hiragana' },
  { character: 'ぴゅ', romaji: 'pyu', type: 'hiragana' },
  { character: 'ぴょ', romaji: 'pyo', type: 'hiragana' },
];

export const katakanaCombinationData: KanaCharacter[] = [
  { character: 'キャ', romaji: 'kya', type: 'katakana' },
  { character: 'キュ', romaji: 'kyu', type: 'katakana' },
  { character: 'キョ', romaji: 'kyo', type: 'katakana' },
  { character: 'シャ', romaji: 'sha', type: 'katakana' },
  { character: 'シュ', romaji: 'shu', type: 'katakana' },
  { character: 'ショ', romaji: 'sho', type: 'katakana' },
  { character: 'チャ', romaji: 'cha', type: 'katakana' },
  { character: 'チュ', romaji: 'chu', type: 'katakana' },
  { character: 'チョ', romaji: 'cho', type: 'katakana' },
  { character: 'ニャ', romaji: 'nya', type: 'katakana' },
  { character: 'ニュ', romaji: 'nyu', type: 'katakana' },
  { character: 'ニョ', romaji: 'nyo', type: 'katakana' },
  { character: 'ヒャ', romaji: 'hya', type: 'katakana' },
  { character: 'ヒュ', romaji: 'hyu', type: 'katakana' },
  { character: 'ヒョ', romaji: 'hyo', type: 'katakana' },
  { character: 'ミャ', romaji: 'mya', type: 'katakana' },
  { character: 'ミュ', romaji: 'myu', type: 'katakana' },
  { character: 'ミョ', romaji: 'myo', type: 'katakana' },
  { character: 'リャ', romaji: 'rya', type: 'katakana' },
  { character: 'リュ', romaji: 'ryu', type: 'katakana' },
  { character: 'リョ', romaji: 'ryo', type: 'katakana' },
  { character: 'ギャ', romaji: 'gya', type: 'katakana' },
  { character: 'ギュ', romaji: 'gyu', type: 'katakana' },
  { character: 'ギョ', romaji: 'gyo', type: 'katakana' },
  { character: 'ジャ', romaji: 'ja', type: 'katakana' },
  { character: 'ジュ', romaji: 'ju', type: 'katakana' },
  { character: 'ジョ', romaji: 'jo', type: 'katakana' },
  { character: 'ビャ', romaji: 'bya', type: 'katakana' },
  { character: 'ビュ', romaji: 'byu', type: 'katakana' },
  { character: 'ビョ', romaji: 'byo', type: 'katakana' },
  { character: 'ピャ', romaji: 'pya', type: 'katakana' },
  { character: 'ピュ', romaji: 'pyu', type: 'katakana' },
  { character: 'ピョ', romaji: 'pyo', type: 'katakana' },
];

export const hiraganaData: KanaCharacter[] = [
  ...hiraganaBasicData,
  ...hiraganaVoicedData,
  ...hiraganaCombinationData,
];

export const katakanaData: KanaCharacter[] = [
  ...katakanaBasicData,
  ...katakanaVoicedData,
  ...katakanaCombinationData,
];

/**
 * Combined dataset for mixed mode learning
 */
export const allKanaData: KanaCharacter[] = [...hiraganaData, ...katakanaData];

export function getKanaForStudySet(
  kanaType: KanaType | 'mixed',
  studySet: KanaStudySet
): KanaCharacter[] {
  const dataBySet: Record<KanaStudySet, KanaCharacter[]> = {
    basic: [...hiraganaBasicData, ...katakanaBasicData],
    voiced: [...hiraganaVoicedData, ...katakanaVoicedData],
    combinations: [...hiraganaCombinationData, ...katakanaCombinationData],
    all: allKanaData,
  };

  const data = dataBySet[studySet];
  if (kanaType === 'mixed') return data;
  return data.filter((kana) => kana.type === kanaType);
}
