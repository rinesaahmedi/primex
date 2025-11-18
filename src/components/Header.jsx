import React from 'react';

const Header = ({ darkMode, toggleDarkMode, changeLanguage }) => {
  return (
    <header className={`w-full ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} py-4`}>
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Left: Logo */}
        <div className="text-3xl font-bold">
          <a href="/">Logo</a>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex space-x-6 items-center">
          <a href="#about" className="hover:text-blue-600">About Us</a>
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#partners" className="hover:text-blue-600">Our Partners</a>
          <a href="#contact" className="hover:text-blue-600">Contact Us</a>

          {/* Language Switcher */}
          <select onChange={changeLanguage} className="bg-transparent border p-2 rounded-md">
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            {/* Add more languages as needed */}
          </select>

          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
