export type RecordRow = { id: number; name: string; segment: string; value: number; date: string };


export function applyFilters(rows: RecordRow[], query: string, segment: string) {
const q = query.trim().toLowerCase();
return rows.filter(
(r) => (segment === 'all' || r.segment === segment) && (q === '' || r.name.toLowerCase().includes(q)),
);
}