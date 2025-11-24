import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function JoinUsForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    country: "",
    position: "", // NEW FIELD
    description: "",
    privacyAccepted: false,
    cvFile: null,
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const fileInputRef = useRef(null);

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
        setFetchError(null);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setFetchError("Failed to load countries");
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // --- VALIDATION LOGIC ---
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

    if (!formData.linkedin.trim()) {
      newErrors.linkedin = t("forms.validation.required");
    } else if (!urlRegex.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid URL";
    }

    if (!formData.country) newErrors.country = t("forms.validation.required");

    // NEW POSITION VALIDATION
    if (!formData.position) newErrors.position = t("forms.validation.required");

    if (!formData.description.trim())
      newErrors.description = t("forms.validation.required");

    if (!formData.cvFile) {
      newErrors.cvFile = t("forms.validation.required");
    } else if (errors.cvFile) {
      newErrors.cvFile = errors.cvFile;
    }

    if (!formData.privacyAccepted)
      newErrors.privacyAccepted = t("forms.validation.acceptPrivacy");

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
      const maxSize = 5 * 1024 * 1024;
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          cvFile: "File is too large (max 5MB)",
        }));
        setFormData((prev) => ({ ...prev, cvFile: null }));
        return;
      }
      if (
        !allowed.includes(file.type) &&
        !file.name.match(/\.(pdf|doc|docx)$/i)
      ) {
        setErrors((prev) => ({ ...prev, cvFile: "Unsupported file type" }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("linkedin", formData.linkedin);
      fd.append("country", formData.country);
      fd.append("position", formData.position); // SEND POSITION
      fd.append("description", formData.description);
      fd.append("privacyAccepted", formData.privacyAccepted ? "true" : "false");
      if (formData.cvFile) fd.append("cv", formData.cvFile);

      const response = await fetch("http://localhost:5000/send-apply-form", {
        method: "POST",
        body: fd,
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Application sent successfully!");
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
        alert("❌ Failed to send application.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred.");
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
            {/* ROW 1: Name & Email */}
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

            {/* ROW 2: Phone & LinkedIn */}
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

            {/* ROW 3: Country & Position (NEW) */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50 appearance-none
                    ${
                      errors.country
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                >
                  <option value="" className="bg-[#081333]">
                    {t("forms.join.fields.country")}
                  </option>
                  {!loadingCountries &&
                    countries.map((c, i) => (
                      <option key={i} value={c} className="bg-[#081333]">
                        {c}
                      </option>
                    ))}
                </select>
                <ErrorMsg field="country" />
              </div>
              <div>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border bg-white/10 px-5 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:bg-white/15 transition-all disabled:opacity-50 appearance-none
                    ${
                      errors.position
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 focus:ring-white/50"
                    }`}
                >
                  <option value="" className="bg-[#081333]">
                    {t("forms.join.fields.position") || "Select Position"}
                  </option>

                  <option
                    value="Operations & Support"
                    className="bg-[#081333] text-white"
                  >
                    Operations & Support
                  </option>

                  <option
                    value="Creative & Design"
                    className="bg-[#081333] text-white"
                  >
                    Creative & Design
                  </option>

                  <option
                    value="Technology & AI"
                    className="bg-[#081333] text-white"
                  >
                    Technology & AI
                  </option>

                  <option value="Other" className="bg-[#081333] text-white">
                    Other
                  </option>
                </select>
                <ErrorMsg field="position" />
              </div>
            </div>

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

            {/* CV Upload Section */}
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

            {/* Privacy Checkbox */}
            <div>
              <label className="flex items-start gap-3 text-sm text-white/90 group cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`mt-1 w-4 h-4 rounded border bg-white/10 text-white focus:ring-2 focus:ring-white/50 transition-colors
                    ${
                      errors.privacyAccepted
                        ? "border-red-400 ring-red-400"
                        : "border-white/30"
                    }`}
                />
                <span className={errors.privacyAccepted ? "text-red-200" : ""}>
                  {t("forms.join.fields.privacy")}{" "}
                  <span className="underline">Privacy Policy</span>
                </span>
              </label>
              <ErrorMsg field="privacyAccepted" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl bg-white text-[#2378FF] font-semibold py-4 text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${
                isSubmitting
                  ? "opacity-70 cursor-wait"
                  : "hover:bg-white/90 hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? "Sending..." : t("forms.join.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default JoinUsForm;
