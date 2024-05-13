import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import EventChip from "./EventChip";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    dispatchCalEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.start_date).format("DD-MM-YY") === day.format("DD-MM-YY"),
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  let dayTitle = (day) => (
    <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>
  );

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }
  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && dayTitle(day)}
        <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>
          {day.format("DD")}
        </p>
      </header>
      <div
        className={`flex-1 cursor-pointer`}
        onClick={() => {
          setDaySelected(
            day.hour(new Date().getHours()).startOf("hour").add(1, "hour"),
          );
          setShowEventModal(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.backgroundColor = "#a2a2a2";
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.style.backgroundColor = "#fff";
        }}
        onDrop={(e) => {
          e.currentTarget.style.backgroundColor = "#fff";
          dispatchCalEvent({
            type: "move",
            payload: {
              newDate: day
                .hour(new Date().getHours())
                .startOf("hour")
                .add(1, "hour"),
            },
          });
        }}
      >
        {dayEvents.map((dayEvent) => (
          <EventChip
            onClick={() => setSelectedEvent(dayEvent)}
            evt={JSON.stringify(dayEvent)}
            idx={dayEvent.id}
          />
        ))}
      </div>
    </div>
  );
}
