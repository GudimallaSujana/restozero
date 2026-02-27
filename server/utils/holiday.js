import axios from "axios";
import dayjs from "dayjs";

const HOLIDAY_API = "https://date.nager.at/api/v3/PublicHolidays/2026/IN";

export async function getHolidayInfo(date) {
  try {
    const { data } = await axios.get(HOLIDAY_API);
    const targetDate = dayjs(date).format("YYYY-MM-DD");
    const holiday = data.find((item) => item.date === targetDate);

    return {
      isHoliday: Boolean(holiday),
      name: holiday?.localName || holiday?.name || null
    };
  } catch (_error) {
    return { isHoliday: false, name: null };
  }
}
