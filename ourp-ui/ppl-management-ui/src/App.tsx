import React from 'react';
import HeaderBar from '@/components/layout/HeaderBar';
import Sidebar from '@/components/layout/Sidebar';
import FooterBar from '@/components/layout/FooterBar';
import { useApp } from '@/store/AppContext';
import AppRoutes from './routes';


const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const { state } = useApp();
return (
<div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
<HeaderBar />
<Sidebar />
<main
className="container mx-auto px-4"
style={{
paddingTop: 'calc(var(--header-height) + 1rem)',
paddingBottom: '2rem',
marginLeft: state.sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)',
transition: 'margin-left .3s',
}}
>
<div className="mb-4">
<div className="rounded-2xl border brand-gradient p-4 text-zinc-900">
<h1 className="text-xl font-semibold">Welcome back</h1>
<p className="opacity-80">You are signed in as <strong>{state.role}</strong> at <strong>{state.org}</strong>.</p>
</div>
</div>
{children}
</main>
<FooterBar />
</div>
);
};


const App: React.FC = () => {
return (
<AppShell>
<AppRoutes />
</AppShell>
);
};


export default App;
