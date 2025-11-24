import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const AppointmentPage = () => {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Loading State
  const [isBooking, setIsBooking] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [otherTopic, setOtherTopic] = useState("");

  const businessOptions = [
    "Order Management & Logistics",
    "Customer Support",
    "Product & Content Management",
    "Design & Creative Services",
    "Technology & Development",
    "AI Solutions",
    "Other",
  ];

  // --- 1. REUSABLE FETCH FUNCTION ---
  // We wrap this in useCallback or just define it here to be called by useEffect and handleBooking
  const fetchSlots = () => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    const formattedDate = localDate.toISOString().split("T")[0];
    const tzOffset = new Date().getTimezoneOffset();

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
  };

  // --- 2. USE EFFECT TRIGGER ---
  // Run fetchSlots whenever the date changes
  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowForm(false);
    setSelectedTime("");
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setIsBooking(true);

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    const formattedDate = localDate.toISOString().split("T")[0];
    const tzOffset = new Date().getTimezoneOffset();

    const finalTopic = businessType === "Other" ? otherTopic : businessType;

    const bookingData = {
      name,
      email,
      phone,
      topic: finalTopic,
      date: formattedDate,
      time: selectedTime,
      tzOffset,
    };

    axios
      .post("http://localhost:5000/api/book-appointment", bookingData)
      .then((response) => {
        setIsBooking(false);
        alert(response.data.message);

        // Reset Form
        setName("");
        setEmail("");
        setPhone("");
        setBusinessType("");
        setOtherTopic("");
        setSelectedTime("");
        setShowForm(false);

        // --- 3. RE-FETCH SLOTS HERE ---
        // This updates the list immediately, removing the booked time
        fetchSlots();
      })
      .catch((error) => {
        setIsBooking(false);
        alert(error.response?.data?.message || "Error booking appointment");
      });
  };

  return (
    <>
      <style>{`
        .react-calendar {
          border: none !important;
          width: 100% !important;
          background: transparent !important;
          font-family: inherit;
        }
        .react-calendar__navigation {
          margin-bottom: 15px;
        }
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1.1rem;
          font-family: serif;
          font-weight: 700;
          color: #1e3a8a;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #eff6ff;
          border-radius: 8px;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.7rem;
          color: #9ca3af;
          text-decoration: none !important;
          margin-bottom: 10px;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
          border: none !important;
          cursor: default;
        }
        .react-calendar__tile {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px; 
          width: 40px;
          padding: 0;
          color: #4b5563;
          font-weight: 600;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #eff6ff;
          color: #2563eb;
        }
        .react-calendar__tile--now {
          background: transparent !important;
          border: 1px solid #2563eb;
          color: #2563eb !important;
        }
        .react-calendar__tile--active {
          background: #2563eb !important;
          color: white !important;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4);
        }
        .react-calendar__tile:disabled {
          background-color: transparent !important;
          color: #d1d5db !important; 
          cursor: not-allowed !important;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
          {/* LEFT PANEL: CALENDAR */}
          <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center">
            <div className="w-full max-w-[340px]">
              <h2 className="text-2xl font-serif font-bold text-blue-900 mb-1">
                Select Date
              </h2>
              <p className="text-gray-500 text-sm mb-6 font-medium">
                Choose a day to see available slots.
              </p>

              <Calendar
                onChange={handleDateChange}
                value={date}
                prev2Label={null}
                next2Label={null}
                minDate={new Date()}
                tileDisabled={({ date }) =>
                  date.getDay() === 0 || date.getDay() === 6
                }
              />
            </div>
          </div>

          {/* RIGHT PANEL: SLOTS & FORM */}
          <div className="w-full md:w-7/12 p-6 md:p-10 bg-white">
            {!showForm ? (
              <div className="animate-fade-in">
                <h3 className="text-xl font-serif font-bold text-blue-900 mb-5 flex items-center gap-3">
                  Available Times
                  <span className="text-xs font-sans font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </h3>

                {availableSlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-56 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
                    <p className="font-medium">
                      No slots available for this date.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelection(slot)}
                        className={`
                            py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 border
                            ${
                              selectedTime === slot
                                ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                                : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                            }
                          `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // BOOKING FORM
              <div className="animate-fade-in-up max-w-lg mx-auto md:mx-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-serif font-bold text-blue-900">
                    Confirm Booking
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    disabled={isBooking}
                    className={`text-xs font-semibold text-gray-400 transition-colors underline decoration-2 decoration-transparent underline-offset-4 ${
                      isBooking
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-blue-600 hover:decoration-blue-600"
                    }`}
                  >
                    Change Time
                  </button>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 px-4 py-3 rounded-xl mb-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                      Date
                    </p>
                    <p className="text-blue-900 font-bold font-serif text-base">
                      {date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                      Time
                    </p>
                    <p className="text-blue-900 font-bold font-serif text-base">
                      {selectedTime}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isBooking}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isBooking}
                        placeholder="john@company.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isBooking}
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                      Business Type / Topic
                    </label>
                    <div className="relative">
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        required
                        disabled={isBooking}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-gray-700 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          Select a topic...
                        </option>
                        {businessOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {businessType === "Other" && (
                    <div className="animate-fade-in-down">
                      <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                        Please specify the topic
                      </label>
                      <input
                        type="text"
                        value={otherTopic}
                        onChange={(e) => setOtherTopic(e.target.value)}
                        required
                        disabled={isBooking}
                        placeholder="What would you like to discuss?"
                        className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isBooking}
                    className={`
                        w-full mt-4 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform uppercase tracking-wide text-xs flex items-center justify-center
                        ${
                          isBooking
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-xl hover:from-blue-700 hover:to-blue-600 hover:-translate-y-0.5"
                        }
                      `}
                  >
                    {isBooking ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentPage;
