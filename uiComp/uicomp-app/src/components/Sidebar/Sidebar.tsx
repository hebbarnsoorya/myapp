// src/components/Sidebar/Sidebar.tsx
import React, { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toggleToolsMenu = () => {
    setIsToolsOpen(!isToolsOpen);
  };

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
        {isOpen && (
          <img
            src="http://googleusercontent.com/image_collection/image_retrieval/6774192837850646127_0"
            alt="App Logo"
            className="h-10 transition-opacity duration-300"
          />
        )}
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

          {/* New Nested Menu: Tools */}
          <li className="hover:bg-gray-700">
            <div
              onClick={toggleToolsMenu}
              className="p-4 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="material-icons text-white">build</span>
                <span className={`text-sm ${isOpen ? 'block' : 'hidden'}`}>
                  Tools
                </span>
              </div>
              <svg
                className={`h-5 w-5 text-white transition-transform duration-300 ${isToolsOpen ? 'rotate-90' : ''} ${isOpen ? 'block' : 'hidden'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            {isToolsOpen && isOpen && (
              <ul className="bg-gray-700">
                <li className="p-4 hover:bg-gray-600">
                  <a href="/buttons" className="block text-sm ml-6">Buttons</a>
                </li>
                <li className="p-4 hover:bg-gray-600">
                  <a href="/inputs" className="block text-sm ml-6">Inputs</a>
                </li>
                <li className="p-4 hover:bg-gray-600">
                  <a href="/dropdown" className="block text-sm ml-6">Dropdown</a>
                </li>
                <li className="p-4 hover:bg-gray-600">
                  <a href="/reports" className="block text-sm ml-6">Reports</a>
                </li>
                <li className="p-4 hover:bg-gray-600">
                  <a href="/cards" className="block text-sm ml-6">Cards</a>
                </li>
                <li className="p-4 hover:bg-gray-600">
                  <a href="/charts" className="block text-sm ml-6">Charts</a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;