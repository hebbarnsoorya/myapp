import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, Sun, Moon, Globe, User, LogOut, ChevronDown, Settings, MessageSquare, Home, BarChart3, Building2, Shield, Palette, Languages, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";

// =============================================
// THEME & BRANDING
// =============================================
// Primary palette requested: #fc820f (primary) and #fcfc0f (accent). We'll generate
// accessible variants via CSS variables and allow theme switching (light/dark/system).

const BRAND = {
  primary: "#fc820f",
  accent: "#fcfc0f",
};

// Utility to clamp color contrast using CSS variables
const ThemeStyle: React.FC = () => (
  <style>{`
    :root {
      --brand-primary: ${BRAND.primary};
      --brand-accent: ${BRAND.accent};
      --header-height: 64px;
      --sidebar-width: 280px;
      --sidebar-width-collapsed: 80px;
      --radius: 1rem;
    }
    .brand-gradient { background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent)); }
  `}</style>
);

// =============================================
// TYPES
// =============================================

type Theme = "light" | "dark" | "system";

type Language = "en" | "es" | "fr" | "de" | "hi";

type Role = "Admin" | "Manager" | "Analyst" | "Viewer";

type Org = "Acme Corp" | "Globex" | "Initech" | "Umbrella";

interface AppState {
  theme: Theme;
  language: Language;
  role: Role;
  org: Org;
  sidebarOpen: boolean;
  notifications: number;
  messages: number;
}

type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_ROLE"; payload: Role }
  | { type: "SET_ORG"; payload: Org }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: boolean }
  | { type: "SET_NOTIFICATIONS"; payload: number }
  | { type: "SET_MESSAGES"; payload: number };

// =============================================
// PERSISTENCE HOOKS
// =============================================

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// =============================================
// REDUCER + CONTEXT
// =============================================

const initialState: AppState = {
  theme: "system",
  language: "en",
  role: "Analyst",
  org: "Acme Corp",
  sidebarOpen: true,
  notifications: 3,
  messages: 1,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_ORG":
      return { ...state, org: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useLocalStorage<AppState>("app-state", initialState);
  const [state, dispatch] = useReducer(appReducer, persisted);

  // Persist to localStorage on every change.
  useEffect(() => setPersisted(state), [state, setPersisted]);

  // Apply theme to document.
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode = state.theme === "system" ? (prefersDark ? "dark" : "light") : state.theme;
    root.classList.toggle("dark", mode === "dark");
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// =============================================
// API CLIENT (Fetch with Interceptors)
// =============================================

type RequestInterceptor = (input: RequestInfo, init?: RequestInit) => Promise<[RequestInfo, RequestInit?]>;

type ResponseInterceptor = (response: Response) => Promise<Response>;

class ApiClient {
  baseUrl: string;
  requestInterceptors: RequestInterceptor[] = [];
  responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseUrl = "/api") { this.baseUrl = baseUrl; }

  useRequest(interceptor: RequestInterceptor) { this.requestInterceptors.push(interceptor); }
  useResponse(interceptor: ResponseInterceptor) { this.responseInterceptors.push(interceptor); }

  async request(path: string, init: RequestInit = {}) {
    let input: RequestInfo = this.baseUrl + path;
    let config: RequestInit = { headers: { "Content-Type": "application/json" }, ...init };

    for (const i of this.requestInterceptors) {
      [input, config] = await i(input, config);
    }

    const res = await fetch(input, config);
    let intercepted = res;
    for (const i of this.responseInterceptors) {
      intercepted = await i(intercepted);
    }
    return intercepted;
  }

  get<T>(path: string) { return this.request(path).then(r => r.json() as Promise<T>); }
}

const api = new ApiClient("/api");

// Example interceptors: auth token + error logging
api.useRequest(async (input, init) => {
  const token = localStorage.getItem("token");
  return [input, { ...init, headers: { ...(init?.headers || {}), Authorization: token ? `Bearer ${token}` : "" } }];
});
api.useResponse(async (res) => {
  if (!res.ok) {
    console.error("API error", res.status, res.statusText);
  }
  return res;
});

// =============================================
// UTIL: FILTERS
// =============================================

type RecordRow = { id: number; name: string; segment: string; value: number; date: string };

function applyFilters(rows: RecordRow[], query: string, segment: string) {
  const q = query.trim().toLowerCase();
  return rows.filter(r =>
    (segment === "all" || r.segment === segment) &&
    (q === "" || r.name.toLowerCase().includes(q))
  );
}

// =============================================
// REUSABLE UI COMPONENTS
// =============================================

const Badge: React.FC<{ children: React.ReactNode; className?: string }>
= ({ children, className }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className || ""}`}>{children}</span>
);

const IconButton: React.FC<{ onClick?: () => void; title?: string; children: React.ReactNode; className?: string }>
= ({ onClick, title, children, className }) => (
  <button
    onClick={onClick}
    title={title}
    className={`relative p-2 rounded-2xl hover:opacity-90 transition shadow-sm border bg-white/70 dark:bg-zinc-800/60 backdrop-blur ${className || ""}`}
  >{children}</button>
);

const Dropdown: React.FC<{ label: React.ReactNode; children: React.ReactNode; align?: "left" | "right" }>
= ({ label, children, align = "right" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-1 px-3 py-2 rounded-xl border bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-56 rounded-xl border bg-white dark:bg-zinc-900 shadow-xl p-2 grid gap-1`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }>
= ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
  >
    <span className="shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </NavLink>
);

