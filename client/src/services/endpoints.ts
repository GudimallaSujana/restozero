import api from "./api";

export const authApi = {
  register: (payload: unknown) => api.post("/register", payload),
  login: (payload: unknown) => api.post("/login", payload)
};

export const dataApi = {
  addSale: (payload: unknown) => api.post("/sales", payload),
  getSales: () => api.get("/sales"),
  predict: (payload: unknown) => api.post("/predict", payload),
  getPoints: () => api.get("/points"),
  updatePoints: (payload: unknown) => api.post("/updatePoints", payload),
  getAnalytics: () => api.get("/analytics"),
  getLeaderboard: () => api.get("/leaderboard"),
  chat: (payload: unknown) => api.post("/chat", payload),
  getDonation: () => api.get("/donation")
};
