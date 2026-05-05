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
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
