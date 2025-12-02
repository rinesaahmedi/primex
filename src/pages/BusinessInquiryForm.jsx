import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const BusinessInquiryForm = () => {
  const { t } = useTranslation();

  // --- FORM STATE ---
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const businessOptions = [
    "orderManagement",
    "customerSupport",
    "productContent",
    "designCreative",
    "technologyDev",
    "aiSolutions",
    "other",
  ];

  // --- CLICK OUTSIDE LISTENER ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    // Phone is optional in your snippet (no *), so we remove required check
    // If you want it required, uncomment the next line:
    // if (!formData.phone.trim()) newErrors.phone = t("forms.validation.required");

    if (!formData.businessType)
      newErrors.businessType = t("forms.validation.required");

    if (formData.website.trim() && !urlRegex.test(formData.website)) {
      newErrors.website = t("forms.validation.invalidUrl");
    }

    if (!formData.message.trim())
      newErrors.message = t("forms.validation.required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, businessType: value }));
    if (errors.businessType) {
      setErrors((prev) => ({ ...prev, businessType: null }));
    }
    setIsDropdownOpen(false);
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
        alert(t("forms.alerts.success"));
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
        alert(t("forms.alerts.error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert(t("forms.alerts.genericError"));
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
      <div className="max-w-6xl mx-auto px-6 py-10">
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
            {/* ROW 1 */}
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

            {/* ROW 2 */}
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

            {/* ROW 3: Custom Select & Website */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* --- CUSTOM DROPDOWN COMPONENT --- */}
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() =>
                    !isSubmitting && setIsDropdownOpen(!isDropdownOpen)
                  }
                  className={`
                    w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base cursor-pointer flex justify-between items-center transition-all select-none
                    ${
                      errors.businessType
                        ? "border-red-400 ring-1 ring-red-400"
                        : "border-white/30 hover:bg-white/15"
                    }
                    ${isDropdownOpen ? "ring-2 ring-white/50 bg-white/15" : ""}
                    ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <span
                    className={
                      formData.businessType ? "text-white" : "text-white/60"
                    }
                  >
                    {formData.businessType
                      ? t(`forms.options.${formData.businessType}`)
                      : t("forms.business.fields.businessType")}
                  </span>
                  <svg
                    className={`w-5 h-5 text-white/70 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#081333] border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="max-h-60 overflow-y-auto">
                      {businessOptions.map((optionKey) => (
                        <li
                          key={optionKey}
                          onClick={() => handleSelectChange(optionKey)}
                          className={`
                            px-5 py-3 text-white cursor-pointer transition-colors
                            hover:bg-blue-600/30
                            ${
                              formData.businessType === optionKey
                                ? "bg-blue-600/50"
                                : ""
                            }
                          `}
                        >
                          {t(`forms.options.${optionKey}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ErrorMsg field="businessType" />
              </div>

              {/* Website Input */}
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

            {/* MESSAGE */}
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

            {/* BUTTON */}
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
                  {t("forms.general.sending")}
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
