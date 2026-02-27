import { useEffect, useState } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import Skeleton from "../components/Skeleton";
import { dataApi } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);
    dataApi
      .getLeaderboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return <div className="pb-24 md:pb-4">{loading ? <Skeleton className="h-64" /> : <LeaderboardTable data={data} />}</div>;
}
