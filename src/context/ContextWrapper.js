import React, { useState, useEffect, useReducer, useMemo } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { CALENDAR_VIEWS, getCurrentWeekOfMonth } from "../util";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek); // Ensure consistent week start (typically Monday)

function getDurationInMinutes(start_date, end_date) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Calculate the difference in milliseconds
  const durationInMilliseconds = endDate - startDate;

  // Convert milliseconds to minutes
  const durationInMinutes = durationInMilliseconds / 1000 / 60;

  return durationInMinutes;
}

function savedEventsReducer(state, { type, payload }) {
  let stateCopy = [...state];
  switch (type) {
    case "drag":
      let draggedEvtIndx = stateCopy.findIndex(
        (evt) => evt.id === payload.evtId,
      );
      stateCopy[draggedEvtIndx].dragged = true;
      return stateCopy;
    case "move":
      for (let i = 0; i < stateCopy.length; i++) {
        if (stateCopy[i].dragged) {
          let { start_date, end_date } = stateCopy[i];
          let newStartTime = payload.newDate;
          let newEndTime = newStartTime.add(
            getDurationInMinutes(start_date, end_date),
            "minute",
          );
          stateCopy[i] = {
            ...stateCopy[i],
            start_date: newStartTime.valueOf(),
            end_date: newEndTime.valueOf(),
            dragged: false,
          };
        }
      }
      return stateCopy;
    case "push":
      return stateCopy.concat(payload);
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}
function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [weekIndex, setWeekIndex] = useState(getCurrentWeekOfMonth());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [dayEndSelected, setDayEndSelected] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents,
  );
  const [calendarView, setCalendarView] = useState(CALENDAR_VIEWS.MONTH);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label),
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        calendarView,
        setCalendarView,
        weekIndex,
        setWeekIndex,
        dayEndSelected,
        setDayEndSelected,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
