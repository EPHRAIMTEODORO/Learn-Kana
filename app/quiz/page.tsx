'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData, allKanaData } from '@/data/kana';
import { getAllKanji } from '@/data/kanji';
import { KanaPracticeMode, QuizAttempt, QuizQuestion, LearningMode, RecommendedLearningItem } from '@/types/kana';
import { KanjiQuizQuestion } from '@/types/kanji';
import { generateQuizQuestions, generateKanjiQuizQuestions } from '@/utils/quiz';
import { updateProgress } from '@/utils/progress';
import { getAttempts, saveAttempt } from '@/storage/attemptRepository';
import { getPracticeKana } from '@/services/adaptivePracticeService';
import { calculateLearnerStats } from '@/services/analyticsService';
import { detectConfusion } from '@/services/confusionService';
import { generateFeedback } from '@/services/feedbackService';
import { getRecommendedNext } from '@/lib/recommendations';
import { getUserData } from '@/lib/storage';

export default function QuizPage() {
  const [mode, setMode] = useState<LearningMode>('hiragana');
  const [practiceMode, setPracticeMode] = useState<KanaPracticeMode>('random');
  const [questions, setQuestions] = useState<QuizQuestion[] | KanjiQuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<RecommendedLearningItem[]>([]);

  const loadRecommendations = () => {
    setRecommended(getRecommendedNext(getUserData(), { limit: 10 }));
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const startQuiz = () => {
    let newQuestions: QuizQuestion[] | KanjiQuizQuestion[];
    
    if (mode === 'kanji') {
      const kanjiData = getAllKanji();
      const recommendedKanji = recommended
        .filter((item) => item.category === 'kanji')
        .map((item) => item.character);
      const practiceData = recommendedKanji.length > 0
        ? kanjiData.filter((kanji) => recommendedKanji.includes(kanji.character))
        : kanjiData;

      newQuestions = generateKanjiQuizQuestions(practiceData, 10);
    } else {
      const data = mode === 'hiragana' 
        ? hiraganaData 
        : mode === 'katakana' 
        ? katakanaData 
        : allKanaData;
      const practiceData =
        practiceMode === 'random'
          ? data
          : getPracticeKana(practiceMode, 10, mode);

      newQuestions = generateQuizQuestions(practiceData, 10, data);
    }
    
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    setQuestionStartedAt(Date.now());
    setQuizStarted(true);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Already answered
    
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Update progress based on answer
    // Extract character from question for progress tracking
    const question = questions[currentQuestion];
    let character: string;
    
    if ('kanji' in question) {
      // Kanji question
      character = question.kanji;
    } else {
      // Kana question
      character = question.questionType === 'char-to-romaji' 
        ? question.question 
        : question.correctAnswer;
    }
    
    updateProgress(character, isCorrect);

    if (!('kanji' in question)) {
      const responseTimeMs = Math.max(0, Date.now() - questionStartedAt);
      const confusion = !isCorrect
        ? detectConfusion(question.correctAnswer, answer, question.type)
        : null;
      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
        characterShown: question.character,
        expectedAnswer: question.correctAnswer,
        userAnswer: answer,
        isCorrect,
        responseTimeMs,
        practiceMode,
        kanaType: question.type,
        group: question.group,
        confusionType: confusion?.confusionType,
        confusionPair: confusion?.confusionPair,
        sessionId,
      };

      saveAttempt(attempt);
      const learnerStats = calculateLearnerStats([...getAttempts()]);
      setAnswerFeedback(generateFeedback(attempt, learnerStats));
    } else {
      setAnswerFeedback(null);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswerFeedback(null);
        setQuestionStartedAt(Date.now());
      } else {
        setShowResult(true);
        loadRecommendations();
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    loadRecommendations();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quiz Mode
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          {!quizStarted ? (
            /* Quiz Setup */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Choose Your Quiz Mode
              </h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <button
                  onClick={() => setMode('hiragana')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    mode === 'hiragana'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="block">Hiragana Only</span>
                  <span className="block text-sm font-normal opacity-80">Practice new characters</span>
                </button>
                <button
                  onClick={() => setMode('katakana')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    mode === 'katakana'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="block">Katakana Only</span>
                  <span className="block text-sm font-normal opacity-80">Practice new characters</span>
                </button>
                <button
                  onClick={() => setMode('mixed')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    mode === 'mixed'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="block">Mixed Kana</span>
                  <span className="block text-sm font-normal opacity-80">Review mistakes across both scripts</span>
                </button>
                <button
                  onClick={() => setMode('kanji')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    mode === 'kanji'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="block">Kanji by Grade</span>
                  <span className="block text-sm font-normal opacity-80">Adaptive quiz based on your performance</span>
                </button>
              </div>

              {mode !== 'kanji' && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Practice Selection
                  </h3>
                  <div className="grid gap-3">
                    <button
                      onClick={() => setPracticeMode('random')}
                      className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                        practiceMode === 'random'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="block">Random Practice</span>
                      <span className="block text-sm font-normal opacity-80">Practice new characters</span>
                    </button>
                    <button
                      onClick={() => setPracticeMode('review_mistakes')}
                      className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                        practiceMode === 'review_mistakes'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="block">Review Mistakes</span>
                      <span className="block text-sm font-normal opacity-80">Review mistakes</span>
                    </button>
                    <button
                      onClick={() => setPracticeMode('recommended')}
                      className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                        practiceMode === 'recommended'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="block">Recommended Practice</span>
                      <span className="block text-sm font-normal opacity-80">Adaptive quiz based on your performance</span>
                    </button>
                  </div>
                </div>
              )}

              <section className="mb-8 rounded-lg border border-purple-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Recommended for you
                  </h3>
                  <Link href="/dashboard" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                    View analytics
                  </Link>
                </div>
                {recommended.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Start a quiz to generate personalized review targets.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {recommended.slice(0, 10).map((item) => (
                      <span
                        key={item.itemId}
                        title={item.reasons.join(', ')}
                        className="inline-flex min-w-10 items-center justify-center rounded bg-purple-50 px-3 py-2 text-2xl text-gray-900 dark:bg-gray-700 dark:text-white"
                      >
                        {item.character}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <button
                onClick={startQuiz}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                Start Quiz (10 Questions)
              </button>
            </div>
          ) : showResult ? (
            /* Results Screen */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Quiz Complete!
              </h2>
              <div className="text-6xl font-bold text-purple-600 mb-6">
                {score} / {questions.length}
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {score === questions.length 
                  ? 'Perfect score! 🎉' 
                  : score >= questions.length * 0.7 
                  ? 'Great job! 👏' 
                  : 'Keep practicing! 💪'}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={startQuiz}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Change Mode
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Question */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {'kanji' in questions[currentQuestion]
                    ? questions[currentQuestion].questionType === 'kanji-to-meaning'
                      ? 'What is the meaning of this kanji?'
                      : questions[currentQuestion].questionType === 'meaning-to-kanji'
                      ? 'Which kanji means this?'
                      : 'What is the reading of this kanji?'
                    : questions[currentQuestion].questionType === 'char-to-romaji' 
                      ? 'What is the romaji for this character?' 
                      : 'What is the character for this romaji?'}
                </p>
                <div className="text-8xl font-bold text-gray-900 dark:text-white mb-2">
                  {questions[currentQuestion].question}
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === questions[currentQuestion].correctAnswer;
                  const showFeedback = selectedAnswer !== null;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-lg font-semibold text-xl transition-colors ${
                        showFeedback
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-purple-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {answerFeedback && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {answerFeedback}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
