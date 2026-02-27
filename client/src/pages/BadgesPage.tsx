import { useEffect, useState } from "react";
import BadgeGrid from "../components/BadgeGrid";
import { dataApi } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function BadgesPage() {
  const { token } = useAuth();
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    setAuthToken(token);
    dataApi.getPoints().then((res) => setBadges(res.data.badges || [])).catch(() => {});
  }, [token]);

  return <div className="pb-24 md:pb-4"><BadgeGrid badges={badges} /></div>;
}
