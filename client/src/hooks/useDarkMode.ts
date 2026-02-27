import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem("rz_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("rz_theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, setDark };
}
