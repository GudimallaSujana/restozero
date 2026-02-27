import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AddDataPage from "./pages/AddDataPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import BadgesPage from "./pages/BadgesPage";
import DonationPage from "./pages/DonationPage";
import ChatbotPage from "./pages/ChatbotPage";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <div className="md:pl-72">
        <Navbar />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/add-data"
          element={
            <ProtectedLayout>
              <AddDataPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedLayout>
              <AnalyticsPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedLayout>
              <LeaderboardPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedLayout>
              <BadgesPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/donation"
          element={
            <ProtectedLayout>
              <DonationPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedLayout>
              <ChatbotPage />
            </ProtectedLayout>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
