import dayjs from "dayjs";
import React, { useContext, useState, useEffect, useMemo } from "react";
import GlobalContext from "../context/GlobalContext";
import { TimeSlot } from "./TimeSlot";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const { filteredEvents } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.start_date).format("DD-MM-YY") === day.format("DD-MM-YY"),
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  let dayTitle = (day, i) => (
    <p className="text-sm mt-1" key={i}>
      {day.format("ddd").toUpperCase()}
    </p>
  );

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  let TimeSlots = useMemo(
    () => (day) =>
      Array(16)
        .fill()
        .map((el, indx) => day.hour(indx + 7))
        .map((day, idx) => <TimeSlot idx={idx} key={day.hour()} date={day} />),
    [],
  );

  return (
    <div
      className="border border-gray-200 flex flex-col"
      style={{ position: "relative" }}
    >
      <header
        className="flex flex-col items-center position-sticky bg-white"
        style={{ top: 0, zIndex: 10, position: "sticky" }}
      >
        {dayTitle(day, rowIdx)}
        <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>
          {day.format("DD")}
        </p>
      </header>
      <div className="cursor-pointer" style={{ height: "160vh" }}>
        {TimeSlots(day).map((TimeSlot) => TimeSlot)}
      </div>
    </div>
  );
}
