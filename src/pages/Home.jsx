import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Counter component to increment on button click
const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={increment}>
        Increment Count
      </button>
      <p>Current count: {count}</p>
    </div>
  );
};

export default function Home() {
  const { t } = useTranslation();
  
  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div style={{ padding: 24, backgroundColor: darkMode ? '#2c2c2c' : '#fff', color: darkMode ? '#fff' : '#000' }}>
      {/* Welcome Message */}
      <h1>{t("welcome")}</h1>
      <p>{t("intro")}</p>
    <div className="bg-black">HELLOO</div>

      {/* Dark Mode Toggle */}
      <div style={{ marginTop: 20 }}>
        <button onClick={toggleDarkMode}>
          {darkMode ? t("lightMode") : t("darkMode")}
        </button>
      </div>

      {/* Counter */}
      <Counter />

      {/* Dynamic List (using translation keys for list items) */}
      <div style={{ marginTop: 30 }}>
        <h2>{t("listTitle")}</h2>
        <ul>
          <li>{t("listItem1")}</li>
          <li>{t("listItem2")}</li>
          <li>{t("listItem3")}</li>
        </ul>
      </div>

      {/* Image/ Icon */}
      <div style={{ marginTop: 20 }}>
        <img src={darkMode ? "/dark-mode-image.png" : "/light-mode-image.png"} alt="Mode Image" style={{ width: '200px', height: 'auto' }} />
      </div>
    </div>
  );
}
