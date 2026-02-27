import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="gradient-bg min-h-screen px-6 py-16 text-slate-900 dark:text-slate-100">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-6xl">
        <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-5xl font-black text-transparent md:text-7xl">
          RestoZero
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-200">
          Zero Waste Kitchen Assistant using AI predictions, gamification, and sustainability analytics.
        </p>
        <div className="mt-8">
          <Link to="/auth" className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white">
            Launch Dashboard
          </Link>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            "AI demand prediction with weather and day factors",
            "Waste, loss and sustainability score analytics",
            "Gamified missions, badges and leaderboard"
          ].map((feature) => (
            <div key={feature} className="glass rounded-2xl p-4">
              {feature}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
