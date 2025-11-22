// src/components/JoinUsForm.jsx
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
    description: "",
    privacyAccepted: false,
    cvFile: null,
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cvError, setCvError] = useState(null);
  const fileInputRef = useRef(null);

  // fetch countries once
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const countryList = data
          .map((country) => country.name?.common || country.name)
          .sort((a, b) => a.localeCompare(b));

        setCountries(countryList);
        setError(null);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      const file =
        e.target.files && e.target.files[0] ? e.target.files[0] : null;
      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowed = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (file.size > maxSize) {
          setCvError("File is too large (max 5MB)");
          setFormData((prev) => ({ ...prev, cvFile: null }));
          return;
        }
        if (
          !allowed.includes(file.type) &&
          !file.name.match(/\.(pdf|doc|docx)$/i)
        ) {
          setCvError("Unsupported file type (use pdf, doc, docx)");
          setFormData((prev) => ({ ...prev, cvFile: null }));
          return;
        }
      }

      setCvError(null);
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

    if (!formData.privacyAccepted) {
      alert(t("forms.validation.acceptPrivacy"));
      return;
    }

    if (cvError) {
      alert(cvError);
      return;
    }

    try {
      // Use FormData so we can include file uploads
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("linkedin", formData.linkedin);
      fd.append("country", formData.country);
      fd.append("description", formData.description);
      fd.append("privacyAccepted", formData.privacyAccepted ? "1" : "0");
      if (formData.cvFile) fd.append("cv", formData.cvFile);

      const response = await fetch("http://localhost:5000/send-apply-form", {
        method: "POST",
        body: fd,
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          linkedin: "",
          country: "",
          description: "",
          privacyAccepted: false,
          cvFile: null,
        });
      } else {
        alert("❌ Failed to send message. Please try again.");
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
            {t("forms.join.sectionLabel")}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {t("forms.join.title")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed">
            {t("forms.join.subtitle")}
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
                name="name"
                placeholder={t("forms.join.fields.name")}
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder={t("forms.join.fields.email")}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="phone"
                placeholder={t("forms.join.fields.phone")}
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
              <input
                type="url"
                name="linkedin"
                placeholder={t("forms.join.fields.linkedin")}
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
              />
            </div>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
            >
              <option value="" className="bg-[#081333]">
                {t("forms.join.fields.country")}
              </option>
              {loading && (
                <option disabled className="bg-[#081333]">
                  Loading countries...
                </option>
              )}
              {error && (
                <option disabled className="bg-[#081333]">
                  {error}
                </option>
              )}
              {!loading &&
                !error &&
                countries.map((country, index) => (
                  <option key={index} value={country} className="bg-[#081333]">
                    {country}
                  </option>
                ))}
            </select>

            <textarea
              name="description"
              rows={6}
              placeholder={t("forms.join.fields.description")}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-4 text-base text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15 transition-all"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/90">
                {t("forms.join.fields.cv") || "Upload CV (pdf, doc, docx)"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="cvFile"
                  accept=",.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="rounded-xl px-4 py-2 bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20 transition"
                >
                  {t("forms.join.actions.chooseFile") || "Choose file"}
                </button>

                {formData.cvFile ? (
                  <div className="text-sm text-white/90 flex items-center gap-3">
                    <span className="truncate max-w-56">
                      {formData.cvFile.name} (
                      {Math.round(formData.cvFile.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, cvFile: null }));
                        setCvError(null);
                      }}
                      className="text-xs underline text-white/90 hover:text-white"
                    >
                      {t("forms.join.actions.removeFile") || "Remove"}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-white/60">
                    {t("forms.join.fields.cvPlaceholder") || "No file chosen"}
                  </span>
                )}
              </div>

              {cvError && <p className="text-xs text-red-400">{cvError}</p>}
            </div>

            <label className="flex items-start gap-3 text-sm text-white/90">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-white focus:ring-2 focus:ring-white/50"
              />
              <span>
                {t("forms.join.fields.privacy")}{" "}
                <span className="text-white underline cursor-pointer hover:text-white/80">
                  Privacy Policy
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-white text-[#2378FF] font-semibold py-4 text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("forms.join.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default JoinUsForm;
