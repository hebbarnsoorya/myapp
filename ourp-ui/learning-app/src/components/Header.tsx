// src/components/Header.tsx
import React, { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
//import { Menu, X, Bell, User, Cog, ChevronDown } from 'lucide-react';


interface HeaderProps {
  toggleNav: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleNav }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow-md text-neutral-dark">
      {/* Left Section: Logo & Org Name */}
      <div className="flex items-center gap-4">
        <button onClick={toggleNav} className="p-2 rounded-md hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          {/* ... */}
        </div>
      </div>

      {/* Middle Section: Menu Items */}
      <nav className="hidden md:flex items-center space-x-6">
        {/* ... */}
        <div className="relative">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center font-semibold text-gray-700 hover:text-primary-500 transition-colors">
            Services
            <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Service 1</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Service 2</a>
            </div>
          )}
        </div>
      </nav>

      {/* Right Section: User Actions */}
      <div className="flex items-center space-x-4">
        {/* ... */}
      </div>
    </header>
  );
};

export default Header;