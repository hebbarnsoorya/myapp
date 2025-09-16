import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { useApp } from '@/store/AppContext';


const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }>
= ({ to, icon, label }) => (
<NavLink
to={to}
className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
>
<span className="shrink-0">{icon}</span>
<span className="truncate">{label}</span>
</NavLink>
);


const Sidebar: React.FC = () => {
const { state } = useApp();
return (
<aside
className={`fixed z-30 top-[var(--header-height)] bottom-0 left-0 border-r bg-white/70 dark:bg-zinc-900/60 backdrop-blur transition-[width] duration-300 overflow-hidden ${state.sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-collapsed)]'}`}
>
<div className="h-full flex flex-col gap-3 p-3">
<NavItem to="/" icon={<Home className="h-5 w-5"/>} label="Home" />
<NavItem to="/analytics" icon={<BarChart3 className="h-5 w-5"/>} label="Analytics" />
<NavItem to="/messages" icon={<MessageSquare className="h-5 w-5"/>} label="Messages" />
<NavItem to="/settings" icon={<Settings className="h-5 w-5"/>} label="Settings" />
</div>
</aside>
);
};


export default Sidebar;