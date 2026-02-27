export function buildWasteExplanation({ weather, dayName, isHoliday, waste }) {
  const reasons = [];

  if ((weather || "").toLowerCase() === "rain") {
    reasons.push("Waste increased due to rain reducing customer footfall.");
  }
  if (isHoliday) {
    reasons.push("Demand increased due to festival.");
  }
  if (["Saturday", "Sunday"].includes(dayName)) {
    reasons.push("Weekend traffic increased demand.");
  }
  if (waste > 20) {
    reasons.push("Over-preparation caused excess waste.");
  }

  if (!reasons.length) reasons.push("Demand remained stable with no major external factors.");

  return reasons.join(" ");
}
