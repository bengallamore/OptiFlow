import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({
  platform: z.enum(["linkedin", "x", "instagram", "facebook", "other"]),
  content: z.string().min(1, "Content is required"),
  scheduledAt: z.string().datetime().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.socialPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
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

    const { platform, content, scheduledAt } = parsed.data;

    const post = await prisma.socialPost.create({
      data: {
        userId,
        platform,
        content,
        status: scheduledAt ? "scheduled" : "draft",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("Create social post error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
