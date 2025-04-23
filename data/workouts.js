const getTrainingDayNumber = (date) => {
  const weekday = date.getDay(); // 0 = Sonntag
  const weekNum =
    Math.ceil(
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 1)) /
        86400000
    ) / 7;

  const trainingDayNumber = (weekNum % 2 === 0 ? [1, 2, 5, 6] : [3, 4, 5, 6])[
    weekday - 1
  ];
  return trainingDayNumber ?? 0;
};

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
