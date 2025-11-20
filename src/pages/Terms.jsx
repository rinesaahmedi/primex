// src/components/Terms.jsx
import React, { useEffect, useState } from "react";

const Terms = () => {
  const [termsText, setTermsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/terms.txt") // file in /public
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load terms file");
        }
        return response.text();
      })
      .then((data) => {
        setTermsText(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm md:text-base text-slate-500">
          Loading Terms and Conditions...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm md:text-base text-red-600">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md px-6 py-8 md:px-10 md:py-10 leading-relaxed">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-slate-900">
            Terms and Conditions
          </h1>

          <pre className="whitespace-pre-wrap font-sans text-sm md:text-base text-slate-700">
            {termsText}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default Terms;
