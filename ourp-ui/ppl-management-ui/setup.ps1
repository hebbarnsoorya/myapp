# ==============================
# Setup Script for FullScale App (Next.js + Tailwind + shadcn/ui)
# With robust folder creation + mock charts + calendar grid
# ==============================

$ErrorActionPreference = "Stop"

function Write-File {
    param(
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)][string]$Content
    )
    $dir = Split-Path $Path
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    Set-Content -Path $Path -Value $Content -Encoding UTF8
}

Write-Host "Creating Next.js project..."
npx create-next-app@latest fullscale-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git

Set-Location fullscale-app

Write-Host "Installing dependencies..."
npm install recharts framer-motion lucide-react

Write-Host "Installing shadcn/ui..."
npx shadcn@latest init -y
npx shadcn@latest add button card input dropdown-menu select avatar

Write-Host "Ensuring base folders..."
# components
New-Item -ItemType Directory -Force -Path "src\components\layout" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\mock" | Out-Null
# app and route subfolders (guaranteed)
$routes = @("analytics","reports","calendar","data","help")
if (-not (Test-Path "src\app")) { New-Item -ItemType Directory -Force -Path "src\app" | Out-Null }
foreach ($r in $routes) {
    $p = "src\app\$r"
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}

# ---------- Global styles ----------
$globals = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand-1: #fc820f;
  --brand-2: #fcfc0f;
}
body { @apply bg-gray-50 text-gray-900; }
'@
Write-File "src\app\globals.css" $globals

# ---------- Next.js layout.tsx (wraps everything with AdminLayout) ----------
$rootLayout = @'
import type { Metadata } from "next";
import "./globals.css";
import AdminLayout from "@/components/layout/AdminLayout";

export const metadata: Metadata = {
  title: "FullScale App",
  description: "Enterprise mock UI with charts & tables",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
'@
Write-File "src\app\layout.tsx" $rootLayout

# ---------- AdminLayout + parts ----------
$adminLayout = @'
"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
'@
Write-File "src\components\layout\AdminLayout.tsx" $adminLayout

$header = @'
"use client";
import { Menu } from "lucide-react";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="bg-white border-b shadow-sm p-3 flex items-center justify-between">
      <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded" aria-label="Toggle sidebar">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold">FullScale App</h1>
      <div className="text-sm text-gray-500">User ▾</div>
    </header>
  );
}
'@
Write-File "src\components\layout\Header.tsx" $header

$sidebar = @'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/analytics", label: "Analytics" },
  { path: "/reports", label: "Reports" },
  { path: "/calendar", label: "Calendar" },
  { path: "/data", label: "Data" },
  { path: "/help", label: "Help" },
];

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={`bg-white border-r transition-all ${open ? "w-64" : "w-16"}`}>
      <nav className="flex flex-col p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-2 rounded hover:bg-orange-100 ${pathname === item.path ? "bg-orange-200 font-semibold" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
'@
Write-File "src\components\layout\Sidebar.tsx" $sidebar

$footer = @'
export default function Footer() {
  return (
    <footer className="bg-white border-t p-3 text-xs text-gray-500 flex justify-between">
      <span>© {new Date().getFullYear()} FullScale Corp</span>
      <span>Privacy · Terms</span>
    </footer>
  );
}
'@
Write-File "src\components\layout\Footer.tsx" $footer

# ---------- Mock data ----------
$mockData = @'
export const mockKpis = [
  { title: "Revenue", value: "$124k", sub: "↑ 12.5% MoM" },
  { title: "Active Users", value: "8,243", sub: "↑ 4.1% WoW" },
  { title: "Conversion", value: "3.42%", sub: "↓ 0.2% DoD" },
  { title: "Tickets", value: "54 open", sub: "SLAs: 96%" },
];

export const mockChartData = Array.from({ length: 12 }).map((_, i) => ({
  name: `M${i + 1}`,
  revenue: Math.round(200 + Math.random() * 800),
  users: Math.round(50 + Math.random() * 200),
}));

export const mockProjects = [
  { id: 1, project: "Project A", owner: "Ava", status: "Active", progress: 70 },
  { id: 2, project: "Project B", owner: "Ben", status: "Blocked", progress: 45 },
  { id: 3, project: "Project C", owner: "Cara", status: "Review", progress: 60 },
];
'@
Write-File "src\components\mock\mockData.ts" $mockData

# ---------- Dashboard (KPIs + charts + table) ----------
$dashboard = @'
"use client";
import { mockKpis, mockProjects, mockChartData } from "@/components/mock/mockData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockKpis.map((kpi) => (
          <div key={kpi.title} className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">{kpi.title}</div>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="text-xs text-gray-400">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Monthly Revenue & Users</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fc820f" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#fc820f" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#fc820f" fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Quarterly Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ q: "Q1", value: 420 }, { q: "Q2", value: 560 }, { q: "Q3", value: 610 }, { q: "Q4", value: 720 }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="q" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#fc820f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Table */}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Projects</h2>
        <table className="w-full text-sm">
          <thead><tr><th>ID</th><th>Project</th><th>Owner</th><th>Status</th><th>Progress</th></tr></thead>
          <tbody>
            {mockProjects.map((p) => (
              <tr key={p.id} className="border-t">
                <td>{p.id}</td>
                <td>{p.project}</td>
                <td>{p.owner}</td>
                <td>{p.status}</td>
                <td>{p.progress}%</td>
              </tr>
