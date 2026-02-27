import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";
import { dataApi } from "../services/endpoints";
import { missions } from "../data/mock";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function DashboardPage() {
  const { token } = useAuth();
  const [prediction, setPrediction] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [points, setPoints] = useState<any>({ points: 0, streak: 0, badges: [] });
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    setAuthToken(token);
    Promise.all([dataApi.getPoints(), dataApi.getSales()])
      .then(([pointsRes, salesRes]) => {
        setPoints(pointsRes.data);
        setSales(salesRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const runPredict = async () => {
    try {
      setPredicting(true);
      const { data } = await dataApi.predict({ date: dayjs().toISOString() });
      setPrediction(data);

      await dataApi.updatePoints({ waste: data?.totals?.totalWaste || 0, threshold: 20 });
      const updated = await dataApi.getPoints();
      setPoints(updated.data);
      const salesRes = await dataApi.getSales();
      setSales(salesRes.data || []);
      toast.success("Prediction generated");
    } catch {
      toast.error("Could not run prediction");
    } finally {
      setPredicting(false);
    }
  };

  const totalWaste = prediction?.totals?.totalWaste || 0;
  const totalLoss = prediction?.totals?.totalLoss || 0;
  const topInsight = useMemo(
    () => [...(prediction?.predictions || [])].sort((a: any, b: any) => b.waste - a.waste)?.[0]?.explanation || "",
    [prediction]
  );

  if (loading) {
    return (
      <div className="space-y-4 pb-24 md:pb-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      {!sales.length ? (
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            No data available. Add sales data to see predictions.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Weather + Event"
          value={`${prediction?.weather || "clear"}${prediction?.isHoliday ? " + Holiday" : ""}`}
          hint={prediction?.holidayName || "Normal day"}
        />
        <StatCard title="Waste Risk" value={totalWaste} hint="prepared - predicted" color="text-amber-500" />
        <StatCard title="Profit Loss" value={`€${Number(totalLoss).toFixed(2)}`} hint="waste x cost" color="text-rose-500" />
        <StatCard title="Sustainability" value={`${Math.max(0, 100 - Number(totalWaste))}%`} hint="dynamic eco score" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Demand Prediction per Dish" className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {(prediction?.predictions || []).map((row: any) => (
              <div key={row.item} className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
                <p className="font-semibold">{row.item}</p>
                <p className="text-sm text-slate-500">
                  Predicted: {row.predicted} | Waste: {row.waste} | Loss: €{Number(row.loss).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={runPredict}
            disabled={predicting}
            className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {predicting ? "Predicting..." : "Generate AI Prediction"}
          </button>
        </Card>

        <Card title="Points & Streak">
          <p className="text-4xl font-bold text-emerald-500">{points.points}</p>
          <p className="mt-1">Streak: {points.streak} days</p>
          <p className="text-sm text-slate-500">Badges: {points.badges?.join(", ") || "None"}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="AI Insights (Explain My Waste)" className="lg:col-span-2">
          <p>{topInsight || "Run prediction to get AI explanation."}</p>
        </Card>
        <Card title="Daily Mission">
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {missions.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Alerts">
        <p className="text-sm text-amber-500">
          {totalWaste > 20
            ? "High waste detected. Donation recommendation triggered."
            : "All systems healthy. Keep reducing prep mismatch."}
        </p>
      </Card>
    </div>
  );
}
