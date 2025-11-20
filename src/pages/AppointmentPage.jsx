import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { CalendarClock, Clock, CheckCircle2 } from "lucide-react";

const AppointmentPage = () => {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/available-slots")
      .then((response) => setAvailableSlots(response.data || []))
      .catch((error) =>
        console.error("Error fetching available slots:", error)
      );
  }, []);

  const dateKey = useMemo(() => date.toISOString().split("T")[0], [date]);

  const slotsForDate = useMemo(() => {
    return availableSlots
      .filter((slot) => slot.startsWith(dateKey))
      .map((slot) => slot);
  }, [availableSlots, dateKey]);

  const hasSlotsForDate = slotsForDate.length > 0;

  const handleBooking = () => {
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }
    setIsSubmitting(true);
    axios
      .post("http://localhost:5000/api/book-appointment", {
        time: selectedSlot,
      })
      .then((response) => alert(response.data.message))
      .catch((error) => {
        const message = error?.response?.data?.message || "Booking failed.";
        alert(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="appointment-page relative overflow-hidden bg-linear-to-b from-[#102347] via-[#1f3d6d] to-[#f6f9ff] min-h-screen py-20 px-4">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute -top-24 -left-12 h-72 w-72 rounded-full bg-[#fadebc] blur-[160px]" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#2378ff] blur-[180px]" />
      </div>
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center text-white mb-12">
          <br></br>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-xs uppercase tracking-[0.3em]">
            <CalendarClock className="w-4 h-4" />
            Book a Call
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mt-6 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Secure your Primex consultation
          </h1>
          <p className="text-white/85 max-w-2xl mx-auto text-lg">
            Choose a date, pick a window, and our team will confirm your slot.
            All times are displayed in your local timezone.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2
              className="text-2xl font-semibold text-slate-900 mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Choose a date
            </h2>
            <Calendar
              onChange={(newDate) => {
                setDate(newDate);
                setSelectedSlot(null);
              }}
              value={date}
              className="w-full border-0 text-slate-900 react-calendar-primex"
              tileDisabled={({ date }) => {
                const key = date.toISOString().split("T")[0];
                return !availableSlots.some((slot) => slot.startsWith(key));
              }}
            />
            <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#2378FF]" />
              Slots available
              <span className="inline-block h-3 w-3 rounded-full bg-slate-200 ml-4" />
              Unavailable
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#2378FF]/10 text-[#2378FF] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Times for {date.toLocaleDateString()}
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Select a slot
                </h3>
              </div>
            </div>

            <div className="flex-1">
              {hasSlotsForDate ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {slotsForDate.map((slot) => {
                    const isSelected = slot === selectedSlot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-all ${isSelected
                          ? "border-[#2378FF] bg-[#2378FF]/10 text-[#2378FF]"
                          : "border-slate-200 hover:border-[#2378FF]/40 text-slate-700"
                          }`}
                      >
                        <span className="text-sm font-semibold block">
                          {new Date(slot).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(slot).toLocaleDateString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 text-center">
                  <p className="text-slate-600">
                    No slots available. Please choose another date.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={handleBooking}
                disabled={!selectedSlot || isSubmitting}
                className="inline-flex items-center justify-center rounded-2xl bg-[#2378FF] text-white font-semibold px-6 py-4 shadow-lg hover:bg-[#1f5fcc] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Confirming..." : "Confirm appointment"}
              </button>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                You’ll receive a confirmation email once the slot is approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
