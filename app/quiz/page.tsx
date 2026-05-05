'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData, allKanaData } from '@/data/kana';
import { getAllKanji } from '@/data/kanji';
import { KanaPracticeMode, LearningMode, QuizAttempt, QuizQuestion, RecommendedLearningItem } from '@/types/kana';
import { KanjiQuizQuestion } from '@/types/kanji';
import { generateKanjiQuizQuestions, generateQuizQuestions } from '@/utils/quiz';
import { updateProgress } from '@/utils/progress';
import { getAttempts, saveAttempt } from '@/storage/attemptRepository';
import { getPracticeKana } from '@/services/adaptivePracticeService';
import { calculateLearnerStats } from '@/services/analyticsService';
import { detectConfusion } from '@/services/confusionService';
import { generateFeedback } from '@/services/feedbackService';
import { getRecommendedNext } from '@/lib/recommendations';
import { getUserData } from '@/lib/storage';
import AppNav from '@/components/AppNav';
import RecommendedSection from '@/components/RecommendedSection';

export default function QuizPage() {
  const [mode, setMode] = useState<LearningMode>('mixed');
  const [practiceMode, setPracticeMode] = useState<KanaPracticeMode>('recommended');
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

  const startQuiz = (
    selectedMode: LearningMode,
    selectedPracticeMode: KanaPracticeMode
  ) => {
    let newQuestions: QuizQuestion[] | KanjiQuizQuestion[];

    setMode(selectedMode);
    setPracticeMode(selectedPracticeMode);

    if (selectedMode === 'kanji') {
      const kanjiData = getAllKanji();
      const recommendedKanji = recommended
        .filter((item) => item.category === 'kanji')
        .map((item) => item.character);
      const practiceData =
        selectedPracticeMode === 'recommended' && recommendedKanji.length > 0
          ? kanjiData.filter((kanji) => recommendedKanji.includes(kanji.character))
          : kanjiData;

      newQuestions = generateKanjiQuizQuestions(practiceData, 10);
    } else {
      const data =
        selectedMode === 'hiragana'
          ? hiraganaData
          : selectedMode === 'katakana'
            ? katakanaData
            : allKanaData;
      const practiceData =
        selectedPracticeMode === 'random'
          ? data
          : getPracticeKana(selectedPracticeMode, 10, selectedMode);

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
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const question = questions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    const character = 'kanji' in question
      ? question.kanji
      : question.questionType === 'char-to-romaji'
        ? question.question
        : question.correctAnswer;

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
    }, 1200);
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

  const recommendedMode: LearningMode = recommended[0]?.category === 'kanji' ? 'kanji' : 'mixed';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Practice
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950 dark:text-white">
            Choose what to practice next
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Start new material, repair mistakes, or let the adaptive model select a focused session.
          </p>
        </div>

        {!quizStarted ? (
          <div className="space-y-6">
            <RecommendedSection compact />

            <div className="grid gap-4 md:grid-cols-3">
              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">New Practice</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Practice new kana prompts and add fresh evidence to your learner model.
                </p>
                <button
                  onClick={() => startQuiz('mixed', 'random')}
                  className="mt-4 w-full rounded-md bg-slate-900 px-4 py-3 font-semibold text-white outline-none hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Start New Practice
                </button>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Review Mistakes</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Focus on characters you missed before so the system can check recovery.
                </p>
                <button
                  onClick={() => startQuiz('mixed', 'review_mistakes')}
                  className="mt-4 w-full rounded-md border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Review Mistakes
                </button>
              </section>

              <section className="rounded-lg border-2 border-indigo-300 bg-indigo-50 p-6 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/40">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Recommended Practice</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  Use due reviews, low accuracy, and recent failures to select the next quiz.
                </p>
                <button
                  onClick={() => startQuiz(recommendedMode, 'recommended')}
                  className="mt-4 w-full rounded-md bg-indigo-700 px-4 py-3 font-semibold text-white outline-none hover:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Practice Recommendations
                </button>
              </section>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              For structured kanji browsing, use{' '}
              <Link href="/kanji" className="font-semibold text-indigo-700 hover:underline dark:text-indigo-300">
                Kanji by Grade
              </Link>
              .
            </div>
          </div>
        ) : showResult ? (
          <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Quiz Complete</h2>
            <div className="my-6 text-6xl font-bold text-indigo-700 dark:text-indigo-300">
              {score} / {questions.length}
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {score === questions.length
                ? 'Strong recall. The next session can introduce or space out items.'
                : score >= questions.length * 0.7
                  ? 'Good progress. Review the missed items before adding too much new material.'
                  : 'The learner model found weak spots. A recommended review is the best next step.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => startQuiz(mode, practiceMode)}
                className="flex-1 rounded-md bg-indigo-700 px-4 py-3 font-semibold text-white outline-none hover:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Practice Again
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                Choose Practice Type
              </button>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-indigo-700 transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8 text-center">
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {'kanji' in questions[currentQuestion]
                  ? questions[currentQuestion].questionType === 'kanji-to-meaning'
                    ? 'What is the meaning of this kanji?'
                    : questions[currentQuestion].questionType === 'meaning-to-kanji'
                      ? 'Which kanji matches this meaning?'
                      : 'What is the reading of this kanji?'
                  : questions[currentQuestion].questionType === 'char-to-romaji'
                    ? 'What is the romaji for this character?'
                    : 'Which character matches this romaji?'}
              </p>
              <div className="text-7xl font-bold text-slate-950 dark:text-white">
                {questions[currentQuestion].question}
              </div>
            </div>

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
                    className={`rounded-md p-5 text-lg font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      showFeedback
                        ? isCorrect
                          ? 'bg-green-600 text-white'
                          : isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                        : 'bg-slate-100 text-slate-950 hover:bg-indigo-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answerFeedback && (
              <div className="mt-6 rounded-md bg-slate-100 p-4 text-slate-900 dark:bg-slate-800 dark:text-white">
                {answerFeedback}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
