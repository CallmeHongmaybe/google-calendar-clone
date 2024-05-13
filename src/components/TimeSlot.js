import GlobalContext from "../context/GlobalContext";
import { useContext } from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import EventChip from "./EventChip";

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

export const TimeSlot = ({ date, idx }) => {
  const {
    setDaySelected,
    setShowEventModal,
    setSelectedEvent,
    filteredEvents,
    dispatchCalEvent,
  } = useContext(GlobalContext);
  const [dayEvent, setDayEvent] = useState();

  useEffect(() => {
    const event =
      filteredEvents.find((evt) => {
        let isSameDate = dayjs(evt.start_date).isSame(date, "hour");
        return isSameDate;
      }) || null;
    setDayEvent(event);
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
        if (!dayEvent) {
          dispatchCalEvent({
            type: "move",
            payload: {
              newDate: date,
            },
          });
        }
      }}
    >
      {date.day() === 0 && (
        <span style={{ fontSize: 10, color: "gray", marginLeft: "0.25rem" }}>
          {convertToAMPM(date.hour())}
        </span>
      )}
      {dayEvent && (
        <EventChip
          onClick={() => setSelectedEvent(dayEvent)}
          evt={JSON.stringify(dayEvent)}
          idx={idx}
        />
      )}
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
