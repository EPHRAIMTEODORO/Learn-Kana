/**
 * Core data model for kana characters
 * Each character tracks learning progress: correct/incorrect attempts and last review timestamp
 */
export interface KanaCharacter {
  character: string;    // The Japanese character (e.g., 'あ', 'ア')
  romaji: string;       // Roman alphabet pronunciation (e.g., 'a')
  type: 'hiragana' | 'katakana';
}

export type KanaType = 'hiragana' | 'katakana';

export type KanaPracticeMode = 'random' | 'review_mistakes' | 'recommended';

export type KanaStudySet = 'basic' | 'voiced' | 'combinations' | 'all';

export type LearningItemCategory = 'hiragana' | 'katakana' | 'kanji';

export interface LearningItemProgress {
  itemId: string;
  character: string;
  category: LearningItemCategory;
  grade?: string;
  correct: number;
  incorrect: number;
  attempts: number;
  lastSeen: number | null;
  lastReviewed: number;
  easeFactor: number;
  interval: number;
  nextReviewAt: number;
  consecutiveCorrect: number;
  recentFailures: number[];
  firstSeen: number;
}

export interface UserData {
  version: 1;
  progress: Record<string, LearningItemProgress>;
  attempts: QuizAttempt[];
  createdAt: string;
  updatedAt: string;
}

export interface RecommendedLearningItem {
  itemId: string;
  character: string;
  category: LearningItemCategory;
  grade?: string;
  accuracy: number;
  priorityScore: number;
  reasons: string[];
  nextReviewAt?: number;
}

export interface RecommendationTrace {
  policy: string;
  dueCount: number;
  weakCount: number;
  newCount: number;
  selectedCount: number;
  signals: Array<{
    name: string;
    description: string;
    weight: string;
  }>;
}

export interface VirtualTAFeedback {
  summary: string;
  nextAction: string;
  evidence: string[];
  researchSignals: string[];
}

export interface ConfusionDetection {
  confusionType: 'visual_similarity';
  confusionPair: string;
}

/**
 * Event log for educational data mining and later backend storage.
 */
export interface QuizAttempt {
  id: string;
  createdAt: string;
  characterShown: string;
  expectedAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  practiceMode: KanaPracticeMode;
  kanaType: KanaType;
  group?: string;
  confusionType?: 'visual_similarity';
  confusionPair?: string;
  sessionId: string;
}

export interface KanaStats {
  character: string;
  romaji: string;
  kanaType: KanaType;
  group: string;
  attempts: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  averageResponseTimeMs: number;
  lastPracticedAt?: string;
  recentAccuracy: number;
  previousAccuracy: number;
  improvement: number;
  confusionCount: number;
}

export interface GroupStats {
  group: string;
  attempts: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface ConfusionPairStats {
  pair: string;
  count: number;
}

export interface LearnerStats {
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  overallAccuracy: number;
  averageResponseTimeMs: number;
  accuracyByKana: KanaStats[];
  accuracyByGroup: GroupStats[];
  averageResponseTimeByKana: Array<{
    character: string;
    averageResponseTimeMs: number;
  }>;
  mostMissedKana: KanaStats[];
  mostConfusedPairs: ConfusionPairStats[];
  recentlyImprovedKana: KanaStats[];
  weakestKana: KanaStats[];
  strongestKana: KanaStats[];
  recommendedNextPracticeSet: KanaStats[];
}

/**
 * Progress tracking for individual characters
 * Persisted in localStorage for continuity across sessions
 */
export interface CharacterProgress {
  itemId?: string;
  character: string;
  category?: LearningItemCategory;
  grade?: string;
  correct: number;      // Count of correct answers
  incorrect: number;    // Count of incorrect answers
  lastReviewed: number; // Timestamp of last review
  attempts?: number;
  lastSeen?: number | null;
  easeFactor?: number;
  interval?: number;
  nextReviewAt?: number;
  recentFailures?: number[];
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
  character: string;
  romaji: string;
  group: string;
}

/**
 * Learning mode settings for flashcard practice
 */
export type LearningMode = 'hiragana' | 'katakana' | 'mixed' | 'kanji';
