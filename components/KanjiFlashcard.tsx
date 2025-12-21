'use client';

import { useState } from 'react';
import { KanjiCharacter } from '@/types/kanji';

interface KanjiFlashcardProps {
  card: KanjiCharacter;
}

/**
 * Interactive kanji flashcard component with flip animation
 * Front: Shows kanji character
 * Back: Shows meanings, onyomi, and kunyomi readings
 */
export default function KanjiFlashcard({ card }: KanjiFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front - Kanji Character */}
        <div
          className={`absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col items-center justify-center backface-hidden ${
            isFlipped ? 'invisible' : 'visible'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-9xl font-bold text-gray-900 dark:text-white mb-4">
            {card.character}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tap to reveal
          </p>
        </div>

        {/* Back - Meanings and Readings */}
        <div
          className={`absolute inset-0 bg-indigo-600 rounded-xl shadow-2xl flex flex-col items-center justify-center p-6 backface-hidden overflow-y-auto ${
            isFlipped ? 'visible' : 'invisible'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-5xl font-bold text-white mb-4">
            {card.character}
          </div>
          
          {/* Meanings */}
          <div className="mb-4 text-center">
            <p className="text-indigo-200 text-sm mb-1">Meanings</p>
            <p className="text-white text-lg font-semibold">
              {card.meanings.slice(0, 3).join(', ')}
            </p>
          </div>

          {/* Onyomi */}
          {card.onyomi.length > 0 && (
            <div className="mb-3 text-center">
              <p className="text-indigo-200 text-sm mb-1">On'yomi (音読み)</p>
              <p className="text-white text-md">
                {card.onyomi.slice(0, 3).join(', ')}
              </p>
            </div>
          )}

          {/* Kunyomi */}
          {card.kunyomi.length > 0 && (
            <div className="mb-3 text-center">
              <p className="text-indigo-200 text-sm mb-1">Kun'yomi (訓読み)</p>
              <p className="text-white text-md">
                {card.kunyomi.slice(0, 3).join(', ')}
              </p>
            </div>
          )}

          {/* Grade Level */}
          <div className="mt-2 text-center">
            <p className="text-indigo-200 text-xs">
              {card.grade.replace('grade', 'Grade ')} • {card.strokeCount} strokes
              {card.jlptLevel && ` • JLPT ${card.jlptLevel}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
