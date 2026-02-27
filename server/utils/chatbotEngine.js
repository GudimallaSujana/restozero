export function chatbotReply(message, context = {}) {
  const text = (message || "").toLowerCase();

  if (text.includes("cook") || text.includes("how much")) {
    return `Based on current weather and recent sales, prepare around ${context.predicted || 60} units per top-selling dish today.`;
  }

  if (text.includes("waste") || text.includes("why")) {
    return context.explanation || "Waste increased due to demand mismatch and weather impact.";
  }

  if (text.includes("donate")) {
    return "Your waste level is high. I recommend initiating a donation pickup with a nearby NGO.";
  }

  return "I can help with demand planning, waste explanation, and donation suggestions. Ask me about today's prep volume.";
}
