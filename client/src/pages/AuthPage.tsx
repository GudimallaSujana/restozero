import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../services/endpoints";
import { setAuthToken } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "demo@restozero.com",
    password: "password123",
    restaurantName: "RestoZero Bistro",
    location: "Vienna"
  });
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await authApi.login({ email: form.email, password: form.password });
        setAuthToken(data.token);
        login(data.token, data.user);
        toast.success("Logged in successfully");
        nav("/dashboard");
      } else {
        await authApi.register(form);
        toast.success("Registered. Please login.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-6 text-black">
        <h2 className="mb-4 text-2xl font-bold text-black">{isLogin ? "Login" : "Create account"}</h2>
        {!isLogin && (
          <input className="mb-3 w-full rounded-xl border border-white/20 bg-transparent p-2 text-black placeholder:text-black/60" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="mb-3 w-full rounded-xl border border-white/20 bg-transparent p-2 text-black placeholder:text-black/60" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="mb-3 w-full rounded-xl border border-white/20 bg-transparent p-2 text-black placeholder:text-black/60" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {!isLogin && (
          <>
            <input className="mb-3 w-full rounded-xl border border-white/20 bg-transparent p-2 text-black placeholder:text-black/60" placeholder="Restaurant Name" onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} />
            <input className="mb-3 w-full rounded-xl border border-white/20 bg-transparent p-2 text-black placeholder:text-black/60" placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </>
        )}
        <button className="w-full rounded-xl bg-emerald-500 p-2 font-semibold text-white">{isLogin ? "Sign in" : "Register"}</button>
        <button type="button" className="mt-3 text-sm text-emerald-500" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
