export default function Skeleton({ className = "h-24" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/70 ${className}`} />;
}
