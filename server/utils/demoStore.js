import dayjs from "dayjs";

const today = new Date();

function seededSales() {
  const items = [
    { item: "Pasta", sold: 58, prepared: 72, cost: 3.2 },
    { item: "Salad", sold: 41, prepared: 52, cost: 2.4 },
    { item: "Soup", sold: 49, prepared: 61, cost: 2.1 },
    { item: "Burger", sold: 64, prepared: 76, cost: 4.0 }
  ];

  return Array.from({ length: 14 }).flatMap((_, i) =>
    items.map((entry) => ({
      id: `${entry.item}-${i}`,
      userId: "demo-user",
      date: dayjs(today).subtract(i, "day").toDate(),
      ...entry
    }))
  );
}

export const demoStore = {
  user: {
    id: "demo-user",
    name: "Demo Owner",
    email: "demo@restozero.com",
    password: "password123",
    restaurantName: "RestoZero Bistro",
    location: "Vienna"
  },
  sales: seededSales(),
  predictions: [],
  gamification: {
    userId: "demo-user",
    points: 180,
    streak: 4,
    badges: ["Starter"]
  }
};
