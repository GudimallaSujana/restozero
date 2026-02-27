export function getWeatherFactor(weather = "clear") {
  const map = {
    rain: 0.8,
    cloudy: 1,
    clear: 1.2
  };
  return map[weather.toLowerCase()] || 1;
}

export function getDayFactor(dayName = "Monday") {
  const isWeekend = ["Saturday", "Sunday"].includes(dayName);
  return isWeekend ? 1.2 : 1;
}

export function predictDemand(last7DaysAvg, weather, dayName, eventBoost = 1) {
  const prediction = last7DaysAvg * getWeatherFactor(weather) * getDayFactor(dayName) * eventBoost;
  return Math.max(0, Math.round(prediction));
}
