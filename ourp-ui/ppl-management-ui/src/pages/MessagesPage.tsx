import React, { useEffect } from 'react';
import { useApp } from '@/store/AppContext';


const MessagesPage: React.FC = () => {
const { state, dispatch } = useApp();
useEffect(() => { if (state.messages > 0) dispatch({ type: 'SET_MESSAGES', payload: 0 }); }, []);
return (
<div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
<h2 className="text-lg font-semibold mb-3">Messages</h2>
<div className="space-y-2">
{['Welcome to the portal','Your weekly report is ready','Update your profile'].map((m, i) => (
<div key={i} className="p-3 rounded-xl border hover:bg-zinc-100 dark:hover:bg-zinc-800">{m}</div>
))}
</div>
</div>
);
};


export default MessagesPage;