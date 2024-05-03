import GlobalContext from "../context/GlobalContext";
import { useContext } from "react";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";

const convertToAMPM = (hour) => {
  if (hour < 0 || hour > 24) {
    return "Invalid hour";
  }

  if (hour === 0) {
    return "12 AM";
  } else if (hour < 12) {
    return hour + " AM";
  } else if (hour === 12) {
    return "12 PM";
  } else {
    return hour - 12 + " PM";
  }
};

function getDurationInMinutes(start_date, end_date) {
  // Check if start_date or end_date is nullish (null or undefined)
  // if (start_date == null || end_date == null) {
  //   return;
  // }

  // Convert Unix timestamps to JavaScript Date objects
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Calculate the difference in milliseconds
  const durationInMilliseconds = endDate - startDate;

  // Convert milliseconds to minutes
  const durationInMinutes = durationInMilliseconds / 1000 / 60;

  console.log("durationInMinutes", durationInMinutes);
  return durationInMinutes;
}

function EventChip({ evt, idx, onClick }) {
  evt = JSON.parse(evt);
  let [isDragging, setIsDragging] = useState(false);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Remove event listeners from the document
    document.removeEventListener("mouseup", handleMouseUp);
    console.log("ev listener removed");
  }, []);

  return (
    <div
      key={idx}
      onClick={onClick}
      draggable={isDragging}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsDragging(true);
        document.addEventListener("mouseup", handleMouseUp);
        console.log("ev listener added");
      }}
      style={{
        zIndex: 10,
        height: `${(getDurationInMinutes(evt.start_date, evt.end_date) * 100) / 60}%`,
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.6 : 1,
      }}
      className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
    >
      {evt.title}
    </div>
  );
}

export const TimeSlot = ({ date, idx }) => {
  const {
    setDaySelected,
    setShowEventModal,
    setSelectedEvent,
    filteredEvents,
  } = useContext(GlobalContext);
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    const events = filteredEvents.filter((evt) => {
      let isSameDate = dayjs(evt.start_date).isSame(date, "hour");
      return isSameDate;
    });
    setDayEvents(events);
  }, [filteredEvents, date]);

  return (
    <div
      key={idx}
      className="border-t border-gray-300"
      style={{ height: `10vh`, position: "relative" }}
      onClick={() => {
        setDaySelected(date);
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
      }}
    >
      {date.day() === 0 && (
        <span style={{ fontSize: 10, color: "gray", marginLeft: "0.25rem" }}>
          {convertToAMPM(date.hour())}
        </span>
      )}
      {dayEvents.map((evt, idx) => (
        <EventChip
          onClick={() => setSelectedEvent(evt)}
          evt={JSON.stringify(evt)}
          idx={idx}
        />
      ))}
    </div>
  );
};

/*
Các bước làm:
- EventChip component
-- The component should have onContextMenu listener to initiateDrag
-- initiateDrag triggers onDragStart event, event preventDefault, then perform usual logic
- For TimeSlot: 
-- onDragOver event preventDefault, dim the color of time slot with opacity on chip hover
-- onDragThru event preventDefault, revert the color of time slot to original
-- onDrop event, dispatchCalEvent with type "move-event" with payload being event data and new timeslot data. filteredEvents will reupdate

- Nếu cấn event tư vấn khác thì màu event sẽ ngả đỏ
*/
