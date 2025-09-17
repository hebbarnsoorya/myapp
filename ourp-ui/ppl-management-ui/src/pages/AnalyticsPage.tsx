import React, { useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import type { RecordRow } from '@/lib/filters';
import { applyFilters } from '@/lib/filters';
import Badge from '@/components/ui/Badge';


const AnalyticsPage: React.FC = () => {
const [query, setQuery] = useState('');
const [segment, setSegment] = useState('all');
const debounced = useDebounce(query, 300);
const rows: RecordRow[] = useMemo(() => (
Array.from({ length: 50 }).map((_, i) => ({
id: i+1,
name: `Record ${i+1}`,
segment: ['alpha','beta','gamma'][i%3],
value: Math.round(Math.random()*1000),
date: new Date(Date.now() - i*86400000).toISOString().slice(0,10)
}))
), []);


const filtered = useMemo(() => applyFilters(rows, debounced, segment), [rows, debounced, segment]);


return (
<div className="space-y-4">
<div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name…" className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-800"/>
<select value={segment} onChange={e=>setSegment(e.target.value)} className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-800">
<option value="all">All segments</option>
<option value="alpha">alpha</option>
<option value="beta">beta</option>
<option value="gamma">gamma</option>
</select>
<button className="px-3 py-2 rounded-xl border brand-gradient text-zinc-900 font-semibold">Export CSV</button>
</div>
</div>


<div className="overflow-x-auto rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<table className="min-w-full text-sm">
<thead className="text-left">
<tr className="border-b">
{['ID','Name','Segment','Value','Date'].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
</tr>
</thead>
<tbody>
{filtered.map(r => (
<tr key={r.id} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-800">
<td className="px-4 py-3">{r.id}</td>
<td className="px-4 py-3">{r.name}</td>
<td className="px-4 py-3"><Badge className="border-transparent bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">{r.segment}</Badge></td>
<td className="px-4 py-3">{r.value.toLocaleString()}</td>
<td className="px-4 py-3">{r.date}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
};


export default AnalyticsPage;