import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
    // 1. Format Date as YYYY-MM-DD (Local time, not UTC)
    // We use this trick to ensure we get the date selected by the user visually
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    const formattedDate = localDate.toISOString().split("T")[0];

    // 2. Send the Timezone Offset (in minutes)
    // This tells the server how to adjust the "9:00 AM" to match the user's clock
    const tzOffset = new Date().getTimezoneOffset();

    console.log(`Fetching slots for: ${formattedDate} with offset ${tzOffset}`);

    axios
      .get(
        `http://localhost:5000/api/available-slots?date=${formattedDate}&tzOffset=${tzOffset}`
      )
      .then((response) => {
        setAvailableSlots(response.data);
      })
      .catch((error) =>
        console.error("Error fetching available slots:", error)
      );
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowForm(false);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const bookingData = {
      name,
      email,
      date: date.toISOString(),
      time: selectedTime,
    };

    axios
      .post("http://localhost:5000/api/book-appointment", bookingData)
      .then((response) => {
        alert(response.data.message);
        setName("");
        setEmail("");
        setSelectedTime("");
        setShowForm(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Error booking appointment");
      });
  };

  return (
    <div className="container mx-auto p-6 mt-16 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Select an Appointment Time
      </h2>

      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Calendar Display */}
        <div className="w-full md:w-1/2">
          <Calendar
            onChange={handleDateChange}
            value={date}
            // Disable weekends (optional)
            tileDisabled={({ date }) =>
              date.getDay() === 0 || date.getDay() === 6
            }
          />
        </div>

        {/* Time Slot Selection */}
        <div className="w-full md:w-1/2">
          <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
            Available Time Slots
          </h3>

          {availableSlots.length === 0 ? (
            <div className="p-4 bg-gray-100 text-gray-500 rounded-lg text-center">
              No available slots for this date.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelection(slot)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTime === slot
                      ? "bg-blue-700 text-white shadow-md"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form */}
      {showForm && (
        <form
          onSubmit={handleBooking}
          className="mt-8 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Confirm Booking for {selectedTime}
          </h3>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 font-semibold"
          >
            Confirm Appointment
          </button>
        </form>
      )}
    </div>
  );
};

export default AppointmentPage;
