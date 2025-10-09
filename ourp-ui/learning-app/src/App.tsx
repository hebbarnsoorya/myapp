// src/App.jsx
import { useState } from 'react';
import Header from './components/Header.tsx';
import LeftNav from './components/LeftNav';
import Footer from './components/Footer';
import MainContent from './components/MainContent';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleNav={toggleNav} />
      <div className="flex flex-1">
        <LeftNav isOpen={isNavOpen} />
        <MainContent />
      </div>
      <Footer />
    </div>
  );
}

export default App;