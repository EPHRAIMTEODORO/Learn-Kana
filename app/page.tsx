import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn Kana | Adaptive Japanese Practice',
  description: 'Practice Japanese kana and kanji with spaced repetition, recommendations, and learner analytics.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Learn Kana
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Adaptive practice for kana and kanji
          </p>
          <div className="flex justify-center gap-4 text-6xl mb-8">
            <span className="animate-pulse">あ</span>
            <span className="animate-pulse delay-100">ア</span>
            <span className="animate-pulse delay-200">か</span>
            <span className="animate-pulse delay-300">カ</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Kana Chart */}
          <Link href="/chart" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Kana Chart
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                View all Hiragana and Katakana characters in a traditional chart layout.
              </p>
            </div>
          </Link>

          {/* Kanji Learning */}
          <Link href="/kanji" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">漢</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Kanji
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Learn 2,140 Jōyō Kanji organized by Japanese school grades.
              </p>
            </div>
          </Link>

          {/* Flashcards */}
          <Link href="/learn" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Flashcards
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Practice new characters with interactive flashcards and local progress tracking.
              </p>
            </div>
          </Link>

          {/* Quiz */}
          <Link href="/quiz" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Quiz Mode
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Adaptive quiz based on your performance, review schedule, and recent mistakes.
              </p>
            </div>
          </Link>

          {/* Progress */}
          <Link href="/progress" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track accuracy, weak characters, recent mistakes, grade completion, and study streaks.
              </p>
            </div>
          </Link>

          {/* Dashboard */}
          <Link href="/dashboard" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">📈</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Learner Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Review adaptive analytics, weak kana, confusion pairs, and recommended practice.
              </p>
            </div>
          </Link>

          {/* Curriculum */}
          <Link href="/curriculum" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">文</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Curriculum
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                See what is taught, how kanji are grouped, and what assumptions shape the dataset.
              </p>
            </div>
          </Link>

          {/* Settings */}
          <Link href="/settings" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage local learning data used by the adaptive model.
              </p>
            </div>
          </Link>

          {/* Research Alignment */}
          <Link href="/research-alignment" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">AI</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Research Alignment
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Map the system to Smart Learning, Virtual TA feedback, adaptive UI, and educational data mining.
              </p>
            </div>
          </Link>
        </div>

        {/* Getting Started */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <Link
            href="/learn"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </main>
  );
}
