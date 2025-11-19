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
    <section className="bg-slate-950 text-white py-16">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        {/* LEFT TEXT */}
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-lime-300 mb-3">
            {t("forms.join.sectionLabel")}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {t("forms.join.title")}
          </h2>
          <p className="text-slate-300">
            {t("forms.join.subtitle")}
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
              name="name"
              placeholder={t("forms.join.fields.name")}
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder={t("forms.join.fields.email")}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="phone"
              placeholder={t("forms.join.fields.phone")}
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="url"
              name="linkedin"
              placeholder={t("forms.join.fields.linkedin")}
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t("forms.join.fields.country")}</option>
            {loading && <option disabled>Loading countries...</option>}
            {error && <option disabled>{error}</option>}
            {!loading &&
              !error &&
              countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
          </select>

          <textarea
            name="description"
            rows={4}
            placeholder={t("forms.join.fields.description")}
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              name="privacyAccepted"
              checked={formData.privacyAccepted}
              onChange={handleChange}
              className="mt-0.5"
            />
            <span>
              {t("forms.join.fields.privacy")}{" "}
              <span className="text-indigo-600 underline cursor-pointer">
                Privacy Policy
              </span>
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-lime-400 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-lime-300 transition-colors"
          >
            {t("forms.join.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default JoinUsForm;
