Write-Output "=== Setting up ppl-management-ui React project with charts + store ==="

# ----------------------------
# Step 1: Install dependencies
# ----------------------------
npm install react-router-dom framer-motion lucide-react recharts clsx
npm install -D tailwindcss postcss autoprefixer sass
npm install -D jest @types/jest jest-environment-jsdom ts-jest babel-jest babel-preset-react-app `
  @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin `
  eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier prettier

# ----------------------------
# Step 2: Tailwind + Configs
# ----------------------------
npx tailwindcss init -p

@"
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,css,scss}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
"@ | Set-Content -Path "tailwind.config.ts" -Encoding UTF8

@"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"@ | Set-Content -Path "postcss.config.js" -Encoding UTF8

@"
module.exports = {
  root: true,
  env: { browser: true, es2022: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: { react: { version: 'detect' } },
};
"@ | Set-Content -Path ".eslintrc.cjs" -Encoding UTF8

@"
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
"@ | Set-Content -Path ".prettierrc" -Encoding UTF8

@"
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\\\.(css|scss)$': 'identity-obj-proxy'
  },
};
export default config;
"@ | Set-Content -Path "jest.config.ts" -Encoding UTF8

@"
import '@testing-library/jest-dom';
"@ | Set-Content -Path "setupTests.ts" -Encoding UTF8

# ----------------------------
# Step 3: Gitignore
# ----------------------------
@"
node_modules
dist
coverage
.vite
.DS_Store
.env*
"@ | Set-Content -Path ".gitignore" -Encoding UTF8

# ----------------------------
# Step 4: Create src/ structure
# ----------------------------
New-Item -ItemType Directory -Force -Path "src/components/layout" | Out-Null
New-Item -ItemType Directory -Force -Path "src/pages" | Out-Null
New-Item -ItemType Directory -Force -Path "src/store" | Out-Null
New-Item -ItemType Directory -Force -Path "src/styles" | Out-Null
New-Item -ItemType Directory -Force -Path "src/types" | Out-Null

# ----------------------------
# Step 5: Starter Files
# ----------------------------
# main.tsx
@"
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import App from './App';
import '@/styles/index.css';
import '@/styles/theme.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
"@ | Set-Content -Path "src/main.tsx" -Encoding UTF8

# App.tsx
@"
import React from 'react';
import HeaderBar from '@/components/layout/HeaderBar';
import Sidebar from '@/components/layout/Sidebar';
import FooterBar from '@/components/layout/FooterBar';
import { useApp } from '@/store/AppContext';
import AppRoutes from './routes';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100'>
      <HeaderBar />
      <Sidebar />
      <main
        className='container mx-auto px-4'
        style={{
          paddingTop: 'calc(var(--header-height) + 1rem)',
          paddingBottom: '2rem',
          marginLeft: state.sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)',
          transition: 'margin-left .3s',
        }}
      >
        {children}
      </main>
      <FooterBar />
    </div>
  );
};

const App: React.FC = () => <AppShell><AppRoutes /></AppShell>;
export default App;
"@ | Set-Content -Path "src/App.tsx" -Encoding UTF8

# routes.tsx
@"
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Messages = lazy(() => import('@/pages/Messages'));
const Settings = lazy(() => import('@/pages/Settings'));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<div className='p-6'>Loading…</div>}>
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='/messages' element={<Messages />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
"@ | Set-Content -Path "src/routes.tsx" -Encoding UTF8

# styles/index.css
@"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand-primary: #fc820f;
  --brand-accent: #fcfc0f;
  --header-height: 64px;
  --sidebar-width: 220px;
  --sidebar-width-collapsed: 60px;
}
.brand-gradient {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
}
"@ | Set-Content -Path "src/styles/index.css" -Encoding UTF8

# styles/theme.scss
@"
$brand-primary: #fc820f;
$brand-accent: #fcfc0f;

:root {
  --brand-primary: #{$brand-primary};
  --brand-accent: #{$brand-accent};
}
"@ | Set-Content -Path "src/styles/theme.scss" -Encoding UTF8

# ----------------------------
# Step 6: Store (Context + Reducer)
# ----------------------------
# types/index.ts
@"
export type Theme = 'light' | 'dark';
export interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: number;
}
export type AppAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_NOTIFICATIONS'; payload: number };
"@ | Set-Content -Path "src/types/index.ts" -Encoding UTF8

# store/appReducer.ts
@"
import type { AppAction, AppState } from '@/types';

export const initialState: AppState = {
  theme: 'light',
  sidebarOpen: true,
  notifications: 3,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    default:
      return state;
  }
}
"@ | Set-Content -Path "src/store/appReducer.ts" -Encoding UTF8

