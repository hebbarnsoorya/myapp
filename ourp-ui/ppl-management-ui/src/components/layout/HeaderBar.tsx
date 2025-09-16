import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, Globe, User, LogOut, Settings, MessageSquare, Home, BarChart3, Building2, Shield, Palette, Languages, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Dropdown from '@/components/ui/Dropdown';
import IconButton from '@/components/ui/IconButton';
import { useApp } from '@/store/AppContext';
import type { Language, Role, Theme, Org } from '@/types';


const HeaderBar: React.FC = () => {
const { state, dispatch } = useApp();
const navigate = useNavigate();


const switchTheme = (t: Theme) => dispatch({ type: 'SET_THEME', payload: t });
const switchLang = (l: Language) => dispatch({ type: 'SET_LANGUAGE', payload: l });
const switchRole = (r: Role) => dispatch({ type: 'SET_ROLE', payload: r });
const switchOrg = (o: Org) => dispatch({ type: 'SET_ORG', payload: o });
return (
<header className="fixed top-0 inset-x-0 h-[var(--header-height)] z-40 border-b bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
<div className="h-full container mx-auto px-4 flex items-center justify-between gap-4">
<div className="flex items-center gap-3">
<IconButton title="Toggle sidebar" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
<Menu className="h-5 w-5" />
</IconButton>
<div className="flex items-center gap-2">
<div className="h-9 w-9 rounded-xl brand-gradient shadow" />
<div className="font-bold text-lg tracking-tight">Endava Portal</div>
<Badge className="border-transparent bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">{state.org}</Badge>
</div>
</div>


<nav className="hidden md:flex items-center gap-3">
<NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive?"bg-zinc-900 text-white dark:bg-white dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>Dashboard</NavLink>
<NavLink to="/analytics" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive?"bg-zinc-900 text-white dark:bg-white dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>Analytics</NavLink>
<NavLink to="/messages" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive?"bg-zinc-900 text-white dark:bg-white dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>Messages</NavLink>
<Dropdown label={<span className="inline-flex items-center gap-2"><Users className="h-4 w-4"/> Directory</span>}>
<button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate('/people')}>People</button>
<button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate('/teams')}>Teams</button>
</Dropdown>
<Dropdown label={<span className="inline-flex items-center gap-2"><Settings className="h-4 w-4"/> More</span>}>
<button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate('/settings')}>Settings</button>
<button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate('/profile')}>Profile</button>
</Dropdown>
</nav>


<div className="flex items-center gap-2">
<IconButton title="Notifications">
<div className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-[10px] flex items-center justify-center bg-[var(--brand-accent)] text-zinc-900 font-bold">{state.notifications}</div>
<Bell className="h-5 w-5" />
</IconButton>
<Dropdown label={<span className="inline-flex items-center gap-2"><Globe className="h-4 w-4"/> <span className="uppercase">{state.language}</span></span>}>
{['en','es','fr','de','hi'].map(l => (
<button key={l} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left uppercase" onClick={()=>switchLang(l as any)}>{l}</button>
))}
</Dropdown>
<Dropdown label={<span className="inline-flex items-center gap-2"><Shield className="h-4 w-4"/> {state.role}</span>}>
{['Admin','Manager','Analyst','Viewer'].map(r => (
<button key={r} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>switchRole(r as any)}>{r}</button>
))}
</Dropdown>
<Dropdown label={<span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4"/> {state.org}</span>}>
{['Acme Corp','Globex','Initech','Umbrella'].map(o => (
<button key={o} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>switchOrg(o as any)}>{o}</button>
))}
</Dropdown>
<Dropdown label={<span className="inline-flex items-center gap-2"><Palette className="h-4 w-4"/> Theme</span>}>
{(['light','dark','system'] as const).map(t => (
<button key={t} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left capitalize" onClick={()=>switchTheme(t)}>{t}</button>
))}
</Dropdown>
<IconButton title="Profile"><User className="h-5 w-5" /></IconButton>
<IconButton title="Logout" onClick={()=>alert('Logged out.')}> <LogOut className="h-5 w-5" /> </IconButton>
<IconButton title="Switch Theme" onClick={()=>dispatch({ type: 'SET_THEME', payload: document.documentElement.classList.contains('dark') ? 'light':'dark' })}>
<Sun className="h-5 w-5 hidden dark:inline"/>
<Moon className="h-5 w-5 dark:hidden"/>
</IconButton>
</div>
</div>
</header>
);
};


export default HeaderBar;