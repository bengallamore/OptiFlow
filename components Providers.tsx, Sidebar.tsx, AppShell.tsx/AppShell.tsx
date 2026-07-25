import Sidebar from "./Sidebar";

export default function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-semibold text-white">{title}</h1>
        {children}
      </main>
    </div>
  );
}
