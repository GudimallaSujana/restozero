import Card from "./Card";

export default function BadgeGrid({ badges }: { badges: string[] }) {
  return (
    <Card title="Your Badges">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {badges.length ? (
          badges.map((badge) => (
            <div key={badge} className="rounded-xl bg-gradient-to-r from-amber-400/20 to-emerald-400/20 p-4 text-center">
              <p className="text-lg">🏅</p>
              <p className="font-semibold">{badge}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No badges yet.</p>
        )}
      </div>
    </Card>
  );
}
