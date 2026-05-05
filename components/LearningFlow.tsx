const steps = [
  {
    label: 'Learn',
    marker: '01',
    description: 'Introduce kana and kanji through structured curriculum items.',
  },
  {
    label: 'Practice',
    marker: '02',
    description: 'Answer focused prompts so the learner model can estimate recall.',
  },
  {
    label: 'Review',
    marker: '03',
    description: 'Return to due and weak items before they fade from memory.',
  },
  {
    label: 'Improve',
    marker: '04',
    description: 'Use analytics and recommendations to guide the next session.',
  },
];

export default function LearningFlow() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
          Learning flow
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Learn, practice, review, improve
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
              {step.marker}
            </div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{step.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
