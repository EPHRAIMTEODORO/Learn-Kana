import { CharacterProgress } from '@/types/kana';
import { getUserData, recordItemResult, resetData } from '@/lib/storage';

/**
 * Progress tracking utilities using localStorage
 * Tracks correct/incorrect attempts and last review time for each character
 */

/**
 * Load all progress data from localStorage
 */
export function getAllProgress(): CharacterProgress[] {
  return Object.values(getUserData().progress);
}

/**
 * Get progress for a specific character
 */
export function getProgress(character: string): CharacterProgress | null {
  return getUserData().progress[character] ?? null;
}

/**
 * Update progress for a character after practice/quiz
 * Creates new entry if character hasn't been practiced before
 */
export function updateProgress(character: string, isCorrect: boolean): void {
  recordItemResult(character, isCorrect);
}

/**
 * Reset the local learner model.
 */
export function clearAllProgress(): void {
  resetData();
}

/**
 * Calculate accuracy percentage for a character
 */
export function calculateAccuracy(progress: CharacterProgress): number {
  const total = progress.correct + progress.incorrect;
  if (total === 0) return 0;
  return Math.round((progress.correct / total) * 100);
}
