import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';


const Dropdown: React.FC<{ label: React.ReactNode; children: React.ReactNode; align?: 'left' | 'right' }>
= ({ label, children, align = 'right' }) => {
const [open, setOpen] = useState(false);
const ref = useRef<HTMLDivElement>(null);
useEffect(() => {
const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
document.addEventListener('click', onClick);
return () => document.removeEventListener('click', onClick);
}, []);
return (
<div ref={ref} className="relative">
<button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 px-3 py-2 rounded-xl border bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800">
{label}
<ChevronDown className="h-4 w-4" />
</button>
<AnimatePresence>
{open && (
<motion.div
initial={{ opacity: 0, y: -4 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -4 }}
className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-xl border bg-white dark:bg-zinc-900 shadow-xl p-2 grid gap-1`}
>
{children}
</motion.div>
)}
</AnimatePresence>
</div>
);
};


export default Dropdown;