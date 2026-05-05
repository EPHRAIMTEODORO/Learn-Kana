'use client';

import { useEffect, useState } from 'react';
import { kanjiGradeSections, getKanjiByGrade } from '@/data/kanji';
import type { KanjiGrade, KanjiCharacter } from '@/types/kanji';
import { CharacterProgress } from '@/types/kana';
import { getAllProgress } from '@/utils/progress';
import AppNav from '@/components/AppNav';

export default function KanjiPage() {
  const [selectedGrade, setSelectedGrade] = useState<KanjiGrade>('grade1');
  const [selectedKanji, setSelectedKanji] = useState<KanjiCharacter | null>(null);
  const [progressData, setProgressData] = useState<CharacterProgress[]>([]);

  useEffect(() => {
    setProgressData(getAllProgress());
  }, []);

  const currentSection = kanjiGradeSections.find(s => s.grade === selectedGrade);
  const kanji = getKanjiByGrade(selectedGrade);
  const totalLoadedKanji = kanjiGradeSections.reduce((sum, section) => sum + section.kanji.length, 0);
  const progressByCharacter = new Map(progressData.map((item) => [item.character, item]));

  const gradeProgress = kanjiGradeSections.map((section) => {
    const learned = section.kanji.filter((item) => {
      const progress = progressByCharacter.get(item.character);
      return progress && (progress.attempts ?? progress.correct + progress.incorrect) > 0;
    }).length;
    const percent = section.kanji.length > 0 ? Math.round((learned / section.kanji.length) * 100) : 0;

    return {
      grade: section.grade,
      learned,
      percent,
    };
  });

  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-8 rounded-lg border border-academic-border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
            Kanji by Grade
          </p>
          <h1 className="mt-2 text-4xl font-bold text-academic-text">
            Kanji Learning Structure
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-academic-muted">
            Kanji are grouped by Japanese school grade so learners can move from foundational characters to more advanced Jōyō kanji. The local dataset includes meanings, readings, examples, stroke counts, and grade labels.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-academic-background p-4">
              <p className="text-sm text-academic-muted">Loaded kanji</p>
              <p className="mt-1 text-2xl font-bold text-academic-text">{totalLoadedKanji}</p>
            </div>
            <div className="rounded-md bg-academic-background p-4">
              <p className="text-sm text-academic-muted">Groups</p>
              <p className="mt-1 text-2xl font-bold text-academic-text">{kanjiGradeSections.length}</p>
            </div>
            <div className="rounded-md bg-academic-background p-4">
              <p className="text-sm text-academic-muted">Dataset note</p>
              <p className="mt-1 text-sm font-medium text-academic-text">Generated from kanjiapi.dev and normalized locally.</p>
            </div>
          </div>
        </section>

        {/* Grade Selector */}
        <div className="mb-8 rounded-lg border border-academic-border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-academic-text mb-4">Choose a grade group</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {kanjiGradeSections.map((section) => (
              <button
                key={section.grade}
                onClick={() => {
                  setSelectedGrade(section.grade);
                  setSelectedKanji(null);
                }}
                className={`p-4 rounded-lg border-2 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-academic-primary ${
                  selectedGrade === section.grade
                    ? 'border-indigo-500 bg-[#F0F2FC] shadow-md'
                    : 'border-academic-border hover:border-[#C8D0F0] hover:bg-academic-background'
                }`}
              >
                <div className="text-sm font-medium text-academic-text">
                  {section.gradeName}
                </div>
                <div className="text-xs text-academic-muted mt-1">
                  {section.gradeNameJapanese}
                </div>
                <div className="mt-3 h-2 rounded-full bg-academic-section">
                  <div
                    className="h-2 rounded-full bg-academic-primary"
                    style={{ width: `${gradeProgress.find((item) => item.grade === section.grade)?.percent ?? 0}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-academic-muted">
                  {gradeProgress.find((item) => item.grade === section.grade)?.percent ?? 0}% completed
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Section Info */}
        {currentSection && (
          <div className="bg-white rounded-lg border border-academic-border shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-academic-text mb-2">
              {currentSection.gradeName} ({currentSection.gradeNameJapanese})
            </h2>
            <p className="text-academic-muted mb-4">{currentSection.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-[#E8EAF6] text-academic-primary rounded-full">
                {currentSection.kanji.length === currentSection.totalCount 
                  ? `Available: ${currentSection.kanji.length} kanji`
                  : `Available: ${currentSection.kanji.length} of ${currentSection.totalCount} kanji`
                }
              </span>
            </div>
          </div>
        )}

        {/* Kanji Grid and Detail Side by Side (Desktop) */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Left: Kanji Grid */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-academic-text mb-4">Select a character</h3>
            <div className="grid grid-cols-6 xl:grid-cols-8 gap-2 max-h-[600px] overflow-y-auto">
              {kanji.map((k) => (
                <button
                  key={k.character}
                  onClick={() => setSelectedKanji(k)}
                  className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedKanji?.character === k.character
                      ? 'border-[#C8D0F0] bg-[#F0F2FC] shadow-lg text-academic-text'
                      : 'border-academic-border hover:border-[#C8D0F0] hover:bg-academic-background text-academic-text'
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
            <div className="bg-white rounded-xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
              {/* Large Kanji Display */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 flex items-center justify-center border-4 border-academic-border rounded-lg bg-academic-section">
                  <span className="text-7xl font-bold text-academic-text">
                    {selectedKanji.character}
                  </span>
                </div>
                <div className="flex gap-3 mt-3">
                  {selectedKanji.strokeCount && (
                    <div className="text-center text-sm text-academic-muted">
                      {selectedKanji.strokeCount} strokes
                    </div>
                  )}
                  {selectedKanji.jlptLevel && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      JLPT {selectedKanji.jlptLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Kanji Information */}
              <div className="space-y-4">
                {/* Meanings */}
                <div>
                  <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
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
                    <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
                      On&apos;yomi (音読み)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.onyomi.map((reading, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#F8E7E7] text-[#8E3F3F] rounded-lg text-sm font-medium"
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
                    <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
                      Kun&apos;yomi (訓読み)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanji.kunyomi.map((reading, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#E7F0EA] text-[#355C3F] rounded-lg text-sm font-medium"
                        >
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                <div>
                  <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
                    Examples
                  </h3>
                  <div className="space-y-2">
                    {selectedKanji.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-academic-section rounded-lg border border-academic-border"
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xl font-bold text-academic-text">
                            {example.word}
                          </span>
                          <span className="text-sm text-academic-muted">
                            {example.reading}
                          </span>
                        </div>
                        <p className="text-sm text-academic-muted">{example.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center min-h-[600px]">
              <p className="text-lg text-academic-muted text-center">
                Select a kanji character to view detailed information
              </p>
            </div>
          )}
        </div>

        {/* Kanji Grid (Mobile) */}
        <div className="lg:hidden bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-academic-text mb-4">Select a character</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {kanji.map((k) => (
              <button
                key={k.character}
                onClick={() => setSelectedKanji(k)}
                className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2 transition-all ${
                  selectedKanji?.character === k.character
                    ? 'border-[#C8D0F0] bg-[#F0F2FC] shadow-lg text-academic-text'
                    : 'border-academic-border hover:border-[#C8D0F0] hover:bg-academic-background text-academic-text'
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
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <div className="sticky top-0 bg-white border-b border-academic-border p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-academic-text">Kanji Details</h3>
                <button
                  onClick={() => setSelectedKanji(null)}
                  className="text-academic-muted hover:text-academic-muted p-2"
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
                  <div className="w-32 h-32 flex items-center justify-center border-4 border-academic-border rounded-lg bg-academic-section">
                    <span className="text-7xl font-bold text-academic-text">
                      {selectedKanji.character}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    {selectedKanji.strokeCount && (
                      <div className="text-center text-sm text-academic-muted">
                        {selectedKanji.strokeCount} strokes
                      </div>
                    )}
                    {selectedKanji.jlptLevel && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        JLPT {selectedKanji.jlptLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Kanji Information */}
                <div className="space-y-4">
                  {/* Meanings */}
                  <div>
                    <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
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
                      <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
                        On&apos;yomi (音読み)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedKanji.onyomi.map((reading, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#F8E7E7] text-[#8E3F3F] rounded-lg text-sm font-medium"
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
                      <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
                        Kun&apos;yomi (訓読み)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedKanji.kunyomi.map((reading, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#E7F0EA] text-[#355C3F] rounded-lg text-sm font-medium"
                          >
                            {reading}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div>
                    <h3 className="text-xs font-semibold text-academic-muted uppercase mb-2">
                      Examples
                    </h3>
                    <div className="space-y-2">
                      {selectedKanji.examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-academic-section rounded-lg border border-academic-border"
                        >
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xl font-bold text-academic-text">
                              {example.word}
                            </span>
                            <span className="text-sm text-academic-muted">
                              {example.reading}
                            </span>
                          </div>
                          <p className="text-sm text-academic-muted">{example.meaning}</p>
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
