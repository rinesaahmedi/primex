// src/components/BusinessInquiryForm.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const BusinessInquiryForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    website: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/send-business-inquiry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("✅ Thank you! Your inquiry has been sent successfully.");
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          businessType: "",
          website: "",
          message: "",
        });
      } else {
        alert("❌ Failed to send inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred. Please try again later.");
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#ffffff] text-white py-16 md:py-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section - Centered */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] text-white/80 mb-4 uppercase">
            {t("forms.business.sectionLabel")}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {t("forms.business.title")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed">
            {t("forms.business.subtitle")}
          </p>
        </div>

        {/* Form Section - Centered */}
        <div className="max-w-3xl mx-auto">
          <form
            className="bg-white/10 text-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-6 backdrop-blur-md border border-white/20"
            onSubmit={handleSubmit}
          >
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="companyName"
                placeholder={t("forms.business.fields.companyName")}
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
              <input
                type="text"
                name="contactPerson"
                placeholder={t("forms.business.fields.contactPerson")}
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="email"
                name="email"
                placeholder={t("forms.business.fields.email")}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
              <input
                type="tel"
                name="phone"
                placeholder={t("forms.business.fields.phone")}
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              >
                <option value="" className="bg-[#081333]">
                  {t("forms.business.fields.businessType")}
                </option>

                <option
                  value="Order Management & Logistics"
                  className="bg-[#081333]"
                >
                  Order Management & Logistics
                </option>

                <option value="Customer Support" className="bg-[#081333]">
                  Customer Support
                </option>

                <option
                  value="Product & Content Management"
                  className="bg-[#081333]"
                >
                  Product & Content Management
                </option>

                <option
                  value="Design & Creative Services"
                  className="bg-[#081333]"
                >
                  Design & Creative Services
                </option>

                <option
                  value="Technology & Development"
                  className="bg-[#081333]"
                >
                  Technology & Development
                </option>

                <option value="AI Solutions" className="bg-[#081333]">
                  AI Solutions
                </option>
              </select>
              <input
                type="url"
                name="website"
                placeholder={t("forms.business.fields.website")}
                value={formData.website}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
            </div>

            <textarea
              name="message"
              rows={6}
              placeholder={t("forms.business.fields.message")}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-4 text-base text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-white text-[#2378FF] font-semibold py-4 text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("forms.business.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BusinessInquiryForm;
