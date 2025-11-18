import React from "react";
import { useTranslation } from "react-i18next";
import { Cpu, Brush, ClipboardList, Receipt, ShoppingBag } from "lucide-react";

export default function Services() {
  const { t } = useTranslation();

  // Load items from translation JSON
  const services = t("services.items", { returnObjects: true });

  // Map each service to a matching icon
  const icons = [
    <Cpu className="w-10 h-10" />,
    <Brush className="w-10 h-10" />,
    <ClipboardList className="w-10 h-10" />,
    <Receipt className="w-10 h-10" />,
    <ShoppingBag className="w-10 h-10" />,
  ];

  return (
    <section id="services" className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            {t("services.mainTitle")}
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {t("services.intro")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 
              hover:shadow-xl hover:bg-white transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
                {icons[index]}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
