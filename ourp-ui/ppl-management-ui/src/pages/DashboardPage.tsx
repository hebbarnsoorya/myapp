import React from 'react';
import Badge from '@/components/ui/Badge';
import { useApp } from '@/store/AppContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';


const BRAND = { primary: '#fc820f', accent: '#fcfc0f' };
const sampleData = Array.from({ length: 24 }).map((_, i) => ({ hour: `${i}:00`, value: Math.round(40 + Math.sin(i/2)*30 + Math.random()*10) }));


const DashboardPage: React.FC = () => {
const { state } = useApp();
return (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="lg:col-span-2 p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<div className="flex items-center justify-between mb-3">
<h2 className="text-lg font-semibold">Realtime KPI</h2>
<Badge className="bg-[var(--brand-primary)]/10 border-transparent text-[var(--brand-primary)]">{state.org}</Badge>
</div>
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={sampleData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
<defs>
<linearGradient id="colorKpi" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stopColor={BRAND.primary} stopOpacity={0.8}/>
<stop offset="100%" stopColor={BRAND.accent} stopOpacity={0.1}/>
</linearGradient>
</defs>
<XAxis dataKey="hour"/>
<YAxis/>
<CartesianGrid strokeDasharray="3 3" />
<Tooltip />
<Area type="monotone" dataKey="value" stroke={BRAND.primary} fill="url(#colorKpi)" strokeWidth={2} />
</AreaChart>
</ResponsiveContainer>
</div>
</div>
<div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<h2 className="text-lg font-semibold mb-3">Alerts</h2>
<ul className="space-y-2">
{['High latency','Deployment succeeded','New message from Ops'].map((t, i) => (
<li key={i} className="flex items-center gap-2 p-2 rounded-xl border hover:bg-zinc-100 dark:hover:bg-zinc-800">
<span className={`h-2.5 w-2.5 rounded-full ${i===0?'bg-red-500':i===1?'bg-green-500':'bg-yellow-500'}`}></span>
<span className="truncate">{t}</span>
</li>
))}
</ul>
</div>


<div className="lg:col-span-3 p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<h2 className="text-lg font-semibold mb-3">Trend</h2>
<div className="h-72">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={sampleData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="hour" />
<YAxis />
<Tooltip />
<Line type="monotone" dataKey="value" stroke={BRAND.primary} strokeWidth={2} dot={false} />
</LineChart>
</ResponsiveContainer>
</div>
</div>
</div>
);
};


export default DashboardPage;