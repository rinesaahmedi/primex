import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="relative w-full py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Testimonial content */}
        <div className="text-center">
          {/* Quote */}
          <blockquote 
            className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-12 text-slate-900 max-w-4xl mx-auto" 
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {current.quote}
          </blockquote>

          {/* Author info */}
          <div className="mb-12">
            <p className="text-lg font-semibold text-slate-900 mb-1">{current.company}</p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-700">{current.person}</span>, {current.role}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#2378FF] hover:text-white transition-all flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === index 
                      ? 'bg-[#2378FF] w-8' 
                      : 'bg-slate-300 w-1.5 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#2378FF] hover:text-white transition-all flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
