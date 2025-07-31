// src/components/Header/Header.tsx
import React, { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // A function to close all dropdowns, useful for a clean UI
  const closeAllDropdowns = () => {
    setIsProfileDropdownOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsAlertsOpen(false);
  };

  const handleDropdownToggle = (dropdown: string) => {
    closeAllDropdowns();
    if (dropdown === 'profile') setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (dropdown === 'notifications') setIsNotificationsOpen(!isNotificationsOpen);
    if (dropdown === 'messages') setIsMessagesOpen(!isMessagesOpen);
    if (dropdown === 'alerts') setIsAlertsOpen(!isAlertsOpen);
  };

  const headerWidth = isSidebarOpen
    ? 'md:w-[calc(100%-var(--sidebar-width-expanded))]'
    : 'md:w-[calc(100%-var(--sidebar-width-collapsed))]';

  const headerLeft = isSidebarOpen
    ? 'md:left-[var(--sidebar-width-expanded)]'
    : 'md:left-[var(--sidebar-width-collapsed)]';

  return (
    <header
      className={`fixed top-0 z-50 flex items-center justify-between h-16 px-4 bg-white shadow-md transition-all duration-300 ease-in-out
        ${headerLeft} ${headerWidth}
        left-0 w-full`}
    >
      {/* Left side of the header */}
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="text-gray-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <img src="http://googleusercontent.com/image_collection/image_retrieval/6774192837850646127_0" alt="App Logo" className="h-8" />
      </div>

      {/* Center content (Search bar) */}
      <div className="relative flex-1 max-w-lg hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
      </div>

      {/* Right-hand side menu with dropdowns */}
      <div className="flex items-center space-x-4 relative">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button onClick={() => handleDropdownToggle('notifications')} className="text-gray-600 focus:outline-none relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405C18.895 14.895 19 14.2 19 13v-3a6 6 0 00-6-6H9a6 6 0 00-6 6v3c0 1.2.105 1.895.405 2.595L2 17h5m-2 0h14a2 2 0 002-2v-3a8 8 0 00-8-8H9a8 8 0 00-8 8v3a2 2 0 002 2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <span className="block px-4 py-2 text-gray-700 font-semibold">Notifications</span>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                You have 3 new notifications.
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                View All
              </a>
            </div>
          )}
        </div>

        {/* Messages Dropdown */}
        <div className="relative">
          <button onClick={() => handleDropdownToggle('messages')} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
            </svg>
          </button>
          {isMessagesOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <span className="block px-4 py-2 text-gray-700 font-semibold">Messages</span>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                You have 1 new message.
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                View All
              </a>
            </div>
          )}
        </div>

        {/* Alerts Dropdown */}
        <div className="relative">
          <button onClick={() => handleDropdownToggle('alerts')} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </button>
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <span className="block px-4 py-2 text-gray-700 font-semibold">Alerts</span>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                No new alerts.
              </a>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button onClick={() => handleDropdownToggle('profile')} className="flex items-center space-x-2 focus:outline-none">
            <img
              src="http://googleusercontent.com/image_collection/image_retrieval/16284323225662736436_0"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="hidden md:block text-gray-800">John Doe</span>
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <div className="border-t border-gray-200"></div>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Switch User Role
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Switch Theme
              </a>
              <div className="border-t border-gray-200"></div>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;