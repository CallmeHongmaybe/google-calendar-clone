import GlobalContext from "../context/GlobalContext";
import { useContext } from "react";
import { useState } from "react";

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

  return durationInMinutes;
}

export default function EventChip({ evt, idx, onClick }) {
  evt = JSON.parse(evt);
  let [isDragging, setIsDragging] = useState(false);
  const { dispatchCalEvent } = useContext(GlobalContext);

  return (
    <div
      key={idx}
      onClick={onClick}
      draggable={isDragging}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsDragging(true);
        dispatchCalEvent({
          type: "drag",
          payload: {
            evtId: evt.id,
          },
        });
      }}
      onDragEnd={() => {
        setIsDragging(false);
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
