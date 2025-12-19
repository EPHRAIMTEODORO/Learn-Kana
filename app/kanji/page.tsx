'use client';

import { useState } from 'react';
import { kanjiGradeSections, getKanjiByGrade } from '@/data/kanji';
import type { KanjiGrade, KanjiCharacter } from '@/types/kanji';

export default function KanjiPage() {
  const [selectedGrade, setSelectedGrade] = useState<KanjiGrade>('grade1');
  const [selectedKanji, setSelectedKanji] = useState<KanjiCharacter | null>(null);

  const currentSection = kanjiGradeSections.find(s => s.grade === selectedGrade);
  const kanji = getKanjiByGrade(selectedGrade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Jōyō Kanji Learning
          </h1>
          <p className="text-gray-600">常用漢字 - Kanji for Daily Use</p>
        </header>

        {/* Grade Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Grade Level</h2>
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
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium text-gray-700">
                  {section.gradeName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {section.gradeNameJapanese}
                </div>
                <div className="text-lg font-bold text-blue-600 mt-2">
                  {section.kanji.length}
                  {section.kanji.length < section.totalCount && (
                    <span className="text-xs font-normal text-gray-500">
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentSection.gradeName} ({currentSection.gradeNameJapanese})
            </h2>
            <p className="text-gray-600 mb-4">{currentSection.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {currentSection.kanji.length === currentSection.totalCount 
                  ? `Complete: ${currentSection.kanji.length} kanji ✓`
                  : `Available: ${currentSection.kanji.length} of ${currentSection.totalCount} kanji`
                }
              </span>
            </div>
          </div>
        )}

        {/* Kanji Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Kanji Characters</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {kanji.map((k) => (
              <button
                key={k.character}
                onClick={() => setSelectedKanji(k)}
                className={`aspect-square flex items-center justify-center text-3xl font-bold rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedKanji?.character === k.character
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                title={k.meanings.join(', ')}
              >
                {k.character}
              </button>
            ))}
          </div>
        </div>

        {/* Kanji Detail Card */}
        {selectedKanji && (
          <div className="bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Large Kanji Display */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 flex items-center justify-center border-4 border-gray-200 rounded-lg bg-gray-50">
                  <span className="text-9xl font-bold text-gray-800">
                    {selectedKanji.character}
                  </span>
                </div>
                {selectedKanji.strokeCount && (
                  <div className="text-center mt-4 text-sm text-gray-600">
                    {selectedKanji.strokeCount} strokes
                  </div>
                )}
                {selectedKanji.jlptLevel && (
                  <div className="text-center mt-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      JLPT {selectedKanji.jlptLevel}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Kanji Information */}
              <div className="flex-1 space-y-6">
                {/* Meanings */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Meanings
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedKanji.meanings.map((meaning, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                      >
                        {meaning}
                      </span>
                    ))}
                  </div>
                </div>

                {/* On'yomi */}
                {selectedKanji.onyomi.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      On&apos;yomi (音読み) - Chinese Reading
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.onyomi.map((reading, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium"
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
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Kun&apos;yomi (訓読み) - Japanese Reading
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.kunyomi.map((reading, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium"
                        >
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Example Words
                  </h3>
                  <div className="space-y-3">
                    {selectedKanji.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-2xl font-bold text-gray-800">
                            {example.word}
                          </span>
                          <span className="text-lg text-gray-600">
                            {example.reading}
                          </span>
                        </div>
                        <p className="text-gray-700">{example.meaning}</p>
                        {example.type && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            {example.type}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedKanji && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
            <p className="text-lg">
              Select a kanji character above to view detailed information
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
