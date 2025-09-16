import React from 'react';


const IconButton: React.FC<{ onClick?: () => void; title?: string; children: React.ReactNode; className?: string }> = ({ onClick, title, children, className }) => (
<button
onClick={onClick}
title={title}
className={`relative p-2 rounded-2xl hover:opacity-90 transition shadow-sm border bg-white/70 dark:bg-zinc-800/60 backdrop-blur ${className || ''}`}
>
{children}
</button>
);


export default IconButton;