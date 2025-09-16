import React from 'react';
import { Languages } from 'lucide-react';


const FooterBar: React.FC = () => (
<footer className="border-t bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
<div className="container mx-auto px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
<span>© {new Date().getFullYear()} Endava • All rights reserved.</span>
<span className="inline-flex items-center gap-2"><Languages className="h-4 w-4"/> Multi-language ready</span>
</div>
</footer>
);


export default FooterBar;