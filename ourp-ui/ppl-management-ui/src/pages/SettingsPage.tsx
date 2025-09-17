import React from 'react';
import { useApp } from '@/store/AppContext';


const SettingsPage: React.FC = () => {
const { state } = useApp();
return (
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
<div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<h2 className="text-lg font-semibold mb-2">Profile</h2>
<div className="grid gap-3">
<label className="grid gap-1 text-sm">
<span>Name</span>
<input defaultValue="Alex Developer" className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-800"/>
</label>
<label className="grid gap-1 text-sm">
<span>Email</span>
<input defaultValue="alex@company.com" className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-800"/>
</label>
<button className="justify-self-start px-3 py-2 rounded-xl border brand-gradient text-zinc-900 font-semibold">Save</button>
</div>
</div>


<div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<h2 className="text-lg font-semibold mb-2">Preferences</h2>
<ul className="space-y-2 text-sm">
<li className="flex items-center justify-between p-2 rounded-xl border"><span>Theme</span><span className="capitalize">{state.theme}</span></li>
<li className="flex items-center justify-between p-2 rounded-xl border"><span>Language</span><span className="uppercase">{state.language}</span></li>
<li className="flex items-center justify-between p-2 rounded-xl border"><span>Role</span><span>{state.role}</span></li>
<li className="flex items-center justify-between p-2 rounded-xl border"><span>Org</span><span>{state.org}</span></li>
</ul>
</div>
</div>
);
};


export default SettingsPage;