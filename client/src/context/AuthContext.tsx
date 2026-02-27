import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type User = { name: string; restaurantName: string; location: string } | null;

type AuthContextType = {
  token: string;
  user: User;
  login: (token: string, user: NonNullable<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("rz_token") || "");
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem("rz_user");
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(
    () => ({
      token,
      user,
      login: (nextToken: string, nextUser: NonNullable<User>) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem("rz_token", nextToken);
        localStorage.setItem("rz_user", JSON.stringify(nextUser));
      },
      logout: () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("rz_token");
        localStorage.removeItem("rz_user");
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
