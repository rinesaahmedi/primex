import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PartnerTestimonials() {
  const { t } = useTranslation();

  const testimonials = t("partners.testimonials", { returnObjects: true });

  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % testimonials.length);
  const prev = () =>
    setIndex((index - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[index];

  return (
    <div className="px-10 md:px-20 lg:px-32 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      {/* LEFT SIDE TEXT */}
      <div>
        <p className="text-4xl lg:text-5xl font-light leading-tight text-gray-900 mb-10">
          {current.quote}
        </p>

        <p className="text-xl font-semibold text-gray-900">{current.company}</p>

        <p className="text-gray-700 mt-1">
          <span className="font-semibold">{current.person}</span> — {current.role}
        </p>

        {/* BUTTONS */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center"
          >
            <Play className="w-6 h-6" />
          </button>

          <button
            onClick={next}
            className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="flex justify-center">
        <img
          src={current.image}
          alt="testimonial"
          className="rounded-3xl w-full max-w-lg object-cover shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        />
      </div>
    </div>
  );
}
