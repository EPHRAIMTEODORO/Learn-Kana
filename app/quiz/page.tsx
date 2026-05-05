'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hiraganaData, katakanaData, allKanaData } from '@/data/kana';
import { getKanjiByGrade, kanjiGradeSections } from '@/data/kanji';
import { KanaPracticeMode, LearningMode, QuizAttempt, QuizQuestion, RecommendedLearningItem } from '@/types/kana';
import { KanjiGrade, KanjiQuizQuestion } from '@/types/kanji';
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
  const [kanjiGrade, setKanjiGrade] = useState<KanjiGrade>('grade1');

  const loadRecommendations = () => {
    setRecommended(getRecommendedNext(getUserData(), { limit: 10 }));
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const startQuiz = (
    selectedMode: LearningMode,
    selectedPracticeMode: KanaPracticeMode,
    selectedKanjiGrade: KanjiGrade = kanjiGrade
  ) => {
    let newQuestions: QuizQuestion[] | KanjiQuizQuestion[];

    setMode(selectedMode);
    setPracticeMode(selectedPracticeMode);
    setKanjiGrade(selectedKanjiGrade);

    if (selectedMode === 'kanji') {
      const kanjiData = getKanjiByGrade(selectedKanjiGrade);
      const recommendedKanji = getRecommendedNext(getUserData(), {
        category: 'kanji',
        grade: selectedKanjiGrade,
        limit: 10,
      })
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
  const selectedGradeLabel =
    kanjiGradeSections.find((section) => section.grade === kanjiGrade)?.gradeName ?? 'Grade 1';

  return (
    <main className="min-h-screen bg-academic-background">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
            Practice
          </p>
          <h1 className="mt-2 text-4xl font-bold text-academic-text">
            Choose what to practice next
          </h1>
          <p className="mt-3 max-w-2xl text-academic-muted">
            Start new material, repair mistakes, or let the adaptive model select a focused session.
          </p>
        </div>

        {!quizStarted ? (
          <div className="space-y-6">
            <RecommendedSection compact />

            <section className="rounded-lg border border-academic-border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-academic-text">Kanji quiz by grade</h2>
                  <p className="mt-2 text-sm text-academic-muted">
                    Choose a grade before starting kanji practice. Adaptive kanji review uses this same grade filter.
                  </p>
                </div>
                <label className="flex flex-col gap-2 text-sm font-medium text-academic-muted">
                  Kanji grade
                  <select
                    value={kanjiGrade}
                    onChange={(event) => setKanjiGrade(event.target.value as KanjiGrade)}
                    className="min-w-56 rounded-md border border-academic-border bg-white px-3 py-2 text-academic-text outline-none focus-visible:ring-2 focus-visible:ring-academic-primary"
                  >
                    {kanjiGradeSections.map((section) => (
                      <option key={section.grade} value={section.grade}>
                        {section.gradeName} · {section.kanji.length} kanji
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5">
                <RecommendedSection
                  title={`${selectedGradeLabel} Kanji Recommendations`}
                  description="Due, weak, and new kanji are selected only from this grade group."
                  category="kanji"
                  grade={kanjiGrade}
                  limit={4}
                  compact
                />
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
              <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-academic-text">New Practice</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-academic-muted">
                  Practice new kana or kanji prompts and add fresh evidence to your learner model.
                </p>
                <button
                  onClick={() => startQuiz('mixed', 'random')}
                  className="mt-4 w-full rounded-md bg-academic-primary px-4 py-3 font-semibold text-white outline-none hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  Practice Kana
                </button>
                <button
                  onClick={() => startQuiz('kanji', 'random', kanjiGrade)}
                  className="mt-3 w-full rounded-md border border-academic-border bg-white px-4 py-3 font-semibold text-academic-text outline-none hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  Practice {selectedGradeLabel} Kanji
                </button>
              </section>

              <section className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-academic-text">Review Mistakes</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-academic-muted">
                  Focus on characters you missed before so the system can check recovery.
                </p>
                <button
                  onClick={() => startQuiz('mixed', 'review_mistakes')}
                  className="mt-4 w-full rounded-md border border-academic-border bg-white px-4 py-3 font-semibold text-academic-text outline-none hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  Review Kana Mistakes
                </button>
                <button
                  onClick={() => startQuiz('kanji', 'recommended', kanjiGrade)}
                  className="mt-3 w-full rounded-md border border-academic-border bg-white px-4 py-3 font-semibold text-academic-text outline-none hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  Review {selectedGradeLabel} Kanji
                </button>
              </section>

              <section className="rounded-lg border-2 border-[#C8D0F0] bg-[#F0F2FC] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-academic-text">Recommended Practice</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-academic-muted">
                  Use due reviews, low accuracy, and recent failures to select the next quiz.
                </p>
                <button
                  onClick={() =>
                    recommendedMode === 'kanji'
                      ? startQuiz('kanji', 'recommended', kanjiGrade)
                      : startQuiz('mixed', 'recommended')
                  }
                  className="mt-4 w-full rounded-md bg-academic-primary px-4 py-3 font-semibold text-white outline-none hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  Practice Recommendations
                </button>
                <button
                  onClick={() => startQuiz('kanji', 'recommended', kanjiGrade)}
                  className="mt-3 w-full rounded-md border border-[#C8D0F0] bg-white px-4 py-3 font-semibold text-academic-primary outline-none hover:bg-[#E8EAF6] focus-visible:ring-2 focus-visible:ring-academic-primary"
                >
                  Recommended {selectedGradeLabel} Kanji
                </button>
              </section>
            </div>

            <div className="rounded-lg border border-academic-border bg-white p-4 text-sm text-academic-muted">
              For structured kanji browsing, use{' '}
              <Link href="/kanji" className="font-semibold text-academic-primary hover:underline">
                Kanji by Grade
              </Link>
              .
            </div>
          </div>
        ) : showResult ? (
          <section className="mx-auto max-w-2xl rounded-lg border border-academic-border bg-white p-8 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-academic-text">Quiz Complete</h2>
            <div className="my-6 text-6xl font-bold text-academic-primary">
              {score} / {questions.length}
            </div>
            <p className="text-lg text-academic-muted">
              {score === questions.length
                ? 'Strong recall. The next session can introduce or space out items.'
                : score >= questions.length * 0.7
                  ? 'Good progress. Review the missed items before adding too much new material.'
                  : 'The learner model found weak spots. A recommended review is the best next step.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => startQuiz(mode, practiceMode)}
                className="flex-1 rounded-md bg-academic-primary px-4 py-3 font-semibold text-white outline-none hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary"
              >
                Practice Again
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 rounded-md border border-academic-border bg-white px-4 py-3 font-semibold text-academic-text outline-none hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary"
              >
                Choose Practice Type
              </button>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-2xl rounded-lg border border-academic-border bg-white p-8 shadow-sm">
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-academic-muted">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-academic-section">
                <div
                  className="h-2 rounded-full bg-academic-primary transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8 text-center">
              <p className="mb-4 text-academic-muted">
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
              <div className="text-7xl font-bold text-academic-text">
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
                    className={`rounded-md p-5 text-lg font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-academic-primary ${
                      showFeedback
                        ? isCorrect
                          ? 'bg-[#4F7D5A] text-white'
                          : isSelected
                            ? 'bg-[#B85C5C] text-white'
                            : 'bg-academic-section text-academic-muted'
                        : 'bg-academic-section text-academic-text hover:bg-[#F0F2FC]'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answerFeedback && (
              <div className="mt-6 rounded-md bg-academic-section p-4 text-academic-text">
                {answerFeedback}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
