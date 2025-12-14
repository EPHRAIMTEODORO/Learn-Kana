import { CharacterProgress } from '@/types/kana';

const STORAGE_KEY = 'kana-progress';

/**
 * Progress tracking utilities using localStorage
 * Tracks correct/incorrect attempts and last review time for each character
 */

/**
 * Load all progress data from localStorage
 */
export function getAllProgress(): CharacterProgress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const progress = JSON.parse(data);
    return Object.values(progress);
  } catch (error) {
    console.error('Error loading progress:', error);
    return [];
  }
}

/**
 * Get progress for a specific character
 */
export function getProgress(character: string): CharacterProgress | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const progress = JSON.parse(data);
    return progress[character] || null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}

/**
 * Update progress for a character after practice/quiz
 * Creates new entry if character hasn't been practiced before
 */
export function updateProgress(character: string, isCorrect: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const progress = data ? JSON.parse(data) : {};
    
    if (!progress[character]) {
      progress[character] = {
        character,
        correct: 0,
        incorrect: 0,
        lastReviewed: Date.now(),
      };
    }
    
    if (isCorrect) {
      progress[character].correct += 1;
    } else {
      progress[character].incorrect += 1;
    }
    
    progress[character].lastReviewed = Date.now();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

/**
 * Clear all progress data
 * Used when user wants to start fresh
 */
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
}

/**
 * Calculate accuracy percentage for a character
 */
export function calculateAccuracy(progress: CharacterProgress): number {
  const total = progress.correct + progress.incorrect;
  if (total === 0) return 0;
  return Math.round((progress.correct / total) * 100);
}
