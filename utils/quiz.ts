import { KanaCharacter, QuizQuestion } from '@/types/kana';
import { KanjiCharacter, KanjiQuizQuestion } from '@/types/kanji';

/**
 * Generate randomized quiz questions from kana data
 * Creates mix of char-to-romaji and romaji-to-char questions
 * 
 * @param data - Array of kana characters to quiz on
 * @param count - Number of questions to generate
 * @returns Array of quiz questions with randomized options
 */
export function generateQuizQuestions(
  data: KanaCharacter[],
  count: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedIndices = new Set<number>();

  while (questions.length < count && usedIndices.size < data.length) {
    // Select random character
    const randomIndex = Math.floor(Math.random() * data.length);
    if (usedIndices.has(randomIndex)) continue;
    usedIndices.add(randomIndex);

    const character = data[randomIndex];
    
    // Randomly choose question direction
    const questionType = Math.random() > 0.5 ? 'char-to-romaji' : 'romaji-to-char';
    
    const question: QuizQuestion = {
      question: questionType === 'char-to-romaji' ? character.character : character.romaji,
      correctAnswer: questionType === 'char-to-romaji' ? character.romaji : character.character,
      options: [],
      type: character.type,
      questionType,
    };

    // Generate wrong answers from same character type
    const sameTypeChars = data.filter(c => c.type === character.type);
    const wrongAnswers = new Set<string>();
    
    while (wrongAnswers.size < 3) {
      const randomChar = sameTypeChars[Math.floor(Math.random() * sameTypeChars.length)];
      const answer = questionType === 'char-to-romaji' 
        ? randomChar.romaji 
        : randomChar.character;
      
      if (answer !== question.correctAnswer) {
        wrongAnswers.add(answer);
      }
    }

    // Combine and shuffle options
    question.options = [
      question.correctAnswer,
      ...Array.from(wrongAnswers)
    ].sort(() => Math.random() - 0.5);

    questions.push(question);
  }

  return questions;
}

/**
 * Generate randomized quiz questions from kanji data
 * Tests meanings, readings (onyomi/kunyomi), and recognition
 * 
 * @param data - Array of kanji characters to quiz on
 * @param count - Number of questions to generate
 * @returns Array of kanji quiz questions with randomized options
 */
export function generateKanjiQuizQuestions(
  data: KanjiCharacter[],
  count: number
): KanjiQuizQuestion[] {
  const questions: KanjiQuizQuestion[] = [];
  const usedIndices = new Set<number>();

  while (questions.length < count && usedIndices.size < data.length) {
    // Select random kanji
    const randomIndex = Math.floor(Math.random() * data.length);
    if (usedIndices.has(randomIndex)) continue;
    usedIndices.add(randomIndex);

    const kanji = data[randomIndex];
    
    // Randomly choose question type
    const questionTypes: ('kanji-to-meaning' | 'meaning-to-kanji' | 'kanji-to-reading')[] = [
      'kanji-to-meaning',
      'meaning-to-kanji',
      'kanji-to-reading'
    ];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    let question: KanjiQuizQuestion;

    if (questionType === 'kanji-to-meaning') {
      // Show kanji, choose meaning
      const correctMeaning = kanji.meanings[0];
      const wrongAnswers = new Set<string>();
      
      while (wrongAnswers.size < 3) {
        const randomKanji = data[Math.floor(Math.random() * data.length)];
        const meaning = randomKanji.meanings[0];
        if (meaning !== correctMeaning && randomKanji.character !== kanji.character) {
          wrongAnswers.add(meaning);
        }
      }

      question = {
        question: kanji.character,
        correctAnswer: correctMeaning,
        options: [correctMeaning, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5),
        kanji: kanji.character,
        grade: kanji.grade,
        questionType: 'kanji-to-meaning'
      };
    } else if (questionType === 'meaning-to-kanji') {
      // Show meaning, choose kanji
      const wrongAnswers = new Set<string>();
      
      while (wrongAnswers.size < 3) {
        const randomKanji = data[Math.floor(Math.random() * data.length)];
        if (randomKanji.character !== kanji.character) {
          wrongAnswers.add(randomKanji.character);
        }
      }

      question = {
        question: kanji.meanings[0],
        correctAnswer: kanji.character,
        options: [kanji.character, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5),
        kanji: kanji.character,
        grade: kanji.grade,
        questionType: 'meaning-to-kanji'
      };
    } else {
      // Show kanji, choose reading (onyomi or kunyomi)
      const allReadings = [...kanji.onyomi, ...kanji.kunyomi];
      if (allReadings.length === 0) continue; // Skip if no readings
      
      const correctReading = allReadings[Math.floor(Math.random() * allReadings.length)];
      const wrongAnswers = new Set<string>();
      
      while (wrongAnswers.size < 3) {
        const randomKanji = data[Math.floor(Math.random() * data.length)];
        const randomReadings = [...randomKanji.onyomi, ...randomKanji.kunyomi];
        if (randomReadings.length > 0) {
          const reading = randomReadings[Math.floor(Math.random() * randomReadings.length)];
          if (reading !== correctReading && !allReadings.includes(reading)) {
            wrongAnswers.add(reading);
          }
        }
      }

      question = {
        question: kanji.character,
        correctAnswer: correctReading,
        options: [correctReading, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5),
        kanji: kanji.character,
        grade: kanji.grade,
        questionType: 'kanji-to-reading'
      };
    }

    questions.push(question);
  }

  return questions;
}
