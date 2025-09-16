import React from 'react';


const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className || ''}`}>{children}</span>
);


export default Badge;