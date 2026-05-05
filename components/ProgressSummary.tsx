export default function ProgressSummary({
  totalLearned,
  accuracy,
  streak,
  attempts,
}: {
  totalLearned: number;
  accuracy: number;
  streak: number;
  attempts: number;
}) {
  const stats = [
    { label: 'Total learned', value: totalLearned.toString() },
    { label: 'Accuracy', value: `${accuracy}%` },
    { label: 'Study streak', value: `${streak} days` },
    { label: 'Attempts', value: attempts.toString() },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="academic-card p-5"
        >
          <p className="text-sm text-academic-muted">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-academic-text">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
