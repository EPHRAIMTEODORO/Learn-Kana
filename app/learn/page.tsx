'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData, allKanaData } from '@/data/kana';
import { getKanjiByGrade, kanjiGradeSections } from '@/data/kanji';
import { KanaCharacter, LearningMode } from '@/types/kana';
import { KanjiCharacter, KanjiGrade } from '@/types/kanji';
import Flashcard from '@/components/Flashcard';
import KanjiFlashcard from '@/components/KanjiFlashcard';
import { updateProgress } from '@/utils/progress';
import AppNav from '@/components/AppNav';

export default function LearnPage() {
  const [mode, setMode] = useState<LearningMode>('hiragana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<KanaCharacter[] | KanjiCharacter[]>(hiraganaData);
  const [isKanjiMode, setIsKanjiMode] = useState(false);
  const [kanjiGrade, setKanjiGrade] = useState<KanjiGrade>('grade1');

  // Update cards when mode changes
  useEffect(() => {
    if (mode === 'kanji') {
      const newCards = getKanjiByGrade(kanjiGrade);
      setIsKanjiMode(true);
      // Shuffle cards for varied practice
      const shuffled = [...newCards].sort(() => Math.random() - 0.5);
      setCards(shuffled as KanjiCharacter[]);
    } else {
      const newCards = mode === 'hiragana' 
        ? hiraganaData 
        : mode === 'katakana' 
        ? katakanaData 
        : allKanaData;
      setIsKanjiMode(false);
      // Shuffle cards for varied practice
      const shuffled = [...newCards].sort(() => Math.random() - 0.5);
      setCards(shuffled as KanaCharacter[]);
    }
    setCurrentIndex(0);
  }, [mode, kanjiGrade]);

  const currentCard = cards[currentIndex];

  const handleKnow = () => {
    // Track correct answer in progress
    updateProgress(currentCard.character, true);
    nextCard();
  };

  const handleStillLearning = () => {
    // Track incorrect answer in progress
    updateProgress(currentCard.character, false);
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reshuffle when reaching the end
      if (isKanjiMode) {
        const shuffled = [...(cards as KanjiCharacter[])].sort(() => Math.random() - 0.5);
        setCards(shuffled as KanjiCharacter[]);
      } else {
        const shuffled = [...(cards as KanaCharacter[])].sort(() => Math.random() - 0.5);
        setCards(shuffled as KanaCharacter[]);
      }
      setCurrentIndex(0);
    }
  };

  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
            Learn
          </p>
          <h1 className="mt-2 text-4xl font-bold text-academic-text">
            Flashcards
          </h1>
          <p className="mt-3 max-w-2xl text-academic-muted">
            Study kana or grade-organized kanji, then mark each card so the learner model can update.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setMode('hiragana')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'hiragana'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setMode('katakana')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'katakana'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setMode('mixed')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'mixed'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Mixed
          </button>
          <button
            onClick={() => setMode('kanji')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'kanji'
                ? 'bg-academic-primary text-white'
                : 'bg-white text-academic-muted hover:bg-academic-section'
            }`}
          >
            Kanji
          </button>
        </div>

        {mode === 'kanji' && (
          <section className="mx-auto mb-8 max-w-2xl rounded-lg border border-academic-border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-academic-text">Kanji flashcards by grade</h2>
                <p className="mt-1 text-sm text-academic-muted">
                  Choose a grade group before studying kanji cards.
                </p>
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium text-academic-muted">
                Grade
                <select
                  value={kanjiGrade}
                  onChange={(event) => setKanjiGrade(event.target.value as KanjiGrade)}
                  className="min-w-52 rounded-md border border-academic-border bg-white px-3 py-2 text-academic-text outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  {kanjiGradeSections.map((section) => (
                    <option key={section.grade} value={section.grade}>
                      {section.gradeName} · {section.kanji.length} kanji
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        )}

        {/* Progress Counter */}
        <div className="text-center mb-8">
          <p className="text-academic-muted">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>

        {/* Flashcard */}
        {currentCard && (
          <div className="max-w-md mx-auto">
            {isKanjiMode ? (
              <KanjiFlashcard card={currentCard as KanjiCharacter} />
            ) : (
              <Flashcard card={currentCard as KanaCharacter} />
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleStillLearning}
                className="flex-1 bg-[#B98B2E] hover:bg-[#9A7426] text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                Still Learning
              </button>
              <button
                onClick={handleKnow}
                className="flex-1 bg-[#4F7D5A] hover:bg-[#355C3F] text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                I Know This
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
