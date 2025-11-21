import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import axios from "axios";

const AppointmentPage = () => {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch available slots from the backend
  useEffect(() => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    axios
      .get(`http://localhost:5000/api/available-slots?date=${formattedDate}`)
      .then((response) => {
        setAvailableSlots(response.data); // Set available slots based on the selected date
      })
      .catch((error) => console.error("Error fetching available slots:", error));
  }, [date]); // Fetch available slots whenever the date changes

  // Handle date change when a user selects a date from the calendar
  const handleDateChange = (newDate) => {
    setDate(newDate); // Update selected date
    setShowForm(false); // Hide the form when date is changed
  };

  // Handle time slot selection
  const handleTimeSelection = (time) => {
    setSelectedTime(time); // Store the selected time slot
    setShowForm(true); // Show the booking form
  };

  // Handle booking submission
  const handleBooking = (e) => {
    e.preventDefault();

    const bookingData = {
      name,
      email,
      date: date.toISOString(),
      time: selectedTime,
    };

    axios
      .post("http://localhost:5000/api/book-appointment", bookingData) // Send booking data to backend
      .then((response) => {
        alert(response.data.message); // Show success message
        setName(""); // Clear form fields after successful booking
        setEmail("");
        setSelectedTime("");
        setShowForm(false);
      })
      .catch((error) => {
        alert(error.response.data.message); // Show error message
      });
  };

  return (
    <div className="container mx-auto p-6 mt-16 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Select an Appointment Time
      </h2>

      {/* Calendar Display */}
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
        />
      </div>

      {/* Time Slot Selection */}
      {availableSlots.length === 0 ? (
        <div className="text-gray-500 mb-6">No available slots for this date</div>
      ) : (
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-xl font-semibold mb-4">Select a Time Slot</h3>
          {availableSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleTimeSelection(slot)} // Set the selected time
              className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-2 hover:bg-blue-600"
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {/* Booking Form */}
      {showForm && (
        <form onSubmit={handleBooking}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update name state
              required
              className="mt-2 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
              className="mt-2 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700">Appointment Time</label>
            <input
              type="text"
              id="time"
              value={selectedTime}
              readOnly
              className="mt-2 p-2 w-full border rounded-md bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Confirm Appointment
          </button>
        </form>
      )}
    </div>
  );
};

export default AppointmentPage;
