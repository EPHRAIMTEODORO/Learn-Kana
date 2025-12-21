/**
 * Core data model for kana characters
 * Each character tracks learning progress: correct/incorrect attempts and last review timestamp
 */
export interface KanaCharacter {
  character: string;    // The Japanese character (e.g., 'あ', 'ア')
  romaji: string;       // Roman alphabet pronunciation (e.g., 'a')
  type: 'hiragana' | 'katakana';
}

/**
 * Progress tracking for individual characters
 * Persisted in localStorage for continuity across sessions
 */
export interface CharacterProgress {
  character: string;
  correct: number;      // Count of correct answers
  incorrect: number;    // Count of incorrect answers
  lastReviewed: number; // Timestamp of last review
}

/**
 * Quiz question structure supporting both directions:
 * - Character to romaji (show kana, answer with romaji)
 * - Romaji to character (show romaji, answer with kana)
 */
export interface QuizQuestion {
  question: string;         // The prompt shown to user
  correctAnswer: string;    // The correct answer
  options: string[];        // All answer choices (includes correct answer)
  type: 'hiragana' | 'katakana';
  questionType: 'char-to-romaji' | 'romaji-to-char';
}

/**
 * Learning mode settings for flashcard practice
 */
export type LearningMode = 'hiragana' | 'katakana' | 'mixed' | 'kanji';
