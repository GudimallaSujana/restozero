import { SunMoon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useDarkMode();

  return (
    <header className="sticky top-0 z-30 p-4 md:p-6">
      <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300">Welcome back</p>
          <p className="font-semibold">{user?.restaurantName || "Restaurant"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="rounded-xl bg-slate-200 p-2 dark:bg-slate-800"
            aria-label="toggle theme"
          >
            <SunMoon size={16} />
          </button>
          <button onClick={logout} className="rounded-xl bg-rose-500 px-3 py-2 text-sm text-white">
            <span className="hidden md:inline">Logout </span>
            <LogOut size={14} className="inline" />
          </button>
        </div>
      </div>
    </header>
  );
}
