import dayjs from "dayjs";

export const CALENDAR_VIEWS = {
  MONTH: "MONTH",
  WEEK: "WEEK",
};

export function getCurrentWeekOfMonth() {
  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const todayDate = today.date();
  const startOfMonthDayOfWeek = startOfMonth.day();

  // Calculate the offset for days from the previous month in the first week
  const previousMonthDaysInFirstWeek = (startOfMonthDayOfWeek + 6) % 7;

  // Calculate the week number within the month, starting from 0
  const weekNumber = Math.floor(
    (todayDate + previousMonthDaysInFirstWeek - 1) / 7,
  );

  return weekNumber;
}

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });

  return daysMatrix;
}
