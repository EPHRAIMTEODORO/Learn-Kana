import { QuizAttempt } from '@/types/kana';

const STORAGE_KEY = 'kana-attempts';

export interface AttemptRepository {
  saveAttempt(attempt: QuizAttempt): void;
  getAttempts(): QuizAttempt[];
  clearAttempts(): void;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * Browser prototype repository. Keeping localStorage here makes it replaceable
 * with an API/database repository when real learner accounts are introduced.
 */
export const localAttemptRepository: AttemptRepository = {
  saveAttempt(attempt: QuizAttempt) {
    if (!isBrowser()) return;

    const attempts = this.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  },

  getAttempts() {
    if (!isBrowser()) return [];

    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) return [];
      return JSON.parse(value) as QuizAttempt[];
    } catch (error) {
      console.error('Error loading attempt history:', error);
      return [];
    }
  },

  clearAttempts() {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

export function saveAttempt(attempt: QuizAttempt): void {
  localAttemptRepository.saveAttempt(attempt);
}

export function getAttempts(): QuizAttempt[] {
  return localAttemptRepository.getAttempts();
}

export function clearAttempts(): void {
  localAttemptRepository.clearAttempts();
}
