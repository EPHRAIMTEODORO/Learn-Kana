import Link from 'next/link';
import { hiraganaData, katakanaData } from '@/data/kana';
import { kanjiGradeSections } from '@/data/kanji';
import AppNav from '@/components/AppNav';

export default function CurriculumPage() {
  const totalKanji = kanjiGradeSections.reduce((sum, section) => sum + section.kanji.length, 0);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Curriculum
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950 dark:text-white">
            What you will learn
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            A transparent path from kana recognition to grade-organized kanji review.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">What the System Teaches</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Learn Kana covers the two basic Japanese phonetic scripts and a grade-organized kanji curriculum. The learner model treats each kana or kanji as an item with its own accuracy, review interval, and recent error history.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kana to Kanji Progression</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Hiragana</h3>
                <p className="text-gray-600 dark:text-gray-300">{hiraganaData.length} basic characters for native Japanese words and grammatical forms.</p>
              </div>
              <div className="rounded border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Katakana</h3>
                <p className="text-gray-600 dark:text-gray-300">{katakanaData.length} basic characters for loanwords, names, emphasis, and sound words.</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Kanji Organization</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kanji are grouped by the Japanese school-grade sequence used for Kyōiku Kanji and later Jōyō Kanji study. This makes the curriculum transparent and lets analytics report completion by grade level.
            </p>
            <div className="space-y-3">
              {kanjiGradeSections.map((section) => (
                <div key={section.grade} className="flex items-center justify-between border-b border-gray-200 pb-2 text-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <span>{section.gradeName} ({section.gradeNameJapanese})</span>
                  <span>{section.kanji.length} kanji</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Current dataset size: {totalKanji} kanji loaded in the app.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">How the System Adapts</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Each practice result updates an item-level learner model. The system prioritizes due reviews, low accuracy items, and recent mistakes, then introduces new items when review demand is low.
            </p>
            <div className="mt-5">
              <Link
                href="/quiz"
                className="inline-flex rounded-md bg-indigo-700 px-4 py-3 font-semibold text-white outline-none hover:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Start Adaptive Practice
              </Link>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Dataset Notes</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The kanji dataset is stored locally in the project and includes meanings, readings, examples, grade labels, stroke counts, and optional JLPT levels. The source note in the data file identifies kanjiapi.dev as the generation source; grade counts follow the local dataset and may differ slightly from official lists as Unicode variants and later revisions are normalized.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
