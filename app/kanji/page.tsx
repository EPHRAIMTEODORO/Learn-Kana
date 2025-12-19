'use client';

import { useState } from 'react';
import Link from 'next/link';
import { kanjiGradeSections, getKanjiByGrade } from '@/data/kanji';
import type { KanjiGrade, KanjiCharacter } from '@/types/kanji';

export default function KanjiPage() {
  const [selectedGrade, setSelectedGrade] = useState<KanjiGrade>('grade1');
  const [selectedKanji, setSelectedKanji] = useState<KanjiCharacter | null>(null);

  const currentSection = kanjiGradeSections.find(s => s.grade === selectedGrade);
  const kanji = getKanjiByGrade(selectedGrade);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Jōyō Kanji
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Grade Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Grade Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {kanjiGradeSections.map((section) => (
              <button
                key={section.grade}
                onClick={() => {
                  setSelectedGrade(section.grade);
                  setSelectedKanji(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGrade === section.grade
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {section.gradeName}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {section.gradeNameJapanese}
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {section.kanji.length}
                  {section.kanji.length < section.totalCount && (
                    <span className="text-xs font-normal text-black">
                      /{section.totalCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Section Info */}
        {currentSection && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentSection.gradeName} ({currentSection.gradeNameJapanese})
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{currentSection.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                {currentSection.kanji.length === currentSection.totalCount 
                  ? `Complete: ${currentSection.kanji.length} kanji ✓`
                  : `Available: ${currentSection.kanji.length} of ${currentSection.totalCount} kanji`
                }
              </span>
            </div>
          </div>
        )}

        {/* Kanji Grid and Detail Side by Side (Desktop) */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Left: Kanji Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kanji Characters</h3>
            <div className="grid grid-cols-6 xl:grid-cols-8 gap-2 max-h-[600px] overflow-y-auto">
              {kanji.map((k) => (
                <button
                  key={k.character}
                  onClick={() => setSelectedKanji(k)}
                  className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedKanji?.character === k.character
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 shadow-lg text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                  title={k.meanings.join(', ')}
                >
                  {k.character}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Kanji Detail Card (Desktop) */}
          {selectedKanji ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
              {/* Large Kanji Display */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 flex items-center justify-center border-4 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-7xl font-bold text-gray-900 dark:text-white">
                    {selectedKanji.character}
                  </span>
                </div>
                <div className="flex gap-3 mt-3">
                  {selectedKanji.strokeCount && (
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                      {selectedKanji.strokeCount} strokes
                    </div>
                  )}
                  {selectedKanji.jlptLevel && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                      JLPT {selectedKanji.jlptLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Kanji Information */}
              <div className="space-y-4">
                {/* Meanings */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Meanings
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedKanji.meanings.map((meaning, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                      >
                        {meaning}
                      </span>
                    ))}
                  </div>
                </div>

                {/* On'yomi */}
                {selectedKanji.onyomi.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      On&apos;yomi (音読み)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.onyomi.map((reading, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
                        >
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kun'yomi */}
                {selectedKanji.kunyomi.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Kun&apos;yomi (訓読み)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.kunyomi.map((reading, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                        >
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Examples
                  </h3>
                  <div className="space-y-2">
                    {selectedKanji.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {example.word}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {example.reading}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{example.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 flex items-center justify-center min-h-[600px]">
              <p className="text-lg text-gray-500 dark:text-gray-400 text-center">
                Select a kanji character to view detailed information
              </p>
            </div>
          )}
        </div>

        {/* Kanji Grid (Mobile) */}
        <div className="lg:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kanji Characters</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {kanji.map((k) => (
              <button
                key={k.character}
                onClick={() => setSelectedKanji(k)}
                className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2 transition-all ${
                  selectedKanji?.character === k.character
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 shadow-lg text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
                title={k.meanings.join(', ')}
              >
                {k.character}
              </button>
            ))}
          </div>
        </div>

        {/* Kanji Detail Modal (Mobile) */}
        {selectedKanji && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kanji Details</h3>
                <button
                  onClick={() => setSelectedKanji(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {/* Large Kanji Display */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 flex items-center justify-center border-4 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-7xl font-bold text-gray-900 dark:text-white">
                      {selectedKanji.character}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    {selectedKanji.strokeCount && (
                      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                        {selectedKanji.strokeCount} strokes
                      </div>
                    )}
                    {selectedKanji.jlptLevel && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                        JLPT {selectedKanji.jlptLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Kanji Information */}
                <div className="space-y-4">
                  {/* Meanings */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Meanings
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.meanings.map((meaning, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                        >
                          {meaning}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* On'yomi */}
                  {selectedKanji.onyomi.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        On&apos;yomi (音読み)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedKanji.onyomi.map((reading, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
                          >
                            {reading}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kun'yomi */}
                  {selectedKanji.kunyomi.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        Kun&apos;yomi (訓読み)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedKanji.kunyomi.map((reading, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                          >
                            {reading}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Examples
                    </h3>
                    <div className="space-y-2">
                      {selectedKanji.examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              {example.word}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {example.reading}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{example.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
