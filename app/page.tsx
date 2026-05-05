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
    <main className="min-h-screen bg-academic-background">
      <AppNav />

      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-academic-primary">
              Adaptive Japanese learning
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-academic-text md:text-6xl">
              Learn Japanese with Adaptive Practice
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-academic-muted">
              Practice kana and kanji with personalized recommendations based on your progress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/learn"
                className="rounded-md bg-academic-primary px-5 py-3 text-center font-semibold text-white outline-none transition-colors hover:bg-academic-primaryDark focus-visible:ring-2 focus-visible:ring-academic-primary focus-visible:ring-offset-2"
              >
                Start Learning
              </Link>
              <Link
                href="/curriculum"
                className="rounded-md border border-academic-border bg-white px-5 py-3 text-center font-semibold text-academic-text outline-none transition-colors hover:bg-academic-section focus-visible:ring-2 focus-visible:ring-academic-primary focus-visible:ring-offset-2"
              >
                View Curriculum
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-academic-border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-academic-muted">
              Current learner model
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {['Accuracy', 'Review timing', 'Weak areas', 'New items'].map((signal) => (
                <div key={signal} className="rounded-md bg-academic-background p-4">
                  <div className="mb-3 h-2 rounded-full bg-[#C8D0F0]" />
                  <p className="text-sm font-medium text-academic-text">{signal}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-academic-muted">
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
          <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
            What should I do next?
          </p>
          <h2 className="mt-2 text-3xl font-bold text-academic-text">
            Choose a guided practice path
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {actionCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`rounded-lg border p-6 shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-academic-primary ${
                card.highlighted
                  ? 'border-[#C8D0F0] bg-[#F0F2FC] hover:bg-[#E8EAF6]'
                  : 'border-academic-border bg-white hover:bg-academic-background'
              }`}
            >
              <h3 className="text-xl font-bold text-academic-text">{card.title}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-academic-muted">
                {card.description}
              </p>
              <span className="mt-5 inline-flex font-semibold text-academic-primary">
                {card.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
