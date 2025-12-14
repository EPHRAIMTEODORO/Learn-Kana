'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData, allKanaData } from '@/data/kana';
import { QuizQuestion, LearningMode } from '@/types/kana';
import { generateQuizQuestions } from '@/utils/quiz';
import { updateProgress } from '@/utils/progress';

export default function QuizPage() {
  const [mode, setMode] = useState<LearningMode>('hiragana');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    const data = mode === 'hiragana' 
      ? hiraganaData 
      : mode === 'katakana' 
      ? katakanaData 
      : allKanaData;
    
    const newQuestions = generateQuizQuestions(data, 10);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
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
    const character = question.questionType === 'char-to-romaji' 
      ? question.question 
      : question.correctAnswer;
    
    updateProgress(character, isCorrect);
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
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
                  Hiragana Only
                </button>
                <button
                  onClick={() => setMode('katakana')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    mode === 'katakana'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Katakana Only
                </button>
                <button
                  onClick={() => setMode('mixed')}
                  className={`px-6 py-4 rounded-lg font-semibold transition-colors ${
                    mode === 'mixed'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Mixed (Hiragana & Katakana)
                </button>
              </div>

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
                  {questions[currentQuestion].questionType === 'char-to-romaji' 
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
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
