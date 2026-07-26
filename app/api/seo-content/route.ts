import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSeoContent } from "@/lib/anthropic";
import { scoreSeoContent } from "@/lib/seo-score";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  targetKeyword: z.string().optional(),
  body: z.string().optional(),
  useAi: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const content = await prisma.seoContent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ content });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = CreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { title, targetKeyword, useAi } = parsed.data;
    let body = parsed.data.body ?? "";

    if (useAi) {
      body = await generateSeoContent({ title, targetKeyword });
    }

    const seoScore = scoreSeoContent({ title, targetKeyword, body });

    const content = await prisma.seoContent.create({
      data: { userId, title, targetKeyword, body, seoScore },
    });

    return NextResponse.json({ content }, { status: 201 });
  } catch (err: any) {
    console.error("Create SEO content error:", err);
    return NextResponse.json({ error: err.message ?? "Something went wrong" }, { status: 500 });
  }
}
