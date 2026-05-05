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
        <p className="text-sm font-semibold uppercase tracking-wide text-academic-primary">
          Learning flow
        </p>
        <h2 className="mt-2 text-3xl font-bold text-academic-text">
          Learn, practice, review, improve
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.label}
            className="academic-card p-5"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EAF6] text-sm font-bold text-academic-primary">
              {step.marker}
            </div>
            <h3 className="text-lg font-semibold text-academic-text">{step.label}</h3>
            <p className="mt-2 text-sm leading-6 text-academic-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
