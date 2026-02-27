export function getWasteBand(waste) {
  if (waste <= 10) return "low";
  if (waste <= 25) return "medium";
  return "high";
}

export function pointsFromWaste(waste) {
  const band = getWasteBand(waste);
  if (band === "low") return 50;
  if (band === "medium") return 20;
  return -10;
}

export function calculateBadges(streak, existingBadges = []) {
  const badges = new Set(existingBadges);
  if (streak >= 3) badges.add("Starter");
  if (streak >= 7) badges.add("Eco Champion");
  return Array.from(badges);
}
