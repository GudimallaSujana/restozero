import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";
import { dataApi } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any>({ analytics: [], sustainabilityScore: 0, message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);
    dataApi
      .getAnalytics()
      .then((res) => setAnalytics(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-4 pb-24 md:pb-4">
        <Skeleton className="h-28" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[320px]" />
          <Skeleton className="h-[320px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      {!analytics.analytics.length ? (
        <div className="glass rounded-2xl p-4 text-sm text-slate-500 dark:text-slate-300">
          {analytics.message || "No data available. Add sales data to see predictions."}
        </div>
      ) : null}
      <StatCard title="Sustainability Score" value={`${analytics.sustainabilityScore}%`} hint="sold/prepared efficiency" />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Waste Trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.analytics}>
              <defs>
                <linearGradient id="waste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" /><YAxis /><Tooltip />
              <Area dataKey="totalWaste" stroke="#10b981" fill="url(#waste)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Profit Loss Trend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.analytics}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" /><YAxis /><Tooltip />
              <Bar dataKey="loss" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
