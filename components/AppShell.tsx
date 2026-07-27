"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-4 sm:hidden">
        <span className="text-lg font-semibold tracking-tight text-white">OptiFlow</span>
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 p-4 sm:p-8">
        <h1 className="mb-6 text-xl font-semibold text-white sm:text-2xl">{title}</h1>
        {children}
      </main>
    </div>
  );
}
