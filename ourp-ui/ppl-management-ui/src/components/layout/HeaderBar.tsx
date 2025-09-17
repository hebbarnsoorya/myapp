import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '@/store/AppContext';

const HeaderBar: React.FC = () => {
  const { state, dispatch } = useApp();

  return (
    <header className="fixed top-0 inset-x-0 h-[var(--header-height)] border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="px-3 py-1 rounded bg-[var(--brand-primary)] text-white hover:opacity-90 transition"
        >
          {state.sidebarOpen ? '☰ Collapse' : '☰ Expand'}
        </button>
        <span className="font-bold text-lg">OurP UI</span>
      </div>

      {/* Middle Navigation */}
      <nav className="hidden md:flex gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `hover:text-[var(--brand-primary)] ${
              isActive ? 'font-bold text-[var(--brand-primary)]' : ''
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `hover:text-[var(--brand-primary)] ${
              isActive ? 'font-bold text-[var(--brand-primary)]' : ''
            }`
          }
        >
          Analytics
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `hover:text-[var(--brand-primary)] ${
              isActive ? 'font-bold text-[var(--brand-primary)]' : ''
            }`
          }
        >
          Messages
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `hover:text-[var(--brand-primary)] ${
              isActive ? 'font-bold text-[var(--brand-primary)]' : ''
            }`
          }
        >
          Settings
        </NavLink>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <span className="relative">
          🔔
          {state.notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--brand-accent)] text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
              {state.notifications}
            </span>
          )}
        </span>
        <button
          onClick={() =>
            dispatch({
              type: 'SET_THEME',
              payload: state.theme === 'light' ? 'dark' : 'light',
            })
          }
          className="px-3 py-1 rounded border"
        >
          {state.theme === 'light' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
