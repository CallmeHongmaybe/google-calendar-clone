import React from "react";
import WeekDay from "./WeekDay";
export default function Week({ week }) {
  return (
    <div
      className="flex-1 grid grid-cols-7 grid-rows overflow-scroll"
      style={{ height: "88vh" }}
    >
      {week.map((day, idx) => (
        <React.Fragment key={idx}>
          {/* <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p> */}
          <WeekDay day={day} key={idx} rowIdx={idx} />
        </React.Fragment>
      ))}
    </div>
  );
}
