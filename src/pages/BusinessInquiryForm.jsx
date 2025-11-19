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
    <section className="bg-slate-950 text-white py-16">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        {/* LEFT TEXT */}
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-lime-300 mb-3">
            {t("forms.business.sectionLabel")}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {t("forms.business.title")}
          </h2>
          <p className="text-slate-300">
            {t("forms.business.subtitle")}
          </p>
        </div>

        {/* RIGHT FORM */}
        <form
          className="bg-white text-slate-900 rounded-3xl shadow-xl p-6 md:p-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="companyName"
              placeholder={t("forms.business.fields.companyName")}
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="contactPerson"
              placeholder={t("forms.business.fields.contactPerson")}
              value={formData.contactPerson}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder={t("forms.business.fields.email")}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder={t("forms.business.fields.phone")}
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{t("forms.business.fields.businessType")}</option>
              <option value="IT Services">IT Services</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="url"
              name="website"
              placeholder={t("forms.business.fields.website")}
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <textarea
            name="message"
            rows={5}
            placeholder={t("forms.business.fields.message")}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-lime-400 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-lime-300 transition-colors"
          >
            {t("forms.business.submit")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BusinessInquiryForm;
