import Link from 'next/link';

const alignmentRows = [
  {
    labTheme: 'Smart Learning and Virtual TA',
    appFeature: 'Virtual TA feedback on the dashboard',
    evidence: 'The system translates learner traces into a next action, supporting autonomous study without a human instructor.',
  },
  {
    labTheme: 'Adaptive user interfaces',
    appFeature: 'Adaptive UI policy inspector',
    evidence: 'The dashboard exposes due, weak, and new item counts so interface adaptation can be inspected and critiqued.',
  },
  {
    labTheme: 'Educational data mining',
    appFeature: 'Local attempt and progress event model',
    evidence: 'Attempts, accuracy, response time, recent failures, and confusion pairs are collected as analyzable learning traces.',
  },
  {
    labTheme: 'Machine learning support models',
    appFeature: 'Rule-based recommender prepared for model comparison',
    evidence: 'The current transparent baseline can later be compared with learned ranking models or error-probability predictors.',
  },
  {
    labTheme: 'Algorithmic transparency',
    appFeature: 'Recommendation reasons and scoring signals',
    evidence: 'Learners and researchers can see why a character was selected instead of receiving unexplained personalization.',
  },
];

const demoScript = [
  'Open the dashboard and explain that the system is not only tracking progress, but modeling item-level learning state.',
  'Point to Virtual TA Feedback and describe it as a small autonomous learning support agent.',
  'Show Adaptive UI Policy and explain how recommendations are made transparent.',
  'Take a quiz, intentionally miss one item, then return to the dashboard to show that the recommendation changes.',
  'Open Learning Analytics to show educational data mining signals: weak items, recent mistakes, grade completion, and streak.',
];

export default function ResearchAlignmentPage() {
  return (
    <main className="min-h-screen bg-academic-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-academic-primary hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-academic-text">Research Alignment</h1>
          <Link href="/dashboard" className="text-academic-primary hover:underline">
            Dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-academic-text mb-3">
              Alignment with Professor Yutaka Watanobe&apos;s Lab
            </h2>
            <p className="text-academic-muted">
              This project frames Japanese character learning as a Smart Learning system: it collects learner traces, adapts practice, explains recommendations, and provides Virtual TA-style feedback. The same architecture can be discussed as an early research system for autonomous learning support, educational data mining, and adaptive user interfaces.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-3 bg-academic-section px-6 py-3 text-sm font-semibold text-academic-muted">
              <span>Lab Theme</span>
              <span>Implemented Feature</span>
              <span>Research Evidence</span>
            </div>
            {alignmentRows.map((row) => (
              <div key={row.labTheme} className="grid grid-cols-3 gap-4 border-t border-academic-border px-6 py-4 text-sm text-academic-muted">
                <span className="font-semibold text-academic-text">{row.labTheme}</span>
                <span>{row.appFeature}</span>
                <span>{row.evidence}</span>
              </div>
            ))}
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-academic-text mb-3">Possible Research Question</h2>
              <p className="text-academic-muted">
                Does transparent adaptive practice improve learner self-regulation and retention compared with random quiz selection in Japanese character learning?
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-academic-text mb-3">Evaluation Plan</h2>
              <p className="text-academic-muted">
                Compare random practice, hidden adaptive practice, and transparent adaptive practice using post-quiz accuracy, response time, review completion, and learner trust ratings.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-academic-text mb-4">Professor Demo Script</h2>
            <ol className="space-y-3 text-academic-muted">
              {demoScript.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="font-semibold text-academic-primary">{demoScript.indexOf(step) + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