// =============================================
// HEADER
// =============================================

const HeaderBar: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const switchTheme = (t: Theme) => dispatch({ type: "SET_THEME", payload: t });
  const switchLang = (l: Language) => dispatch({ type: "SET_LANGUAGE", payload: l });
  const switchRole = (r: Role) => dispatch({ type: "SET_ROLE", payload: r });
  const switchOrg = (o: Org) => dispatch({ type: "SET_ORG", payload: o });

  return (
    <header className="fixed top-0 inset-x-0 h-[var(--header-height)] z-40 border-b bg-white/70 dark:bg-zinc-900/60 backdrop-blur"> 
      <div className="h-full container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Left: Burger + Logo + Org */}
        <div className="flex items-center gap-3">
          <IconButton title="Toggle sidebar" onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}>
            <Menu className="h-5 w-5" />
          </IconButton>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl brand-gradient shadow" />
            <div className="font-bold text-lg tracking-tight">Endava Portal</div>
            <Badge className="border-transparent bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">{state.org}</Badge>
          </div>
        </div>

        {/* Middle: Menus (some dropdown, some direct) */}
        <nav className="hidden md:flex items-center gap-3">
          <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive?"bg-zinc-900 text-white dark:bg-white dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>Dashboard</NavLink>
          <NavLink to="/analytics" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive?"bg-zinc-900 text-white dark:bg-white dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>Analytics</NavLink>
          <NavLink to="/messages" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive?"bg-zinc-900 text-white dark:bg-white dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>Messages</NavLink>
          <Dropdown label={<span className="inline-flex items-center gap-2"><Users className="h-4 w-4"/> Directory</span>}>
            <button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate("/people")}>
              People
            </button>
            <button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate("/teams")}>
              Teams
            </button>
          </Dropdown>
          <Dropdown label={<span className="inline-flex items-center gap-2"><Settings className="h-4 w-4"/> More</span>}>
            <button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate("/settings")}>
              Settings
            </button>
            <button className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>navigate("/profile")}>
              Profile
            </button>
          </Dropdown>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <IconButton title="Notifications">
            <div className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-[10px] flex items-center justify-center bg-[var(--brand-accent)] text-zinc-900 font-bold">{state.notifications}</div>
            <Bell className="h-5 w-5" />
          </IconButton>
          <Dropdown label={<span className="inline-flex items-center gap-2"><Globe className="h-4 w-4"/> <span className="uppercase">{state.language}</span></span>}>
            {["en","es","fr","de","hi"].map(l => (
              <button key={l} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left uppercase" onClick={()=>switchLang(l as Language)}>{l}</button>
            ))}
          </Dropdown>
          <Dropdown label={<span className="inline-flex items-center gap-2"><Shield className="h-4 w-4"/> {state.role}</span>}>
            {["Admin","Manager","Analyst","Viewer"].map(r => (
              <button key={r} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>switchRole(r as Role)}>{r}</button>
            ))}
          </Dropdown>
          <Dropdown label={<span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4"/> {state.org}</span>}>
            {["Acme Corp","Globex","Initech","Umbrella"].map(o => (
              <button key={o} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left" onClick={()=>switchOrg(o as Org)}>{o}</button>
            ))}
          </Dropdown>
          <Dropdown label={<span className="inline-flex items-center gap-2"><Palette className="h-4 w-4"/> Theme</span>}>
            {(["light","dark","system"] as Theme[]).map(t => (
              <button key={t} className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left capitalize" onClick={()=>switchTheme(t)}>{t}</button>
            ))}
          </Dropdown>
          <IconButton title="Profile">
            <User className="h-5 w-5" />
          </IconButton>
          <IconButton title="Logout" onClick={()=>alert("Logged out.")}> 
            <LogOut className="h-5 w-5" />
          </IconButton>
          <IconButton title="Switch Theme" onClick={()=>dispatch({ type: "SET_THEME", payload: document.documentElement.classList.contains('dark') ? 'light':'dark' })}>
            <Sun className="h-5 w-5 hidden dark:inline"/>
            <Moon className="h-5 w-5 dark:hidden"/>
          </IconButton>
        </div>
      </div>
    </header>
  );
};

// =============================================
// SIDEBAR
// =============================================

