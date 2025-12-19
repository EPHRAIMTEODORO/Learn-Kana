/**
 * Core data model for Jōyō Kanji (常用漢字)
 * Organized by Japanese school grade system
 */

/**
 * Individual kanji character with all learning data
 * Structure designed for extensibility - can add stroke order, JLPT level, etc. without refactoring
 */
export interface KanjiCharacter {
  // Core data
  character: string;           // The kanji character (e.g., '一', '山')
  meanings: string[];          // English meanings (e.g., ['one'], ['mountain', 'hill'])
  
  // Readings
  onyomi: string[];            // On'yomi (Chinese reading) in katakana (e.g., ['イチ', 'イツ'])
  kunyomi: string[];           // Kun'yomi (Japanese reading) in hiragana (e.g., ['ひと', 'ひと.つ'])
  
  // Examples
  examples: KanjiExample[];    // Example words using this kanji
  
  // Grade information
  grade: KanjiGrade;           // Which grade this kanji is taught
  
  // Optional extensible fields (future features)
  strokeCount?: number;        // Number of strokes
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';  // JLPT proficiency level
  frequency?: number;          // Usage frequency ranking
  radicals?: string[];         // Component radicals
  strokeOrder?: string[];      // SVG paths or image URLs for stroke order
  mnemonics?: string;          // Memory aids
  tags?: string[];             // Custom tags for organization
}

/**
 * Example word or phrase using the kanji
 */
export interface KanjiExample {
  word: string;                // The word in kanji/kana (e.g., '一つ', '山本')
  reading: string;             // Hiragana reading (e.g., 'ひとつ', 'やまもと')
  meaning: string;             // English meaning (e.g., 'one (thing)', 'Yamamoto (surname)')
  type?: 'word' | 'phrase' | 'name';  // Optional categorization
}

/**
 * Grade classification following Japanese education system
 * Elementary grades 1-6 (Kyōiku Kanji - 教育漢字)
 * Junior high covers remaining Jōyō Kanji
 */
export type KanjiGrade = 
  | 'grade1'    // 第一学年 (80 kanji)
  | 'grade2'    // 第二学年 (160 kanji)
  | 'grade3'    // 第三学年 (200 kanji)
  | 'grade4'    // 第四学年 (202 kanji)
  | 'grade5'    // 第五学年 (193 kanji)
  | 'grade6'    // 第六学年 (191 kanji)
  | 'juniorHigh'; // 中学校 (1126 kanji)

/**
 * Grade section with metadata
 */
export interface KanjiGradeSection {
  grade: KanjiGrade;
  gradeName: string;           // Display name (e.g., "Grade 1", "Junior High")
  gradeNameJapanese: string;   // Japanese name (e.g., "第一学年", "中学校")
  totalCount: number;          // Total number of kanji in this grade
  kanji: KanjiCharacter[];     // Array of kanji characters
  description?: string;        // Optional description of what's taught
}

/**
 * Progress tracking for individual kanji
 * Similar to kana but adapted for kanji complexity
 */
export interface KanjiProgress {
  character: string;
  correct: number;             // Count of correct answers
  incorrect: number;           // Count of incorrect answers
  lastReviewed: number;        // Timestamp of last review
  
  // Additional kanji-specific tracking
  readingCorrect?: number;     // Correct reading identification
  readingIncorrect?: number;   // Incorrect reading identification
  meaningCorrect?: number;     // Correct meaning identification
  meaningIncorrect?: number;   // Incorrect meaning identification
  
  masteryLevel?: 'learning' | 'reviewing' | 'mastered';
}

/**
 * Quiz question structure for kanji learning
 * Supports multiple question types for comprehensive learning
 */
export interface KanjiQuizQuestion {
  question: string;            // The prompt shown to user
  correctAnswer: string;       // The correct answer
  options: string[];           // All answer choices (includes correct answer)
  kanji: string;               // The kanji character being tested
  grade: KanjiGrade;           // Grade level of this kanji
  questionType: KanjiQuestionType;
}

/**
 * Types of kanji quiz questions
 * Allows testing different aspects of kanji knowledge
 */
export type KanjiQuestionType = 
  | 'kanji-to-meaning'    // Show kanji, choose English meaning
  | 'meaning-to-kanji'    // Show meaning, choose kanji
  | 'kanji-to-onyomi'     // Show kanji, choose on'yomi
  | 'kanji-to-kunyomi'    // Show kanji, choose kun'yomi
  | 'kanji-to-reading'    // Show kanji, choose any reading
  | 'word-to-reading';    // Show example word, choose reading

/**
 * Learning mode settings for kanji practice
 */
export interface KanjiLearningMode {
  grades: KanjiGrade[];        // Which grades to include
  questionTypes: KanjiQuestionType[];  // Which question types to use
  includeExamples?: boolean;   // Whether to include example words
}

/**
 * Filter options for kanji selection
 */
export interface KanjiFilter {
  grades?: KanjiGrade[];
  jlptLevels?: ('N5' | 'N4' | 'N3' | 'N2' | 'N1')[];
  strokeCountRange?: { min: number; max: number };
  tags?: string[];
}

/**
 * Statistics for kanji learning progress
 */
export interface KanjiStats {
  totalKanji: number;
  learnedKanji: number;
  masteredKanji: number;
  byGrade: Record<KanjiGrade, {
    total: number;
    learned: number;
    mastered: number;
  }>;
}
