// src/App.tsx
import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed initial state to false

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />

      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-[var(--sidebar-width-expanded)]' : 'md:ml-[var(--sidebar-width-collapsed)]'
        } ml-0 mt-16`}
      >
        <main className="p-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
            <p className="mt-4 text-gray-600">
              This is the main content area of your application.
            </p>
          </div>
        </main>

        <Footer isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
}

export default App;