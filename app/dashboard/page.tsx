import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const [postCount, contentCount, keywordCount] = await Promise.all([
    prisma.socialPost.count({ where: { userId } }),
    prisma.seoContent.count({ where: { userId } }),
    prisma.keyword.count({ where: { userId } }),
  ]);

  const stats = [
    { label: "Social Posts", value: postCount },
    { label: "SEO Content Pieces", value: contentCount },
    { label: "Tracked Keywords", value: keywordCount },
  ];

  return (
    <AppShell title={`Welcome back${session?.user?.name ? ", " + session.user.name : ""}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-2 text-sm font-medium text-white">Next steps</h2>
        <ul className="list-inside list-disc text-sm text-slate-400">
          <li>Connect GA4, Search Console, Ahrefs, or Screaming Frog under their respective tabs</li>
          <li>Draft your first SEO content piece or social post</li>
          <li>Add keywords to start tracking rank history</li>
        </ul>
      </div>
    </AppShell>
  );
}
