import React from 'react';
import Badge from '@/components/ui/Badge';
import { useApp } from '@/store/AppContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
const data = Array.from({ length: 24 }).map((_, i) => ({
  hour: ${i}:00,
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
