import React from "react";
import { useTranslation } from "react-i18next";

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

    return (
        <section id="partners" className="w-full py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14 space-y-4">
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

                {/* Vertical gap reduced to gap-y-2. Container heights reduced. */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-2 items-center">
                    {partnerLogos.map((partner) => (
                        <div
                            key={partner.name}
                            className="flex items-center justify-center h-36 sm:h-48 lg:h-56"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="max-h-28 sm:max-h-36 lg:max-h-48 w-auto object-contain opacity-80"
                            />
                        </div>
                    ))}

                    {/* Enhanced 'More Partners' design */}
                    <div className="flex flex-col gap-2 items-center justify-center h-36 sm:h-48 lg:h-56 rounded-3xl border-2 border-dashed border-slate-300 transition duration-300 hover:border-slate-500">
                        <span className="text-lg font-bold text-slate-700 tracking-wide">
                            {t("partnersGrid.moreLabel")}
                        </span>
                        <span className="text-sm uppercase tracking-[0.4em] text-slate-500">
                            {t("partnersGrid.moreTag")}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}