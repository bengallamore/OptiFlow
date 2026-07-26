import AppShell from "@/components/AppShell";

export default function Page() {
  return (
    <AppShell title="Search Console">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-300">Connect Search Console for impressions, clicks, and query data.</p>
        <p className="mt-2 text-sm text-slate-500">Coming in Phase 4 of the rebuild.</p>
      </div>
    </AppShell>
  );
}
