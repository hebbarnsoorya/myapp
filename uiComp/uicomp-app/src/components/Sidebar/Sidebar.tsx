// src/components/Sidebar/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isOpen ? 'w-[var(--sidebar-width-expanded)]' : 'md:w-[var(--sidebar-width-collapsed)]'}
        w-[var(--sidebar-width-expanded)]
      `}
    >
      <div className="flex items-center justify-center h-16 bg-gray-900">
        {/* Only show the full logo when the sidebar is open */}
        {isOpen && (
          <img
            src="http://googleusercontent.com/image_collection/image_retrieval/6774192837850646127_0"
            alt="App Logo"
            className="h-10 transition-opacity duration-300"
          />
        )}
        {/* Only show the short logo when the sidebar is not open */}
        {!isOpen && (
          <img
            src="http://googleusercontent.com/image_collection/image_retrieval/17733248895156120188_0"
            alt="App Logo"
            className="h-10 transition-opacity duration-300"
          />
        )}
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
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;