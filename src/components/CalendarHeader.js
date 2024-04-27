import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";
import { CALENDAR_VIEWS, getCurrentWeekOfMonth, getMonth } from "../util";
export default function CalendarHeader() {
  const {
    monthIndex,
    setMonthIndex,
    weekIndex,
    setWeekIndex,
    calendarView,
    setCalendarView,
  } = useContext(GlobalContext);

  function handleNavWeek(monthIndex, incrementWeek) {
    let currentMonth = getMonth(monthIndex);

    if (incrementWeek) {
      if (weekIndex + 1 >= currentMonth.length) {
        // Moving to the first week of the next month
        setMonthIndex(monthIndex + 1);
        setWeekIndex(0); // Always start at the first week of the next month
      } else {
        // Normal week increment within the same month
        setWeekIndex(weekIndex + 1);
      }
    } else {
      if (weekIndex - 1 < 0) {
        // Moving to the last week of the previous month
        let prevMonth = getMonth(monthIndex - 1);
        setMonthIndex(monthIndex - 1);
        setWeekIndex(prevMonth.length - 1); // Set to the last week of the previous month
      } else {
        // Normal week decrement within the same month
        setWeekIndex(weekIndex - 1);
      }
    }
  }

  function handlePrev(calendarView) {
    calendarView === CALENDAR_VIEWS.MONTH
      ? setMonthIndex(monthIndex - 1)
      : handleNavWeek(monthIndex, false);
  }
  function handleNext(calendarView) {
    calendarView === CALENDAR_VIEWS.MONTH
      ? setMonthIndex(monthIndex + 1)
      : handleNavWeek(monthIndex, true);
  }
  function handleReset(calendarView) {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month(),
    );
    calendarView === CALENDAR_VIEWS.WEEK &&
      setWeekIndex(getCurrentWeekOfMonth());
  }

  let weekDays = getMonth(monthIndex)[weekIndex];

  console.table({
    weekIndex,
    monthIndex,
  });

  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">Calendar</h1>
      <button
        onClick={() => handleReset(calendarView)}
        className="border rounded py-2 px-4 mr-5"
      >
        Today
      </button>
      <button onClick={() => handlePrev(calendarView)}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={() => handleNext(calendarView)}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {calendarView === CALENDAR_VIEWS.MONTH
          ? dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")
          : weekDays
            ? `${weekDays[0].format("YYYY/MM/DD")} - ${weekDays[weekDays.length - 1].format("YYYY/MM/DD")}`
            : ""}
      </h2>
      <select
        value={calendarView}
        onChange={(e) => setCalendarView(e.target.value)}
      >
        {Object.values(CALENDAR_VIEWS).map((view) => (
          <option value={view}>{view}</option>
        ))}
      </select>
    </header>
  );
}
