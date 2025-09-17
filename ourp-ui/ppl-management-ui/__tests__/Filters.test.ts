import { applyFilters } from '@/lib/filters';


test('filters by query and segment', () => {
const rows = [
{ id: 1, name: 'Alpha One', segment: 'alpha', value: 1, date: '2025-01-01' },
{ id: 2, name: 'Beta Two', segment: 'beta', value: 2, date: '2025-01-02' }
];
expect(applyFilters(rows, 'alpha', 'all')).toHaveLength(1);
expect(applyFilters(rows, '', 'beta')).toHaveLength(1);
});