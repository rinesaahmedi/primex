import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import axios from "axios";

const AppointmentPage = () => {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Fetch available slots from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/available-slots")
      .then((response) => {
        setAvailableSlots(response.data);
      })
      .catch((error) => console.error("Error fetching available slots:", error));
  }, []);

  // Handle booking of the selected time
  const handleBooking = (time) => {
    axios
      .post("http://localhost:5000/api/book-appointment", { time })
      .then((response) => alert(response.data.message))
      .catch((error) => alert(error.response.data.message));
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="container mx-auto p-6 mt-16 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Select an Appointment Time
      </h2>

      {/* Calendar Component */}
      <div className="flex justify-center mb-6">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            return !availableSlots.some((slot) => slot.startsWith(formattedDate))
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Disabled date style
              : "bg-white text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg"; // Active date style
          }}
          tileDisabled={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            return !availableSlots.some((slot) => slot.startsWith(formattedDate));
          }}
        />
      </div>

      {/* Confirm Appointment Button */}
      <div className="flex justify-center">
        <button
          onClick={() => handleBooking(date.toISOString())} // Pass selected date to the backend
          className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentPage;
