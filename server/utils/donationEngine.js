const ngoData = [
  { name: "FoodLink Foundation", city: "Vienna", contact: "+43 111-223" },
  { name: "Zero Hunger Network", city: "Salzburg", contact: "+43 555-987" },
  { name: "Community Meal Hub", city: "Graz", contact: "+43 444-776" }
];

export function getDonationSuggestion(waste, threshold = 15) {
  return {
    shouldDonate: waste > threshold,
    message: waste > threshold ? "Waste is above threshold. Donate leftovers now." : "Waste is within target.",
    ngos: waste > threshold ? ngoData : []
  };
}
