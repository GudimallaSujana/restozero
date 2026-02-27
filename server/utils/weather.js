import axios from "axios";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current_weather=true";

export function mapWeatherCodeToCondition(code) {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "cloudy";
  if (code >= 60) return "rain";
  return "cloudy";
}

export async function getCurrentWeather() {
  try {
    const { data } = await axios.get(OPEN_METEO_URL);
    const current = data?.current_weather || {};
    const weathercode = Number(current.weathercode ?? 0);

    return {
      temperature: Number(current.temperature ?? 0),
      weathercode,
      condition: mapWeatherCodeToCondition(weathercode)
    };
  } catch (_error) {
    return {
      temperature: 0,
      weathercode: 0,
      condition: "clear"
    };
  }
}
