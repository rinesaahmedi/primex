import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../apiBase";

function JoinUsForm() {
  const { t } = useTranslation();

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    country: "",
    position: "",
    description: "",
    privacyAccepted: false,
    cvFile: null,
  });

  // UI States
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // New: Modal State
  const [notification, setNotification] = useState(null);

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const positionDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Options keys (must match JSON "forms.options")
  const positionOptions = [
    "operationsSupport",
    "creativeDesign",
    "technologyAI",
    "other",
  ];

  // --- EFFECTS ---

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        positionDropdownRef.current &&
        !positionDropdownRef.current.contains(event.target)
      ) {
        setIsPositionOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const countryList = data
          .map((country) => country.name?.common || country.name)
          .sort((a, b) => a.localeCompare(b));

        setCountries(countryList);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // --- VALIDATION & HANDLERS ---

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.\w+\/?.*/i;

    if (!formData.name.trim()) newErrors.name = t("forms.validation.required");

    if (!formData.email.trim()) {
      newErrors.email = t("forms.validation.required");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("forms.validation.invalidEmail");
    }

    if (!formData.phone.trim())
      newErrors.phone = t("forms.validation.required");

    if (formData.linkedin.trim() && !urlRegex.test(formData.linkedin)) {
      newErrors.linkedin = t("forms.validation.invalidUrl");
    }

    if (!formData.country) newErrors.country = t("forms.validation.required");
    if (!formData.position) newErrors.position = t("forms.validation.required");
    if (!formData.description.trim())
      newErrors.description = t("forms.validation.required");

    if (!formData.cvFile) {
      newErrors.cvFile = t("forms.validation.required");
    } else if (errors.cvFile) {
      newErrors.cvFile = errors.cvFile;
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = t("forms.validation.acceptPrivacy");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (type === "file") {
      const file =
        e.target.files && e.target.files[0] ? e.target.files[0] : null;
      if (!file) {
        setFormData((prev) => ({ ...prev, cvFile: null }));
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          cvFile: t("forms.validation.fileTooLarge"),
        }));
        setFormData((prev) => ({ ...prev, cvFile: null }));
        return;
      }
      if (
        !allowed.includes(file.type) &&
        !file.name.match(/\.(pdf|doc|docx)$/i)
      ) {
        setErrors((prev) => ({
          ...prev,
          cvFile: t("forms.validation.fileType"),
        }));
        setFormData((prev) => ({ ...prev, cvFile: null }));
        return;
      }

      setErrors((prev) => ({ ...prev, cvFile: null }));
      setFormData((prev) => ({ ...prev, cvFile: file }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePositionSelect = (value) => {
    setFormData((prev) => ({ ...prev, position: value }));
    if (errors.position) setErrors((prev) => ({ ...prev, position: null }));
    setIsPositionOpen(false);
  };

  const handleCountrySelect = (value) => {
    setFormData((prev) => ({ ...prev, country: value }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
    setIsCountryOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      // Optional: scroll to top or show toast
      console.log("Validation failed", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("linkedin", formData.linkedin);
      fd.append("country", formData.country);
      fd.append("position", formData.position);
      fd.append("description", formData.description);
      fd.append("privacyAccepted", formData.privacyAccepted ? "true" : "false");
      if (formData.cvFile) fd.append("cv", formData.cvFile);

      // NOTE: Ensure this URL is correct for your environment
      const response = await fetch(apiUrl("/send-apply-form"), {
        method: "POST",
        body: fd,
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: "success",
          message: t("forms.alerts.success"),
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          linkedin: "",
          country: "",
          position: "",
          description: "",
          privacyAccepted: false,
          cvFile: null,
        });
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setNotification({
          type: "error",
          message: t("forms.alerts.error"),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        type: "error",
        message: t("forms.alerts.genericError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-300 text-xs mt-1.5 ml-1 animate-pulse">
        {errors[field]}
      </p>
    ) : null;

  return (
    <section className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#ffffff] text-white py-16 md:py-24 min-h-screen relative">
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-lg">
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
              notification.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900"
                : "bg-rose-50/95 border-rose-200 text-rose-900"
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="text-sm font-semibold">{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="ml-auto text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
              aria-label={t("forms.alerts.dismiss", "Dismiss")}
            >
              {t("forms.alerts.dismiss", "Dismiss")}
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] text-white/80 mb-4 uppercase">
            {t("forms.join.sectionLabel")}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {t("forms.join.title")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed">
            {t("forms.join.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form
            className="bg-white/10 text-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-6 backdrop-blur-md border border-white/20"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={t("forms.join.fields.name")}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.name
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="name" />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t("forms.join.fields.email")}
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
            </div>

            {/* Phone & LinkedIn */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder={t("forms.join.fields.phone")}
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
              <div>
                <input
                  type="url"
                  name="linkedin"
                  placeholder={t("forms.join.fields.linkedin")}
                  value={formData.linkedin}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                    ${
                      errors.linkedin
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                />
                <ErrorMsg field="linkedin" />
              </div>
            </div>

            {/* Country & Position */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Country */}
              <div className="relative" ref={countryDropdownRef}>
                <div
                  onClick={() =>
                    !isSubmitting && setIsCountryOpen(!isCountryOpen)
                  }
                  className={`w-full rounded-xl border px-5 py-3.5 text-base cursor-pointer flex justify-between items-center bg-white/10 transition-all
                    ${
                      errors.country
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 hover:bg-white/15"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={
                      formData.country ? "text-white" : "text-white/60"
                    }
                  >
                    {formData.country || t("forms.join.fields.country")}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      isCountryOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isCountryOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/20 bg-[#081333]/95 backdrop-blur-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                    {loadingCountries ? (
                      <div className="px-5 py-3 text-white/60 text-sm">
                        {t("forms.general.loading")}
                      </div>
                    ) : (
                      countries.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => handleCountrySelect(c)}
                          className="px-5 py-3 text-white hover:bg-white/20 cursor-pointer transition-colors text-sm border-b border-white/10 last:border-0"
                        >
                          {c}
                        </div>
                      ))
                    )}
                  </div>
                )}
                <ErrorMsg field="country" />
              </div>

              {/* Position */}
              <div className="relative" ref={positionDropdownRef}>
                <div
                  onClick={() =>
                    !isSubmitting && setIsPositionOpen(!isPositionOpen)
                  }
                  className={`w-full rounded-xl border px-5 py-3.5 text-base cursor-pointer flex justify-between items-center bg-white/10 transition-all
                    ${
                      errors.position
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 hover:bg-white/15"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={
                      formData.position ? "text-white" : "text-white/60"
                    }
                  >
                    {formData.position
                      ? t(`forms.options.${formData.position}`)
                      : t("forms.join.fields.position")}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      isPositionOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isPositionOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/20 bg-[#081333]/95 backdrop-blur-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {positionOptions.map((optionKey, index) => (
                      <div
                        key={index}
                        onClick={() => handlePositionSelect(optionKey)}
                        className="px-5 py-3 text-white hover:bg-white/20 cursor-pointer transition-colors text-sm border-b border-white/10 last:border-0"
                      >
                        {t(`forms.options.${optionKey}`)}
                      </div>
                    ))}
                  </div>
                )}
                <ErrorMsg field="position" />
              </div>
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                rows={6}
                placeholder={t("forms.join.fields.description")}
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full rounded-xl border bg-white/10 px-5 py-4 text-base text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50
                  ${
                    errors.description
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-white/50"
                  }`}
              />
              <ErrorMsg field="description" />
            </div>

            {/* CV Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/90">
                {t("forms.join.fields.cv")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="cvFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  disabled={isSubmitting}
                  className={`rounded-xl px-4 py-2 bg-white/10 border text-white text-sm hover:bg-white/20 transition disabled:opacity-50
                    ${
                      errors.cvFile
                        ? "border-red-400 text-red-100"
                        : "border-white/30"
                    }`}
                >
                  {t("forms.join.actions.chooseFile")}
                </button>
                {formData.cvFile ? (
                  <div className="text-sm text-white/90 flex items-center gap-3">
                    <span className="truncate max-w-56">
                      {formData.cvFile.name}
                    </span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, cvFile: null }));
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-xs underline text-white/90 hover:text-white"
                    >
                      {t("forms.join.actions.removeFile")}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-white/60">
                    {t("forms.join.fields.cvPlaceholder")}
                  </span>
                )}
              </div>
              <ErrorMsg field="cvFile" />
            </div>

            {/* PRIVACY CHECKBOX SECTION (Added) */}
            <div className="flex items-start gap-3 mt-4">
              <div className="relative flex items-center h-6">
                <input
                  id="privacyAccepted"
                  name="privacyAccepted"
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-5 h-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition cursor-pointer"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="privacyAccepted"
                  className="font-medium text-white/90 select-none"
                >
                  {t("forms.join.fields.privacyPreLink")}{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-blue-300 underline hover:text-blue-200 transition-colors"
                  >
                    {t("forms.join.fields.privacyLink")}
                  </button>
                </label>
                <ErrorMsg field="privacyAccepted" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl bg-white text-[#2378FF] font-semibold py-4 text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${
                isSubmitting
                  ? "opacity-70 cursor-wait"
                  : "hover:bg-white/90 hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting
                ? t("forms.general.sending")
                : t("forms.join.submit")}
            </button>
          </form>
        </div>
      </div>

      {/* --- PRIVACY POLICY MODAL (Added) --- */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 bg-black/70 backdrop-blur-sm transition-all">
          <div className="bg-white text-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#081333]">
                {t("forms.legal.title")}
              </h3>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar leading-relaxed text-sm text-gray-600 space-y-6">
              {/* Introduction */}
              <p className="italic text-gray-500 mb-4">
                {t("forms.legal.intro")}
              </p>

              {/* Section 1: Data Collection */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.typesTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.typesText")}
                </p>
              </div>

              {/* Section 2: Purpose */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.purposeTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.purposeText")}
                </p>
              </div>

              {/* Section 3: Legal Basis */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.basisTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.basisText")}
                </p>
              </div>

              {/* Section 4: Data Sharing */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.sharingTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.sharingText")}
                </p>
              </div>

              {/* Section 5: Retention */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.retentionTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.retentionText")}
                </p>
              </div>

              {/* Section 6: Security */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.securityTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.securityText")}
                </p>
              </div>

              {/* Section 7: Rights */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.rightsTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.rightsText")}
                </p>
              </div>

              {/* Section 8: Contact */}
              <div>
                <h4 className="font-bold text-[#081333] mb-2">
                  {t("forms.legal.sections.contactTitle")}
                </h4>
                <p className="text-justify">
                  {t("forms.legal.sections.contactText")}
                </p>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2.5 bg-[#081333] text-white rounded-xl font-medium hover:bg-[#162a66] transition-colors"
              >
                {t("forms.legal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default JoinUsForm;
