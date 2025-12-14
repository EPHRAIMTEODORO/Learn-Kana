import { KanaCharacter, QuizQuestion } from '@/types/kana';

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
