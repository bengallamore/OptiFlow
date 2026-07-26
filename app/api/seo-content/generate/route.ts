import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSeoContent } from "@/lib/anthropic";
import { scoreSeoContent } from "@/lib/seo-score";
import { z } from "zod";

const Schema = z.object({
  title: z.string().min(1, "Title is required"),
  targetKeyword: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = Schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { title, targetKeyword } = parsed.data;
    const body = await generateSeoContent({ title, targetKeyword });
    const seoScore = scoreSeoContent({ title, targetKeyword, body });

    return NextResponse.json({ body, seoScore });
  } catch (err: any) {
    console.error("Generate SEO content error:", err);
    return NextResponse.json({ error: err.message ?? "Something went wrong" }, { status: 500 });
  }
}
