import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ darkMode, toggleDarkMode, changeLanguage }) => {
  const { t } = useTranslation();

  return (
    <header className={`w-full ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} py-4`}>
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Left: Logo */}
        <div className="text-3xl font-bold">
          <a href="/">Logo</a>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex space-x-6 items-center">
          <a href="#about" className="hover:text-blue-600">{t('aboutUs')}</a>
          <a href="#services" className="hover:text-blue-600">{t('services')}</a>
          <a href="#partners" className="hover:text-blue-600">{t('ourPartners')}</a>
          <a href="#contact" className="hover:text-blue-600">{t('contactUs')}</a>

          {/* Language Switcher */}
          <select onChange={changeLanguage} className="bg-transparent border p-2 rounded-md">
            <option value="en">{t('english')}</option>
            <option value="de">{t('german')}</option>
            {/* Add more languages as needed */}
          </select>

          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {darkMode ? t('lightMode') : t('darkMode')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;