import Link from 'next/link';
import type { Metadata } from 'next';
import AppNav from '@/components/AppNav';
import LearningFlow from '@/components/LearningFlow';
import RecommendedSection from '@/components/RecommendedSection';

export const metadata: Metadata = {
  title: 'Learn Kana | Adaptive Japanese Practice',
  description: 'Practice Japanese kana and kanji with spaced repetition, recommendations, and learner analytics.',
};

const actionCards = [
  {
    title: 'Start New Practice',
    description: 'Begin with new kana and kanji items from the curriculum.',
    href: '/learn',
    cta: 'Start learning',
  },
  {
    title: 'Review Mistakes',
    description: 'Focus on characters that were recently missed or answered slowly.',
    href: '/quiz',
    cta: 'Review mistakes',
  },
  {
    title: 'Recommended for You',
    description: 'Let the adaptive model choose what should come next.',
    href: '/quiz',
    cta: 'Practice recommendations',
    highlighted: true,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppNav />

      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              Adaptive Japanese learning
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 dark:text-white md:text-6xl">
              Learn Japanese with Adaptive Practice
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
              Practice kana and kanji with personalized recommendations based on your progress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/learn"
                className="rounded-md bg-indigo-700 px-5 py-3 text-center font-semibold text-white outline-none transition-colors hover:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Start Learning
              </Link>
              <Link
                href="/curriculum"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-900 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                View Curriculum
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Current learner model
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {['Accuracy', 'Review timing', 'Weak areas', 'New items'].map((signal) => (
                <div key={signal} className="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="mb-3 h-2 rounded-full bg-indigo-200 dark:bg-indigo-900" />
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{signal}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The interface changes practice suggestions as it observes correct answers, mistakes, and spaced-repetition due dates.
            </p>
          </div>
        </div>
      </section>

      <LearningFlow />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <RecommendedSection />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            What should I do next?
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Choose a guided practice path
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {actionCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`rounded-lg border p-6 shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                card.highlighted
                  ? 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:hover:bg-indigo-950'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
              }`}
            >
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {card.description}
              </p>
              <span className="mt-5 inline-flex font-semibold text-indigo-700 dark:text-indigo-300">
                {card.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
