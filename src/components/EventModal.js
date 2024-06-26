import React, { useContext, useMemo, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import CustomDatePicker from "./DatePicker";

const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple"];

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    setDaySelected,
    dispatchCalEvent,
    selectedEvent,
    dayEndSelected,
    setDayEndSelected,
  } = useContext(GlobalContext);

  // let eventChipRef = useRef();

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : "",
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0],
  );

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      start_date: daySelected.valueOf(),
      ...(dayEndSelected ? { end_date: dayEndSelected.valueOf() } : {}),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
      setDaySelected();
      setDayEndSelected();
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
      setDaySelected();
      setDayEndSelected();
    }

    setShowEventModal(false);
  }

  let meetingDurationSelect = useMemo(() => {
    return [30, 45, 60].map((minute) => {
      let endDate = daySelected.clone().add(minute, "minute");
      return (
        <button
          class="px-2 ml-2"
          onClick={(e) => {
            setDayEndSelected(endDate);
            e.preventDefault();
            e.stopPropagation();
            // if (eventChipRef.current) {
            //   eventChipRef.current.style.height = `${(minute * 100) / 60}%`;
            // }
          }}
        >
          {endDate.format("HH:mm")}
        </button>
      );
    });
  }, [daySelected, setDayEndSelected]);

  return (
    <div
      className="h-screen w-full fixed left-0 top-0 flex justify-center items-center"
      style={{ zIndex: 20 }}
    >
      <form className="bg-white rounded-lg shadow-2xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button
              onClick={() => {
                setShowEventModal(false);
                setDayEndSelected(null);
              }}
            >
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="text-gray-400">Start</span>

            <p>
              {selectedEvent?.start_date ? (
                <>
                  <span>
                    {dayjs(selectedEvent.start_date).format("dddd, MMMM DD, ")}
                  </span>
                  <CustomDatePicker selectedDate={selectedEvent.start_date} />
                </>
              ) : (
                <>
                  <span>{daySelected.format("dddd, MMMM DD, ")}</span>
                  <CustomDatePicker />
                </>
              )}
            </p>
            <span className="text-gray-400">Duration</span>
            <p>{meetingDurationSelect.map((el) => el)}</p>
            <span className="text-gray-400">End</span>
            <p>
              {dayEndSelected && dayEndSelected.format("dddd, MMMM DD, HH:mm")}
            </p>
            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              bookmark_border
            </span>
            <div className="flex gap-x-2">
              {labelsClasses.map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span className="material-icons-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
