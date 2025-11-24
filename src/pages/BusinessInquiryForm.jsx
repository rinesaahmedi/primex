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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // URL regex: Optional http/https, allows www., must have domain extension
    const urlRegex = /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.\w+\/?.*/i;

    if (!formData.companyName.trim())
      newErrors.companyName = t("forms.validation.required");
    if (!formData.contactPerson.trim())
      newErrors.contactPerson = t("forms.validation.required");

    if (!formData.email.trim()) {
      newErrors.email = t("forms.validation.required");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("forms.validation.invalidEmail");
    }

    if (!formData.phone.trim())
      newErrors.phone = t("forms.validation.required");
    if (!formData.businessType)
      newErrors.businessType = t("forms.validation.required");

    // Website is optional, but if filled, must be valid
    if (formData.website.trim() && !urlRegex.test(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    if (!formData.message.trim())
      newErrors.message = t("forms.validation.required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

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
        setErrors({});
      } else {
        alert("❌ Failed to send inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-300 text-xs mt-1.5 ml-1 animate-pulse">
        {errors[field]}
      </p>
    ) : null;

  return (
    <section className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#ffffff] text-white py-16 md:py-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
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

        {/* Form Section */}
        <div className="max-w-3xl mx-auto">
          <form
            className="bg-white/10 text-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-6 backdrop-blur-md border border-white/20"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  name="companyName"
                  placeholder={t("forms.business.fields.companyName")}
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.companyName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="companyName" />
              </div>
              <div>
                <input
                  type="text"
                  name="contactPerson"
                  placeholder={t("forms.business.fields.contactPerson")}
                  value={formData.contactPerson}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.contactPerson
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="contactPerson" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t("forms.business.fields.email")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="email" />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t("forms.business.fields.phone")}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.phone
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="phone" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50 appearance-none
                    ${
                      errors.businessType
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
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
                  <option value="Other" className="bg-[#081333]">
                    Other
                  </option>
                </select>
                <ErrorMsg field="businessType" />
              </div>

              <div>
                <input
                  type="url"
                  name="website"
                  placeholder={t("forms.business.fields.website")}
                  value={formData.website}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.website
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="website" />
              </div>
            </div>

            <div>
              <textarea
                name="message"
                rows={6}
                placeholder={t("forms.business.fields.message")}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full rounded-xl border bg-white/10 px-5 py-4 text-base text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                  ${
                    errors.message
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-white/50"
                  }`}
              />
              <ErrorMsg field="message" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full rounded-xl bg-white text-[#2378FF] font-semibold py-4 text-lg 
                shadow-lg transition-all flex justify-center items-center gap-2
                ${
                  isSubmitting
                    ? "opacity-70 cursor-wait"
                    : "hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-[#2378FF]"
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
                  Sending...
                </>
              ) : (
                t("forms.business.submit")
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BusinessInquiryForm;
