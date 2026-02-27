import { useEffect, useState } from "react";
import Card from "../components/Card";
import Skeleton from "../components/Skeleton";
import { dataApi } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function DonationPage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);
    dataApi
      .getDonation()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-4 pb-24 md:pb-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <Card title="Leftover Food Summary">
        <p className="text-3xl font-bold">{data?.leftoverUnits || 0} units</p>
        <p className="text-sm text-slate-500">{data?.message || "Checking status..."}</p>
      </Card>
      <Card title="NGO Suggestions">
        <div className="space-y-2">
          {(data?.ngos || []).map((ngo: any) => (
            <div key={ngo.name} className="rounded-xl bg-white/50 p-3 dark:bg-white/5">
              <p className="font-semibold">{ngo.name}</p>
              <p className="text-sm text-slate-500">{ngo.city} • {ngo.contact}</p>
              <button className="mt-2 rounded-lg bg-emerald-500 px-3 py-1 text-xs text-white">Donate Now</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
