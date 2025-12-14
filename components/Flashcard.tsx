'use client';

import { useState } from 'react';
import { KanaCharacter } from '@/types/kana';

interface FlashcardProps {
  card: KanaCharacter;
}

/**
 * Interactive flashcard component with flip animation
 * Click/tap to toggle between character and romaji
 */
export default function Flashcard({ card }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front - Character */}
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

        {/* Back - Romaji */}
        <div
          className={`absolute inset-0 bg-indigo-600 rounded-xl shadow-2xl flex flex-col items-center justify-center backface-hidden ${
            isFlipped ? 'visible' : 'invisible'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-7xl font-bold text-white mb-4">
            {card.romaji}
          </div>
          <p className="text-indigo-200 text-sm">
            {card.type === 'hiragana' ? 'Hiragana' : 'Katakana'}
          </p>
        </div>
      </div>
    </div>
  );
}
