'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  hiraganaBasicData,
  hiraganaData,
  katakanaBasicData,
  katakanaData,
} from '@/data/kana';
import AppNav from '@/components/AppNav';

type ChartMode = 'hiragana' | 'katakana' | 'both';
type ScriptType = 'hiragana' | 'katakana';
type Vowel = 'a' | 'i' | 'u' | 'e' | 'o';
type KanaCell = {
  romaji: string;
  hiragana: string;
  katakana: string;
};

const columns: Vowel[] = ['a', 'i', 'u', 'e', 'o'];
const emptyRow = (): Record<Vowel, KanaCell | null> => ({
  a: null,
  i: null,
  u: null,
  e: null,
  o: null,
});

const hiraganaByRomaji = new Map(
  hiraganaData.map((kana) => [kana.romaji, kana.character]),
);
const katakanaByRomaji = new Map(
  katakanaData.map((kana) => [kana.romaji, kana.character]),
);

const baseRows = [
  { key: '', label: 'Vowels' },
  { key: 'k', label: 'K' },
  { key: 's', label: 'S' },
  { key: 't', label: 'T' },
  { key: 'n', label: 'N' },
  { key: 'h', label: 'H' },
  { key: 'm', label: 'M' },
  { key: 'y', label: 'Y' },
  { key: 'r', label: 'R' },
  { key: 'w', label: 'W' },
];

const voicedRows: Array<{ label: string; cells: KanaCell[] }> = [
  {
    label: 'G',
    cells: [
      { romaji: 'ga', hiragana: 'が', katakana: 'ガ' },
      { romaji: 'gi', hiragana: 'ぎ', katakana: 'ギ' },
      { romaji: 'gu', hiragana: 'ぐ', katakana: 'グ' },
      { romaji: 'ge', hiragana: 'げ', katakana: 'ゲ' },
      { romaji: 'go', hiragana: 'ご', katakana: 'ゴ' },
    ],
  },
  {
    label: 'Z',
    cells: [
      { romaji: 'za', hiragana: 'ざ', katakana: 'ザ' },
      { romaji: 'ji', hiragana: 'じ', katakana: 'ジ' },
      { romaji: 'zu', hiragana: 'ず', katakana: 'ズ' },
      { romaji: 'ze', hiragana: 'ぜ', katakana: 'ゼ' },
      { romaji: 'zo', hiragana: 'ぞ', katakana: 'ゾ' },
    ],
  },
  {
    label: 'D',
    cells: [
      { romaji: 'da', hiragana: 'だ', katakana: 'ダ' },
      { romaji: 'ji', hiragana: 'ぢ', katakana: 'ヂ' },
      { romaji: 'zu', hiragana: 'づ', katakana: 'ヅ' },
      { romaji: 'de', hiragana: 'で', katakana: 'デ' },
      { romaji: 'do', hiragana: 'ど', katakana: 'ド' },
    ],
  },
  {
    label: 'B',
    cells: [
      { romaji: 'ba', hiragana: 'ば', katakana: 'バ' },
      { romaji: 'bi', hiragana: 'び', katakana: 'ビ' },
      { romaji: 'bu', hiragana: 'ぶ', katakana: 'ブ' },
      { romaji: 'be', hiragana: 'べ', katakana: 'ベ' },
      { romaji: 'bo', hiragana: 'ぼ', katakana: 'ボ' },
    ],
  },
  {
    label: 'P',
    cells: [
      { romaji: 'pa', hiragana: 'ぱ', katakana: 'パ' },
      { romaji: 'pi', hiragana: 'ぴ', katakana: 'ピ' },
      { romaji: 'pu', hiragana: 'ぷ', katakana: 'プ' },
      { romaji: 'pe', hiragana: 'ぺ', katakana: 'ペ' },
      { romaji: 'po', hiragana: 'ぽ', katakana: 'ポ' },
    ],
  },
];

