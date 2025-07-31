// src/components/Footer/Footer.tsx
import React from 'react';

interface FooterProps {
    isSidebarOpen: boolean;
}

const Footer: React.FC<FooterProps> = ({ isSidebarOpen }) => {
  const footerWidth = isSidebarOpen
    ? 'md:w-[calc(100%-var(--sidebar-width-expanded))]'
    : 'md:w-[calc(100%-var(--sidebar-width-collapsed))]';

  const footerLeft = isSidebarOpen
    ? 'md:left-[var(--sidebar-width-expanded)]'
    : 'md:left-[var(--sidebar-width-collapsed)]';

  return (
    <footer
      className={`fixed bottom-0 z-40 p-4 text-center bg-gray-100 text-gray-600 transition-all duration-300 ease-in-out
        ${footerLeft} ${footerWidth}
        left-0 w-full`}
    >
      © {new Date().getFullYear()} My Company. All rights reserved.
    </footer>
  );
};

export default Footer;