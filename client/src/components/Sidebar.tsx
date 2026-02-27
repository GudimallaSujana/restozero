import { NavLink } from "react-router-dom";
import { BarChart3, Bot, Gift, Home, Medal, PlusSquare, Trophy } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/add-data", label: "Add Data", icon: PlusSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/badges", label: "Badges", icon: Medal },
  { to: "/donation", label: "Donation", icon: Gift },
  { to: "/chatbot", label: "AI Chat", icon: Bot }
];

export default function Sidebar() {
  return (
    <aside className="glass fixed bottom-0 left-0 right-0 z-40 m-2 rounded-2xl p-2 md:bottom-auto md:right-auto md:top-4 md:m-4 md:h-[calc(100vh-2rem)] md:w-64">
      <h1 className="mb-5 hidden bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent md:block">
        RestoZero
      </h1>
      <nav className="grid grid-cols-3 gap-1 md:grid-cols-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs md:justify-start md:text-sm ${
                isActive ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-white/50 dark:text-slate-200"
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
