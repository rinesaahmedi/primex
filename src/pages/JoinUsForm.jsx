// src/components/JoinUsForm.jsx
import React, { useState, useEffect } from "react";
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
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    try {
      const response = await fetch("http://localhost:5000/send-apply-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <section className="bg-gradient-to-br from-[#081333] via-[#1659bd] to-[#fadebc] text-white py-16 md:py-24 min-h-screen">
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
              <option value="" className="bg-[#081333]">{t("forms.join.fields.country")}</option>
              {loading && <option disabled className="bg-[#081333]">Loading countries...</option>}
              {error && <option disabled className="bg-[#081333]">{error}</option>}
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
