import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { CALENDAR_VIEWS, getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";
import Week from "./components/Week";
function App() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, weekIndex, calendarView, showEventModal } =
    useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}

      <div
        className="flex flex-col"
        style={{ height: "100vh", overflow: "scroll" }}
      >
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />

          {calendarView === CALENDAR_VIEWS.MONTH ? (
            <Month month={currenMonth} />
          ) : (
            <Week week={currenMonth[weekIndex]} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
