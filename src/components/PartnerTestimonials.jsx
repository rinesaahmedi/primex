import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../utils/useScrollAnimation";
import partnerPhoto from "../images/PrimEx logo slogan.jpg";

export default function PartnerTestimonials() {
  const { t } = useTranslation();
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const testimonials = t("partners.testimonials", { returnObjects: true });

  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % testimonials.length);
  const prev = () =>
    setIndex((index - 1 + testimonials.length) % testimonials.length);

  // We no longer need 'const current = ...' because we map all of them below

  // This section animates in, stacks every quote on top of each other, and exposes carousel controls.
  return (
    <section className="relative w-full py-20 md:py-28 bg-white">
      <div ref={sectionRef} className="max-w-5xl mx-auto px-6">
        {/* Testimonial content */}
        <div className={`text-center animate-lift-blur-subtle ${isVisible ? 'visible' : ''}`}>
          
          {/* 
            GRID STACK TRICK: 
            1. 'grid grid-cols-1' creates a single cell.
            2. We map ALL quotes.
            3. 'col-start-1 row-start-1' piles them all on top of each other.
            4. The container stretches to fit the TALLEST quote.
            5. We use opacity to show/hide, so the layout never jumps.
          */}
          {/* <div className="relative grid grid-cols-1 mb-16 max-w-4xl mx-auto items-center">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i} 
                className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${
                  i === index 
                    ? "opacity-100 z-10" 
                    : "opacity-0 -z-10 pointer-events-none"
                }`}
              >
                <blockquote 
                  className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-slate-900 italic" 
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>

          {/* Navigation */}
          {/* <div className="flex items-center justify-center gap-6">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 hover:bg-[#2378FF] hover:text-white transition-all flex items-center justify-center border border-slate-200 hover:border-transparent"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index 
                      ? 'bg-[#2378FF] w-8' 
                      : 'bg-slate-200 w-2 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 hover:bg-[#2378FF] hover:text-white transition-all flex items-center justify-center border border-slate-200 hover:border-transparent"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>  */}

          {/* Showcase photo (only the requested path) */}
          <div className="flex justify-center">
            <img
              src={partnerPhoto}
              alt="PrimEx branding"
              className="w-full max-w-2xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
