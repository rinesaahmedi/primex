import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Added import
import { apiUrl } from "../apiBase";

// Simple Checkmark Icon Component
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const AppointmentPage = () => {
  const { t, i18n } = useTranslation(); // Initialize hook
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Stores dates (YYYY-MM-DD) that have 0 slots available
  const [unavailableDates, setUnavailableDates] = useState([]);

  // Loading State
  const [isBooking, setIsBooking] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [otherTopic, setOtherTopic] = useState("");

  // CHANGED: Use keys instead of full English sentences
  const businessOptions = [
    "orderManagement",
    "customerSupport",
    "productContent",
    "designCreative",
    "technologyDev",
    "aiSolutions",
    "other",
  ];

  // Helper: Format Date to YYYY-MM-DD (Local Time)
  const formatDateString = (dateObj) => {
    return dateObj.toLocaleDateString("en-CA");
  };

  // 1. Fetch which dates in the current month are fully booked
  const fetchMonthlyAvailability = (activeStartDate) => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth() + 1;
    const tzOffset = new Date().getTimezoneOffset();

    axios
      .get(
        apiUrl(
          `/api/unavailable-dates?year=${year}&month=${month}&tzOffset=${tzOffset}`
        )
      )
      .then((response) => {
        setUnavailableDates(response.data);
      })
      .catch((error) =>
        console.error("Error fetching monthly availability:", error)
      );
  };

  // 2. Fetch specific time slots for the selected day
  const fetchSlots = () => {
    const formattedDate = formatDateString(date);
    const tzOffset = new Date().getTimezoneOffset();

    axios
      .get(
        apiUrl(
          `/api/available-slots?date=${formattedDate}&tzOffset=${tzOffset}`
        )
      )
      .then(({ data }) => {
        // Guard against non-array responses so rendering doesn't break
        const slots = Array.isArray(data) ? data : data?.availableSlots;
        setAvailableSlots(slots || []);
      })
      .catch((error) =>
        console.error("Error fetching available slots:", error)
      );
  };

  useEffect(() => {
    fetchMonthlyAvailability(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowForm(false);
    setSelectedTime("");
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    fetchMonthlyAvailability(activeStartDate);
  };

  const isTileDisabled = ({ date, view }) => {
    if (view === "month") {
      if (date.getDay() === 0 || date.getDay() === 6) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;
      const dateStr = formatDateString(date);
      if (unavailableDates.includes(dateStr)) return true;
    }
    return false;
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const toggleTopic = (optionKey) => {
    setSelectedTopics((prev) =>
      prev.includes(optionKey)
        ? prev.filter((t) => t !== optionKey)
        : [...prev, optionKey]
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setIsBooking(true);

    const formattedDate = formatDateString(date);
    const tzOffset = new Date().getTimezoneOffset();

    if (!selectedTopics || selectedTopics.length === 0) {
      setIsBooking(false);
      alert(t("appointment.alerts.selectTopic")); // Translated alert
      return;
    }

    // Map keys to readable strings (localized) before sending to backend,
    // OR just send the keys if your backend handles it.
    // Here we send the English or German string based on current language.
    const finalTopics = selectedTopics.map((key) =>
      key === "other"
        ? otherTopic.trim() || t("appointment.topics.other")
        : t(`appointment.topics.${key}`)
    );

    const bookingData = {
      name,
      email,
      phone,
      topic: finalTopics,
      date: formattedDate,
      time: selectedTime,
      tzOffset,
      language: i18n.language, // Optional: send language to backend
    };

    axios
      .post(apiUrl("/api/book-appointment"), bookingData)
      .then((response) => {
        setIsBooking(false);
        // You might want to use a translated success message instead of backend response
        alert(response.data.message || t("appointment.alerts.success"));

        setName("");
        setEmail("");
        setPhone("");
        setSelectedTopics([]);
        setOtherTopic("");
        setSelectedTime("");
        setShowForm(false);

        fetchSlots();
        fetchMonthlyAvailability(date);
      })
      .catch((error) => {
        setIsBooking(false);
        alert(error.response?.data?.message || t("appointment.alerts.error"));
      });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        .montserrat-app, .montserrat-app input, .montserrat-app button, .react-calendar {
          font-family: 'Montserrat', sans-serif !important;
        }
        .react-calendar {
          border: none !important;
          width: 100% !important;
          background: transparent !important;
        }
        .react-calendar__navigation {
          margin-bottom: 15px;
        }
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1.1rem;
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
          color: #e5e7eb !important;
          cursor: not-allowed !important;
          text-decoration: line-through;
          opacity: 0.9;
        }
      `}</style>

      <div className="montserrat-app min-h-screen bg-gray-50 flex flex-col items-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-gray-800">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
          {/* LEFT PANEL: CALENDAR */}
          <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center">
            <div className="w-full max-w-[340px]">
              <h2 className="text-2xl font-bold text-blue-900 mb-1">
                {t("appointment.selectDate")}
              </h2>
              <p className="text-gray-500 text-sm mb-6 font-medium">
                {t("appointment.chooseDay")}
              </p>

              <Calendar
                onChange={handleDateChange}
                value={date}
                prev2Label={null}
                next2Label={null}
                minDate={new Date()}
                tileDisabled={isTileDisabled}
                onActiveStartDateChange={handleActiveStartDateChange}
                // Determine locale for calendar based on i18n
                locale={i18n.language}
              />
            </div>
          </div>

          {/* RIGHT PANEL: SLOTS & FORM */}
          <div className="w-full md:w-7/12 p-6 md:p-10 bg-white">
            {!showForm ? (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-blue-900 mb-5 flex items-center gap-3">
                  {t("appointment.availableTimes")}
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                    {date.toLocaleDateString(
                      i18n.language === "de" ? "de-DE" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </h3>

                {/* Ensure slots is always an array to avoid map() errors */}
                {(!Array.isArray(availableSlots) || availableSlots.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-56 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
                    <p className="font-medium">{t("appointment.noSlots")}</p>
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
                  <h3 className="text-xl font-bold text-blue-900">
                    {t("appointment.confirmBooking")}
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
                    {t("appointment.changeTime")}
                  </button>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 px-4 py-3 rounded-xl mb-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                      {t("appointment.dateLabel")}
                    </p>
                    <p className="text-blue-900 font-bold text-base">
                      {date.toLocaleDateString(
                        i18n.language === "de" ? "de-DE" : "en-US"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                      {t("appointment.timeLabel")}
                    </p>
                    <p className="text-blue-900 font-bold text-base">
                      {selectedTime}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                      {t("appointment.fullName")}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isBooking}
                      placeholder={t("appointment.placeholders.name")}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                        {t("appointment.email")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isBooking}
                        placeholder={t("appointment.placeholders.email")}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                        {t("appointment.phone")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isBooking}
                        placeholder={t("appointment.placeholders.phone")}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Business Topic Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">
                      {t("appointment.businessType")}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {businessOptions.map((optionKey) => {
                        const isSelected = selectedTopics.includes(optionKey);
                        return (
                          <label
                            key={optionKey}
                            className={`
                              relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ease-in-out group select-none
                              ${
                                isBooking
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:shadow-sm"
                              }
                              ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50/50 shadow-sm"
                                  : "border-gray-100 bg-white hover:border-blue-200"
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              disabled={isBooking}
                              checked={isSelected}
                              onChange={() => toggleTopic(optionKey)}
                              className="sr-only"
                            />

                            {/* Checkbox Circle */}
                            <div
                              className={`
                                w-4 h-4 rounded-full border flex items-center justify-center mr-2.5 flex-shrink-0 transition-all duration-200
                                ${
                                  isSelected
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-300 group-hover:border-blue-400 bg-white"
                                }
                              `}
                            >
                              {isSelected && (
                                <CheckIcon className="w-2.5 h-2.5 text-white" />
                              )}
                            </div>

                            <span
                              className={`font-medium text-xs leading-snug transition-colors ${
                                isSelected ? "text-blue-900" : "text-gray-600"
                              }`}
                            >
                              {/* TRANSLATE THE KEY HERE */}
                              {t(`appointment.topics.${optionKey}`)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* "Other" Input */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      selectedTopics.includes("other")
                        ? "max-h-24 opacity-100 mt-2"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                      {t("appointment.specifyTopic")}
                    </label>
                    <input
                      type="text"
                      value={otherTopic}
                      onChange={(e) => setOtherTopic(e.target.value)}
                      required={selectedTopics.includes("other")}
                      disabled={isBooking}
                      placeholder={t("appointment.placeholders.topic")}
                      className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-sm disabled:opacity-60"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isBooking}
                    className={`
                        w-full mt-6 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform uppercase tracking-wide text-xs flex items-center justify-center
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
                        {t("appointment.processing")}
                      </>
                    ) : (
                      t("appointment.confirmButton")
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
