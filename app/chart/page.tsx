'use client';

import { useState } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData } from '@/data/kana';

type ChartMode = 'hiragana' | 'katakana' | 'both';

export default function ChartPage() {
  const [mode, setMode] = useState<ChartMode>('both');

  // Organize characters into traditional chart structure
  const organizeChart = (data: typeof hiraganaData) => {
    const chart: { [key: string]: { [key: string]: string } } = {
      '': { a: '', i: '', u: '', e: '', o: '' },
      k: { a: '', i: '', u: '', e: '', o: '' },
      s: { a: '', i: '', u: '', e: '', o: '' },
      t: { a: '', i: '', u: '', e: '', o: '' },
      n: { a: '', i: '', u: '', e: '', o: '' },
      h: { a: '', i: '', u: '', e: '', o: '' },
      m: { a: '', i: '', u: '', e: '', o: '' },
      y: { a: '', i: '', u: '', e: '', o: '' },
      r: { a: '', i: '', u: '', e: '', o: '' },
      w: { a: '', i: '', u: '', e: '', o: '' },
    };

    data.forEach(({ character, romaji }) => {
      if (romaji === 'n') return; // Handle separately
      
      // Extract row and column from romaji
      let row = '';
      let col = romaji[romaji.length - 1]; // Last character is usually the vowel
      
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
        chart[row][col] = character;
      }
    });

    return chart;
  };

  const hiraganaChart = organizeChart(hiraganaData);
  const katakanaChart = organizeChart(katakanaData);

  const rowLabels: { [key: string]: string } = {
    '': '',
    k: 'K',
    s: 'S',
    t: 'T',
    n: 'N',
    h: 'H',
    m: 'M',
    y: 'Y',
    r: 'R',
    w: 'W',
  };

  const columns = ['a', 'i', 'u', 'e', 'o'];

  const renderChart = (chart: any, type: 'hiragana' | 'katakana', title: string) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {title}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                
              </th>
              {columns.map(col => (
                <th key={col} className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  {col.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(chart).map(row => (
              <tr key={row}>
                <td className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center">
                  {rowLabels[row]}
                </td>
                {columns.map(col => (
                  <td 
                    key={col} 
                    className="p-4 border border-gray-300 dark:border-gray-600 text-center hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {chart[row][col] && (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                          {chart[row][col]}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {row === '' ? col : row + col === 'si' ? 'shi' : row + col === 'ti' ? 'chi' : row + col === 'tu' ? 'tsu' : row + col === 'hu' ? 'fu' : row + col}
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {/* Special row for n/ん/ン */}
            <tr>
              <td className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center">
                N
              </td>
              <td 
                colSpan={5} 
                className="p-4 border border-gray-300 dark:border-gray-600 text-center hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {type === 'hiragana' ? 'ん' : 'ン'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    n
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-pink-600 dark:text-pink-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kana Chart
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('hiragana')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'hiragana'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setMode('katakana')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'katakana'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setMode('both')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'both'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Both
          </button>
        </div>

        {/* Charts */}
        <div className={`grid gap-8 ${mode === 'both' ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>
          {(mode === 'hiragana' || mode === 'both') && 
            renderChart(hiraganaChart, 'hiragana', 'Hiragana (ひらがな)')
          }
          {(mode === 'katakana' || mode === 'both') && 
            renderChart(katakanaChart, 'katakana', 'Katakana (カタカナ)')
          }
        </div>

        {/* Legend */}
        <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            About the Kana Chart
          </h3>
          <div className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
            <p>
              <strong>Hiragana (ひらがな)</strong> is used for native Japanese words, grammatical elements, and when kanji is too difficult.
            </p>
            <p>
              <strong>Katakana (カタカナ)</strong> is primarily used for foreign loanwords, onomatopoeia, and emphasis.
            </p>
            <p className="mt-4">
              The chart shows the basic kana organized by consonant rows (K, S, T, N, H, M, Y, R, W) and vowel columns (A, I, U, E, O).
              Each cell shows the character with its romaji pronunciation below.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
