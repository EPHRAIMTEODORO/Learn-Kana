import { QuizAttempt } from '@/types/kana';
import { addAttempt, getUserData, resetData } from '@/lib/storage';

export interface AttemptRepository {
  saveAttempt(attempt: QuizAttempt): void;
  getAttempts(): QuizAttempt[];
  clearAttempts(): void;
}

/**
 * Browser learning-data repository. Keeping localStorage here makes it replaceable
 * with an API/database repository when real learner accounts are introduced.
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
