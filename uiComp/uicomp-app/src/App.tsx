// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Buttons from './pages/Buttons';
import Inputs from './pages/Inputs';
import Dropdown from './pages/Dropdown';
import Reports from './pages/Reports';
import Cards from './pages/Cards';
import Charts from './pages/Charts';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/inputs" element={<Inputs />} />
          <Route path="/dropdown" element={<Dropdown />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;