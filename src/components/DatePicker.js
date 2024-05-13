import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { useState, forwardRef, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import GlobalContext from "../context/GlobalContext";

const filterPassedTime = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);

  return currentDate.getTime() < selectedDate.getTime();
};

const filterNonWorkTime = (time) => {
  const selectedDate = new Date(time);
  const hour = selectedDate.getHours();

  return hour >= 7 && hour <= 23;
};
const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  <span ref={ref} onClick={onClick}>
    {value}
  </span>
));

export default function CustomDatePicker({ selectedDate }) {
  let { daySelected, setDayEndSelected, setDaySelected } =
    useContext(GlobalContext);
  let startDateProps = selectedDate
    ? {
        value: new Date(selectedDate), // type iso string
        filters: filterNonWorkTime,
      }
    : {
        value: new Date(daySelected.valueOf()), // type dayjs obj
        filters: (time) => filterPassedTime(time) && filterNonWorkTime(time),
      };

  let [startDateValue, setStartDateValue] = useState(startDateProps.value);
  return (
    <DatePicker
      selected={startDateValue}
      onChange={(date) => {
        setStartDateValue(date);
        setDaySelected((day) => dayjs(day).hour(date.getHours()));
        setDayEndSelected();
      }}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={60}
      filterTime={startDateProps.filters}
      dateFormat="HH:mm"
      timeClassName={(time) => {
        return !startDateProps.filters(time) && "hidden";
      }}
      customInput={<ExampleCustomInput />}
    />
  );
}
