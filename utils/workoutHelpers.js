import AsyncStorage from "@react-native-async-storage/async-storage";

const weekdayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const TRAINING_START_DATE = new Date(2024, 0, 1); // 1. Januar 2024

export async function getWorkoutForDate(date) {
  try {
    const planRaw = await AsyncStorage.getItem("splitPlan");
    const scheduleRaw = await AsyncStorage.getItem("activeSplit");

    if (!planRaw || !scheduleRaw) return null;

    const splitPlan = JSON.parse(planRaw);
    const parsed = JSON.parse(scheduleRaw);
    const schedule = parsed.schedule;
    const offset = parsed.offset ?? 0; // fallback zu 0, wenn undefined
    const matchingWorkouts = splitPlan.filter((w) => w.tag > 0);
    if (!matchingWorkouts.length) return null;

    const weekday = weekdayKeys[date.getDay()];
    if (!schedule[weekday]) return null; // ⛔️ Nur wenn Trainingstag

    // Zähle alle aktiven Trainingstage vom Startdatum bis zum Zieldatum
    let count = 0;
    const start = new Date(TRAINING_START_DATE);
    start.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    for (let d = new Date(start); d <= target; d.setDate(d.getDate() + 1)) {
      const key = weekdayKeys[d.getDay()];
      if (schedule[key]) {
        count++;
      }
    }

    if (count === 0) return null;

    const index = (count - 1 + offset) % matchingWorkouts.length;
    return matchingWorkouts[index];
  } catch (err) {
    console.error("Fehler beim Workout-Laden:", err);
    return null;
  }
}
