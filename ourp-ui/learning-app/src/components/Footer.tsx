// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 bg-white shadow-inner mt-auto text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} My Organization. All rights reserved.
    </footer>
  );
};

export default Footer;