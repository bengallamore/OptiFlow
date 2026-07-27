"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/social-posts", label: "Social Posts" },
  { href: "/seo-content", label: "SEO Content" },
  { href: "/keywords", label: "Keywords" },
  { href: "/ga4", label: "GA4" },
  { href: "/search-console", label: "Search Console" },
  { href: "/ahrefs", label: "Ahrefs" },
  { href: "/screaming-frog", label: "Screaming Frog" },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-800 bg-slate-900 p-4 transition-transform duration-200 sm:static sm:z-auto sm:h-screen sm:w-56 sm:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-6 flex items-center justify-between px-2">
            <span className="text-lg font-semibold tracking-tight text-white">
              OptiFlow
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white sm:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-brand-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Sign out
        </button>
      </aside>
    </>
  );
}
