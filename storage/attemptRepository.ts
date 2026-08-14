import { QuizAttempt } from '@/types/kana';
import { addAttempt, getUserData, resetData } from '@/lib/storage';

export interface AttemptRepository {
  saveAttempt(attempt: QuizAttempt): void;
  getAttempts(): QuizAttempt[];
  clearAttempts(): void;
}

/**
 * Browser-facing learning-data repository. The storage module keeps a local
 * cache and syncs learner data to MongoDB through the app route handler.
 */
export const localAttemptRepository: AttemptRepository = {
  saveAttempt(attempt: QuizAttempt) {
    addAttempt(attempt);
  },

  getAttempts() {
    return getUserData().attempts;
  },

  clearAttempts() {
    resetData();
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
