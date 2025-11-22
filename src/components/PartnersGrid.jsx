import React from "react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../utils/useScrollAnimation";

import forestdream from "../assets/partners/Forestdream.jpg";
import homeFurniture from "../assets/partners/home-furniture-1.jpg";
import homeface from "../assets/partners/Homeface.png";
import hometrend from "../assets/partners/Hometrend.jpg";
import modeco from "../assets/partners/Modeco.jpg";
import versanel from "../assets/partners/Versanel.jpg";
import visando from "../assets/partners/Visando.jpg";

const partnerLogos = [
    { name: "Forestdream", logo: forestdream },
    { name: "Home Furniture", logo: homeFurniture },
    { name: "Homeface", logo: homeface },
    { name: "Hometrend", logo: hometrend },
    { name: "Modeco", logo: modeco },
    { name: "Versanel", logo: versanel },
    { name: "Visando", logo: visando },
];

export default function PartnersGrid() {
    const { t } = useTranslation();
    const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...partnerLogos, ...partnerLogos];

    return (
        <section id="partners" className="w-full py-20 bg-white overflow-hidden">
            <div ref={sectionRef} className="max-w-6xl mx-auto px-6 mb-14">
                <div className={`text-center space-y-4 animate-lift-blur-subtle ${isVisible ? 'visible' : ''}`}>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                        {t("partnersGrid.kicker")}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        {t("partnersGrid.title")}
                    </h2>
                    <p className="text-slate-500 max-w-3xl mx-auto">
                        {t("partnersGrid.body")}
                    </p>
                </div>
            </div>

            {/* Infinite Slider - Full width with narrow margins */}
            <div className="relative overflow-hidden px-2">
                <div className="flex partners-scroll gap-16 items-center">
                    {duplicatedLogos.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="shrink-0 flex items-center justify-center h-48 md:h-64 lg:h-72"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="max-h-40 md:max-h-56 lg:max-h-64 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}