const comboRows: Array<{ label: string; cells: KanaCell[] }> = [
  {
    label: 'KY',
    cells: [
      { romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ' },
      { romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ' },
      { romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ' },
    ],
  },
  {
    label: 'SH',
    cells: [
      { romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ' },
      { romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ' },
      { romaji: 'sho', hiragana: 'しょ', katakana: 'ショ' },
    ],
  },
  {
    label: 'CH',
    cells: [
      { romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ' },
      { romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ' },
      { romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ' },
    ],
  },
  {
    label: 'NY',
    cells: [
      { romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ' },
      { romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ' },
      { romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ' },
    ],
  },
  {
    label: 'HY',
    cells: [
      { romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ' },
      { romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ' },
      { romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ' },
    ],
  },
  {
    label: 'MY',
    cells: [
      { romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ' },
      { romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ' },
      { romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ' },
    ],
  },
  {
    label: 'RY',
    cells: [
      { romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ' },
      { romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ' },
      { romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ' },
    ],
  },
  {
    label: 'GY',
    cells: [
      { romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ' },
      { romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ' },
      { romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ' },
    ],
  },
  {
    label: 'J',
    cells: [
      { romaji: 'ja', hiragana: 'じゃ', katakana: 'ジャ' },
      { romaji: 'ju', hiragana: 'じゅ', katakana: 'ジュ' },
      { romaji: 'jo', hiragana: 'じょ', katakana: 'ジョ' },
    ],
  },
  {
    label: 'BY',
    cells: [
      { romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ' },
      { romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ' },
      { romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ' },
    ],
  },
  {
    label: 'PY',
    cells: [
      { romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ' },
      { romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ' },
      { romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ' },
    ],
  },
];

export default function ChartPage() {
  const [mode, setMode] = useState<ChartMode>('both');

  const organizeChart = (data: typeof hiraganaData) => {
    const chart: Record<string, Record<Vowel, KanaCell | null>> = {
      '': emptyRow(),
      k: emptyRow(),
      s: emptyRow(),
      t: emptyRow(),
      n: emptyRow(),
      h: emptyRow(),
      m: emptyRow(),
      y: emptyRow(),
      r: emptyRow(),
      w: emptyRow(),
    };

    data.forEach(({ character, romaji }) => {
      if (romaji === 'n') return;
      
      let row = '';
      let col = romaji[romaji.length - 1] as Vowel;
      
      if (romaji.length === 1) {
        row = '';
      } else if (romaji === 'shi') {
        row = 's'; col = 'i';
      } else if (romaji === 'chi') {
        row = 't'; col = 'i';
      } else if (romaji === 'tsu') {
        row = 't'; col = 'u';
      } else if (romaji === 'fu') {
        row = 'h'; col = 'u';
      } else if (romaji === 'wo') {
        row = 'w'; col = 'o';
      } else {
        row = romaji[0];
      }
      
      if (chart[row] && chart[row][col] !== undefined) {
        chart[row][col] = {
          romaji,
          hiragana: hiraganaByRomaji.get(romaji) ?? character,
          katakana: katakanaByRomaji.get(romaji) ?? character,
        };
      }
    });

    return chart;
  };

  const hiraganaChart = organizeChart(hiraganaBasicData);
  const katakanaChart = organizeChart(katakanaBasicData);

  const getDisplay = (cell: KanaCell, script: ScriptType) => (
    script === 'hiragana' ? cell.hiragana : cell.katakana
  );

  const renderKanaCell = (cell: KanaCell | null, script: ScriptType) => (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-md px-2 py-3 transition-colors hover:bg-[#F0F2FC]">
      {cell ? (
        <>
          <span className="text-3xl font-bold leading-none text-academic-text md:text-4xl">
            {getDisplay(cell, script)}
          </span>
          <span className="mt-2 text-xs font-semibold text-academic-muted">
            {cell.romaji}
          </span>
        </>
      ) : (
        <span className="text-sm text-[#999999]" aria-hidden="true">
          -
        </span>
      )}
    </div>
  );

  const renderPairCell = (cell: KanaCell | null) => (
    <div className="flex min-h-24 flex-col items-center justify-center rounded-md px-2 py-3 transition-colors hover:bg-[#F0F2FC]">
      {cell ? (
        <>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold leading-none text-academic-text md:text-4xl">
              {cell.hiragana}
            </span>
            <span className="text-3xl font-bold leading-none text-academic-text md:text-4xl">
              {cell.katakana}
            </span>
          </div>
          <span className="mt-2 text-xs font-semibold text-academic-muted">
            {cell.romaji}
          </span>
        </>
      ) : (
        <span className="text-sm text-[#999999]" aria-hidden="true">
          -
        </span>
      )}
    </div>
  );

  const renderBaseChart = (
    chart: ReturnType<typeof organizeChart>,
    type: ScriptType,
    title: string,
  ) => (
    <section className="rounded-lg border border-academic-border bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-5 text-center text-2xl font-bold text-academic-text">
        {title}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr>
              <th className="border border-academic-border bg-academic-section p-3 text-sm font-semibold text-academic-muted">
                Row
              </th>
              {columns.map(col => (
                <th key={col} className="border border-academic-border bg-academic-section p-3 text-sm font-semibold text-academic-muted">
                  {col.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baseRows.map(row => (
              <tr key={row.key}>
                <td className="border border-academic-border bg-academic-section p-3 text-center text-sm font-semibold text-academic-muted">
                  {row.label}
                </td>
                {columns.map(col => (
                  <td 
                    key={col} 
                    className="border border-academic-border text-center"
                  >
                    {renderKanaCell(chart[row.key][col], type)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border border-academic-border bg-academic-section p-3 text-center text-sm font-semibold text-academic-muted">
                N
              </td>
              <td 
                colSpan={5} 
                className="border border-academic-border text-center"
              >
                {renderKanaCell(
                  { romaji: 'n', hiragana: 'ん', katakana: 'ン' },
                  type,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderReferenceTable = (
    title: string,
    description: string,
    headers: string[],
    rows: Array<{ label: string; cells: KanaCell[] }>,
  ) => (
    <section className="rounded-lg border border-academic-border bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-academic-text">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-academic-muted">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse">
          <thead>
            <tr>
              <th className="border border-academic-border bg-academic-section p-3 text-sm font-semibold text-academic-muted">
                Row
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border border-academic-border bg-academic-section p-3 text-sm font-semibold text-academic-muted"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="border border-academic-border bg-academic-section p-3 text-center text-sm font-semibold text-academic-muted">
                  {row.label}
                </td>
                {row.cells.map((cell) => (
                  <td key={cell.romaji} className="border border-academic-border text-center">
                    {renderPairCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link 
              href="/" 
              className="text-sm font-semibold text-academic-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-academic-primary"
            >
              Back to Home
            </Link>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-academic-text md:text-5xl">
              Kana Chart
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-academic-muted">
              Compare hiragana and katakana side by side, then scan the voiced sounds and combination kana that appear in everyday Japanese.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-academic-border bg-white p-2 shadow-sm" role="group" aria-label="Kana chart view">
          <button
            onClick={() => setMode('hiragana')}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === 'hiragana'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setMode('katakana')}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === 'katakana'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setMode('both')}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === 'both'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Both
          </button>
          </div>
        </div>

        <div className={`grid gap-8 ${mode === 'both' ? 'xl:grid-cols-2' : 'mx-auto max-w-4xl'}`}>
          {(mode === 'hiragana' || mode === 'both') && 
            renderBaseChart(hiraganaChart, 'hiragana', 'Hiragana (ひらがな)')
          }
          {(mode === 'katakana' || mode === 'both') && 
            renderBaseChart(katakanaChart, 'katakana', 'Katakana (カタカナ)')
          }
        </div>

        <div className="mt-8 grid gap-8">
          {renderReferenceTable(
            'Dakuten and Handakuten',
            'Small marks change the sound: dakuten adds voicing, while handakuten turns the H row into P sounds.',
            ['A', 'I', 'U', 'E', 'O'],
            voicedRows,
          )}

          {renderReferenceTable(
            'Combination Kana',
            'These pair an I-column kana with a small ya, yu, or yo to make blended readings.',
            ['YA', 'YU', 'YO'],
            comboRows,
          )}
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-academic-border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-academic-text">Hiragana</h2>
            <p className="mt-2 text-sm leading-6 text-academic-muted">
              Used for native Japanese words, grammatical endings, particles, and words usually written without kanji.
            </p>
          </div>
          <div className="rounded-lg border border-academic-border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-academic-text">Katakana</h2>
            <p className="mt-2 text-sm leading-6 text-academic-muted">
              Used for loanwords, foreign names, many sound effects, technical terms, and emphasis.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
