import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";  // Import default styling

const AppointmentSetter = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Select an Appointment Time</h2>
      <div className="flex justify-center items-center">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileDisabled={({ date }) => {
            // Disable weekends or specific dates
            return date.getDay() === 0 || date.getDay() === 6;  // Disable weekends
          }}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={() => alert("Booking confirmed!")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentSetter;
