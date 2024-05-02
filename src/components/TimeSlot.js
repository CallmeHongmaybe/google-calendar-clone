import GlobalContext from "../context/GlobalContext";
import { useContext } from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

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

export const TimeSlot = ({
  date,
  idx,
  onStartSelecting,
  onContinueSelecting,
  onEndSelecting,
}) => {
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
      onMouseDown={() => onStartSelecting(date)}
      onMouseEnter={() => onContinueSelecting(date)}
      onMouseUp={() => onEndSelecting(date)}
      className="border-t border-gray-300"
      style={{ height: `10vh`, position: "relative" }}
      onClick={() => {
        setDaySelected(date);
        setShowEventModal(true);
      }}
    >
      {date.day() === 0 && (
        <span style={{ fontSize: 10, color: "gray", marginLeft: "0.25rem" }}>
          {convertToAMPM(date.hour())}
        </span>
      )}
      {dayEvents.map((evt, idx) => (
        <div
          key={idx}
          onClick={() => setSelectedEvent(evt)}
          style={{
            zIndex: 10,
            height: `${(getDurationInMinutes(evt.start_date, evt.end_date) * 100) / 60}%`,
          }}
          className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
        >
          {evt.title}
        </div>
      ))}
    </div>
  );
};

/*
Các bước làm: 
- Also khi nhấn chuột thì nó sẽ căn cứ vào vị trí mà tạo slot mặc định dài 1 tiếng
- Nếu cấn event tư vấn khác thì màu event sẽ ngả đỏ
- Hoặc người dùng có thể chọn giờ trong danh sách fetch từ GC API
*/
