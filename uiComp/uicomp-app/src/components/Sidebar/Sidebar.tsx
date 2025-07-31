// src/components/Sidebar/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'md:w-[var(--sidebar-width-expanded)]' : 'md:w-[var(--sidebar-width-collapsed)]'
      } w-0 md:w-20`}
    >
      <div className="flex items-center justify-center h-16 bg-gray-900">
        {/* Full logo for expanded state */}
        <img
          src="http://googleusercontent.com/image_collection/image_retrieval/6774192837850646127_0"
          alt="App Logo"
          className={`h-10 transition-opacity duration-300 ${isOpen ? 'block' : 'hidden'}`}
        />
        {/* Rounded logo for collapsed state */}
        <img
          src="http://googleusercontent.com/image_collection/image_retrieval/17733248895156120188_0"
          alt="App Logo"
          className={`h-10 transition-opacity duration-300 ${isOpen ? 'hidden' : 'block'}`}
        />
      </div>
      <nav className="mt-8">
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <a href="#" className="flex items-center space-x-2">
              <img src="http://googleusercontent.com/image_collection/image_retrieval/16509987821602364881_0" alt="Dashboard" className="h-6 w-6" />
              <span className={`text-sm ${isOpen ? 'block' : 'hidden'}`}>
                Dashboard
              </span>
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#" className="flex items-center space-x-2">
              <img src="http://googleusercontent.com/image_collection/image_retrieval/5821238267358812215_0" alt="Settings" className="h-6 w-6" />
              <span className={`text-sm ${isOpen ? 'block' : 'hidden'}`}>
                Settings
              </span>
            </a>
          </li>
          {/* Add more menu items here */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;