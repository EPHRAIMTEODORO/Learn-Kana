import Link from 'next/link';

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
            Master Japanese Hiragana and Katakana
          </p>
          <div className="flex justify-center gap-4 text-6xl mb-8">
            <span className="animate-pulse">あ</span>
            <span className="animate-pulse delay-100">ア</span>
            <span className="animate-pulse delay-200">か</span>
            <span className="animate-pulse delay-300">カ</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

          {/* Flashcards */}
          <Link href="/learn" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Flashcards
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Practice with interactive flashcards. Toggle between Hiragana, Katakana, or mixed mode.
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
                Test your knowledge with multiple-choice quizzes. 10 questions per session.
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
                Track your learning journey with detailed statistics for each character.
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
