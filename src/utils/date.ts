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

export { subtractDay, isSameDay, isSunday };