# store/AppContext.tsx
@"
import React, { createContext, useContext, useReducer } from 'react';
import { appReducer, initialState } from './appReducer';
import type { AppAction, AppState } from '@/types';

interface AppContextValue { state: AppState; dispatch: React.Dispatch<AppAction>; }
const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
"@ | Set-Content -Path "src/store/AppContext.tsx" -Encoding UTF8

# ----------------------------
# Step 7: Layout Components
# ----------------------------
# HeaderBar.tsx
@"
import React from 'react';
import { useApp } from '@/store/AppContext';

const HeaderBar: React.FC = () => {
  const { state, dispatch } = useApp();
  return (
    <header className='fixed top-0 inset-x-0 h-[var(--header-height)] border-b bg-white/80 backdrop-blur flex items-center justify-between px-4'>
      <div className='font-bold'>OurP UI</div>
      <div className='flex gap-4 items-center'>
        <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} className='px-2 py-1 border rounded'>
          {state.sidebarOpen ? 'Hide' : 'Show'} Sidebar
        </button>
        <span className='text-sm'>🔔 {state.notifications}</span>
      </div>
    </header>
  );
};
export default HeaderBar;
"@ | Set-Content -Path "src/components/layout/HeaderBar.tsx" -Encoding UTF8

# Sidebar.tsx
@"
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '@/store/AppContext';

const Sidebar: React.FC = () => {
  const { state } = useApp();
  return (
    <aside className={`fixed top-[var(--header-height)] left-0 bottom-0 border-r bg-white/80 backdrop-blur transition-all duration-300 ${state.sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-collapsed)]'}`}>
      <nav className='flex flex-col gap-3 p-3'>
        <NavLink to='/'>Dashboard</NavLink>
        <NavLink to='/analytics'>Analytics</NavLink>
        <NavLink to='/messages'>Messages</NavLink>
        <NavLink to='/settings'>Settings</NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
"@ | Set-Content -Path "src/components/layout/Sidebar.tsx" -Encoding UTF8

# FooterBar.tsx
@"
import React from 'react';

const FooterBar: React.FC = () => (
  <footer className='border-t bg-white/80 text-center py-2 mt-6'>
    © $(Get-Date -Format yyyy) OurP UI
  </footer>
);
export default FooterBar;
"@ | Set-Content -Path "src/components/layout/FooterBar.tsx" -Encoding UTF8

# ----------------------------
# Step 8: Pages (with Charts)
# ----------------------------
# Dashboard.tsx
@"
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`,
  value: Math.round(20 + Math.sin(i/3) * 15 + Math.random() * 10),
}));

const Dashboard: React.FC = () => (
  <div className='p-6'>
    <h1 className='text-xl font-bold mb-4'>Dashboard</h1>
    <div className='h-64 border rounded bg-white/60'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='hour' />
          <YAxis />
          <Tooltip />
          <Area type='monotone' dataKey='value' stroke='#fc820f' fill='#fc820f55' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
export default Dashboard;
"@ | Set-Content -Path "src/pages/Dashboard.tsx" -Encoding UTF8

# Analytics.tsx
@"
import React from 'react';
const Analytics: React.FC = () => (
  <div className='p-6'>
    <h1 className='text-xl font-bold mb-4'>Analytics</h1>
    <p>📊 Analytics page content here.</p>
  </div>
);
export default Analytics;
"@ | Set-Content -Path "src/pages/Analytics.tsx" -Encoding UTF8

# Messages.tsx
@"
import React from 'react';
const Messages: React.FC = () => (
  <div className='p-6'>
    <h1 className='text-xl font-bold mb-4'>Messages</h1>
    <ul className='list-disc pl-6'>
      <li>Welcome to the portal</li>
      <li>Your weekly report is ready</li>
      <li>Update your profile</li>
    </ul>
  </div>
);
export default Messages;
"@ | Set-Content -Path "src/pages/Messages.tsx" -Encoding UTF8

# Settings.tsx
@"
import React from 'react';
import { useApp } from '@/store/AppContext';

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>Settings</h1>
      <p>Theme: {state.theme}</p>
      <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })} className='px-3 py-2 border rounded mt-2'>
        Toggle Theme
      </button>
    </div>
  );
};
export default Settings;
"@ | Set-Content -Path "src/pages/Settings.tsx" -Encoding UTF8

Write-Output "=== ✅ Setup complete! ==="
Write-Output "Run 'npm run dev' and open http://localhost:5173 to see charts + store in action"