const Sidebar: React.FC = () => {
  const { state } = useApp();
  return (
    <aside
      className={`fixed z-30 top-[var(--header-height)] bottom-0 left-0 border-r bg-white/70 dark:bg-zinc-900/60 backdrop-blur transition-[width] duration-300 overflow-hidden ${state.sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-collapsed)]'}`}
    >
      <div className="h-full flex flex-col gap-3 p-3">
        <NavItem to="/" icon={<Home className="h-5 w-5"/>} label="Home" />
        <NavItem to="/analytics" icon={<BarChart3 className="h-5 w-5"/>} label="Analytics" />
        <NavItem to="/messages" icon={<MessageSquare className="h-5 w-5"/>} label="Messages" />
        <NavItem to="/settings" icon={<Settings className="h-5 w-5"/>} label="Settings" />
      </div>
    </aside>
  );
};

// =============================================
// FOOTER
// =============================================

const FooterBar: React.FC = () => (
  <footer className="border-t bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
    <div className="container mx-auto px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
      <span>© {new Date().getFullYear()} Endava • All rights reserved.</span>
      <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4"/> Multi-language ready</span>
    </div>
  </footer>
);

// =============================================
// PAGES
// =============================================

const sampleData = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`, value: Math.round(40 + Math.sin(i/2)*30 + Math.random()*10)
}));

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
          {["High latency","Deployment succeeded","New message from Ops"].map((t, i) => (
            <li key={i} className="flex items-center gap-2 p-2 rounded-xl border hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <span className={`h-2.5 w-2.5 rounded-full ${i===0?"bg-red-500":i===1?"bg-green-500":"bg-yellow-500"}`}></span>
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

const AnalyticsPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const debounced = useDebounce(query, 300);
  const rows: RecordRow[] = useMemo(() => (
    Array.from({ length: 50 }).map((_, i) => ({
      id: i+1,
      name: `Record ${i+1}`,
      segment: ["alpha","beta","gamma"][i%3],
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

const MessagesPage: React.FC = () => {
  const { state, dispatch } = useApp();
  useEffect(() => { if (state.messages > 0) dispatch({ type: "SET_MESSAGES", payload: 0 }); }, []);
  return (
    <div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Messages</h2>
      <div className="space-y-2">
        {["Welcome to the portal","Your weekly report is ready","Update your profile"].map((m, i) => (
          <div key={i} className="p-3 rounded-xl border hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { state } = useApp();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Profile</h2>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span>Name</span>
            <input defaultValue="Alex Developer" className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-800"/>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Email</span>
            <input defaultValue="alex@company.com" className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-800"/>
          </label>
          <button className="justify-self-start px-3 py-2 rounded-xl border brand-gradient text-zinc-900 font-semibold">Save</button>
        </div>
      </div>

      <div className="p-4 rounded-2xl border bg-white/60 dark:bg-zinc-900/60 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Preferences</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between p-2 rounded-xl border">
            <span>Theme</span>
            <span className="capitalize">{state.theme}</span>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl border">
            <span>Language</span>
            <span className="uppercase">{state.language}</span>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl border">
            <span>Role</span>
            <span>{state.role}</span>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl border">
            <span>Org</span>
            <span>{state.org}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// =============================================
// APP LAYOUT
// =============================================

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      <ThemeStyle />
      <HeaderBar />
      <Sidebar />

      <main
        className="container mx-auto px-4"
        style={{
          paddingTop: "calc(var(--header-height) + 1rem)",
          paddingBottom: "2rem",
          marginLeft: state.sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-collapsed)",
          transition: "margin-left .3s"
        }}
      >
        <div className="mb-4">
          <div className="rounded-2xl border brand-gradient p-4 text-zinc-900">
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="opacity-80">You are signed in as <strong>{state.role}</strong> at <strong>{state.org}</strong>.</p>
          </div>
        </div>
        {children}
      </main>

      <FooterBar />
    </div>
  );
};

// =============================================
// ROUTER
// =============================================

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="/messages" element={<MessagesPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<div className="p-6">Not found</div>} />
  </Routes>
);

// =============================================
// ROOT APP
// =============================================

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProvider>
  </BrowserRouter>
);

export default App;

/* =============================================
   NOTES FOR PRODUCTION SETUP
   =============================================
- Tailwind: ensure tailwind.config.js includes darkMode: 'class' and content paths.
- SCSS: create src/styles/theme.scss to keep additional variables/mixins. Example:
  $brand-primary: #fc820f;
  $brand-accent: #fcfc0f;
  :root { --brand-primary: #{$brand-primary}; --brand-accent: #{$brand-accent}; }
- Jest: add tests under src/__tests__/ e.g., Layout.test.tsx to verify toggles & persistence.
- Services: move ApiClient to src/services/api.ts, export singleton, add retry/backoff.
- Interceptors: add 401 handler to redirect to login, request ID headers, timing metrics.
- Filters: move applyFilters to src/lib/filters.ts and cover with unit tests.
- i18n: wire a library like i18next using state.language.
- Accessibility: all interactive elements have labels/titles; expand with aria-* as needed.
- Performance: lazy-load routes (React.lazy + Suspense), memoize charts, virtualize long tables.
*/
