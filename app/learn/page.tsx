'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData, allKanaData } from '@/data/kana';
import { getAllKanji } from '@/data/kanji';
import { KanaCharacter, LearningMode } from '@/types/kana';
import { KanjiCharacter } from '@/types/kanji';
import Flashcard from '@/components/Flashcard';
import KanjiFlashcard from '@/components/KanjiFlashcard';
import { updateProgress } from '@/utils/progress';

export default function LearnPage() {
  const [mode, setMode] = useState<LearningMode>('hiragana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<KanaCharacter[] | KanjiCharacter[]>(hiraganaData);
  const [isKanjiMode, setIsKanjiMode] = useState(false);

  // Update cards when mode changes
  useEffect(() => {
    if (mode === 'kanji') {
      const kanjiData = getAllKanji();
      // Use all available kanji
      const newCards = kanjiData;
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
  }, [mode]);

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Flashcards
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('hiragana')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'hiragana'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setMode('katakana')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'katakana'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setMode('mixed')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'mixed'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Mixed
          </button>
          <button
            onClick={() => setMode('kanji')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'kanji'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Kanji
          </button>
        </div>

        {/* Progress Counter */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-300">
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
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                Still Learning
              </button>
              <button
                onClick={handleKnow}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
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
