export function getWorkoutForDate(date) {
  const weekday = date.getDay();
  const isEvenWeek = getWeekNumber(date) % 2 === 0;

  const plan = {
    2: isEvenWeek ? "Upper C" : "Upper A",
    3: isEvenWeek ? "Lower C" : "Lower A",
    5: isEvenWeek ? "Upper A" : "Upper B",
    6: isEvenWeek ? "Lower A" : "Lower B",
  };

  const name = plan[weekday];
  if (!name) return null;

  const workouts = {
    "Upper A": [
      "seated_incline_chest_press",
      "seated_pulldown",
      "seated_dip_machine",
      "unilateral_preacher_curl",
      "ez_bar_reverse_curl",
      "seated_lateral_raise",
    ],
    "Upper B": ["schraegbank", "latzug"],
    "Upper C": ["ohp", "kh_rudern"],
    "Lower A": ["kniebeuge", "beinbeuger"],
    "Lower B": ["beinpresse", "wadenheben"],
    "Lower C": ["frontkniebeuge", "hip_thrust"],
  };

  return {
    name,
    exercises: workouts[name],
  };
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
