import React from "react";
import Day from "./Day";
export default function Week({ week }) {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows">
      {week.map((day, idx) => (
        <React.Fragment key={idx}>
          {/* <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p> */}
          <Day day={day} key={idx} rowIdx={idx} />
        </React.Fragment>
      ))}
    </div>
  );
}
