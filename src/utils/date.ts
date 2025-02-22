function isSameDay(dateString: Date, dateCompareString: Date): boolean {
  const date = new Date(dateString);
  const dateToCompare = new Date(dateCompareString);

  return (
    date.getUTCFullYear() === dateToCompare.getUTCFullYear() &&
    date.getUTCMonth() === dateToCompare.getUTCMonth() &&
    date.getUTCDate() === dateToCompare.getUTCDate()
  );
}

function isSunday(date: Date): boolean {
  return date.getUTCDay() === 0;
}

function subtractDay(date: Date, daysToSubtract: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - daysToSubtract);
  return newDate;
}

function calculateDailyStreak(postDates: Date[]) {
  let dateToCompare = new Date();
  let dailyStreak = 0;
  postDates
    .sort((a, b) => b.getTime() - a.getTime())
    .forEach((postReadDate, index) => {
      if (
        isSunday(dateToCompare) ||
        (isSameDay(postReadDate, subtractDay(dateToCompare, 1)) && index === 0)
      ) {
        dateToCompare = subtractDay(dateToCompare, 1);
      }
      if (isSameDay(postReadDate, dateToCompare)) {
        dailyStreak += 1;
        dateToCompare = subtractDay(postReadDate, 1);
      }
    });

  return dailyStreak;
}

export { subtractDay, isSameDay, isSunday, calculateDailyStreak };
