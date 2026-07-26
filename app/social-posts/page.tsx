import AppShell from "@/components/AppShell";

export default function Page() {
  return (
    <AppShell title="Social Posts">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-300">Compose, schedule, and publish posts across platforms.</p>
        <p className="mt-2 text-sm text-slate-500">Coming in Phase 2 of the rebuild.</p>
      </div>
    </AppShell>
  );
}
