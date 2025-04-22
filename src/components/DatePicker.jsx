import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
const MyDatePicker = ({ data, onDateChange, initialDate }) => {
    const [date, setDate] = useState(initialDate || data);
  
    useEffect(() => {
      if (initialDate) {
        setDate(initialDate);
      }
    }, [initialDate]);
  
    const handleChange = (selectedDate) => {
      setDate(selectedDate);
      onDateChange(selectedDate);
    };
  
    return (
      <DatePicker
        selected={date}
        onChange={handleChange}
        placeholderText=""
        dateFormat="yyyy MMMM, d"
        isClearable
        popperPlacement="bottom-start"
        className="form-control"
        minDate={new Date()}
      />
    );
  };

  export default MyDatePicker