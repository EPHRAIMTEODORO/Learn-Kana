import { allKanaData } from '@/data/kana';
import { KanaCharacter, KanaType } from '@/types/kana';

const rowByRomajiPrefix: Array<[string, string]> = [
  ['kya', 'kya-row'],
  ['kyu', 'kya-row'],
  ['kyo', 'kya-row'],
  ['gya', 'gya-row'],
  ['gyu', 'gya-row'],
  ['gyo', 'gya-row'],
  ['sha', 'sha-row'],
  ['shu', 'sha-row'],
  ['sho', 'sha-row'],
  ['cha', 'cha-row'],
  ['chu', 'cha-row'],
  ['cho', 'cha-row'],
  ['nya', 'nya-row'],
  ['nyu', 'nya-row'],
  ['nyo', 'nya-row'],
  ['hya', 'hya-row'],
  ['hyu', 'hya-row'],
  ['hyo', 'hya-row'],
  ['bya', 'bya-row'],
  ['byu', 'bya-row'],
  ['byo', 'bya-row'],
  ['pya', 'pya-row'],
  ['pyu', 'pya-row'],
  ['pyo', 'pya-row'],
  ['mya', 'mya-row'],
  ['myu', 'mya-row'],
  ['myo', 'mya-row'],
  ['rya', 'rya-row'],
  ['ryu', 'rya-row'],
  ['ryo', 'rya-row'],
  ['ja', 'ja-row'],
  ['ju', 'ja-row'],
  ['jo', 'ja-row'],
  ['ch', 'ta-row'],
  ['ts', 'ta-row'],
  ['sh', 'sa-row'],
  ['gy', 'ga-row'],
  ['g', 'ga-row'],
  ['z', 'za-row'],
  ['j', 'za-row'],
  ['d', 'da-row'],
  ['b', 'ba-row'],
  ['p', 'pa-row'],
  ['a', 'a-row'],
  ['i', 'a-row'],
  ['u', 'a-row'],
  ['e', 'a-row'],
  ['o', 'a-row'],
  ['k', 'ka-row'],
  ['s', 'sa-row'],
  ['t', 'ta-row'],
  ['n', 'na-row'],
  ['h', 'ha-row'],
  ['f', 'ha-row'],
  ['m', 'ma-row'],
  ['y', 'ya-row'],
  ['r', 'ra-row'],
  ['w', 'wa-row'],
];

export function getKanaGroup(kana: Pick<KanaCharacter, 'romaji'>): string {
  if (kana.romaji === 'n') return 'n';

  const match = rowByRomajiPrefix.find(([prefix]) =>
    kana.romaji.startsWith(prefix)
  );

  return match?.[1] ?? 'other';
}

export function getKanaByCharacter(character: string): KanaCharacter | undefined {
  return allKanaData.find((kana) => kana.character === character);
}

export function getKanaByRomaji(
  romaji: string,
  kanaType: KanaType
): KanaCharacter | undefined {
  return allKanaData.find(
    (kana) => kana.romaji === romaji && kana.type === kanaType
  );
}

export function getKanaCharacterForAnswer(
  answer: string,
  kanaType: KanaType
): string {
  return getKanaByCharacter(answer)?.character ?? getKanaByRomaji(answer, kanaType)?.character ?? answer;
}
