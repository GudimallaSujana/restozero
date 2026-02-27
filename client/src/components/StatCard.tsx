import Card from "./Card";

export default function StatCard({
  title,
  value,
  hint,
  color = "text-emerald-500"
}: {
  title: string;
  value: string | number;
  hint: string;
  color?: string;
}) {
  return (
    <Card title={title}>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{hint}</p>
    </Card>
  );
}
