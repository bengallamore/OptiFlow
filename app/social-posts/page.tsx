"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

type SocialPost = {
  id: string;
  platform: string;
  content: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
};

const PLATFORMS = ["linkedin", "x", "instagram", "facebook", "other"];

export default function SocialPostsPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState("linkedin");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/social-posts");
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/social-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        content,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    setContent("");
    setScheduledAt("");
    loadPosts();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/social-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadPosts();
  }

  async function deletePost(id: string) {
    await fetch(`/api/social-posts/${id}`, { method: "DELETE" });
    loadPosts();
  }

  return (
    <AppShell title="Social Posts">
      <form
        onSubmit={handleCreate}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5"
      >
        <div className="mb-4 flex gap-3">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
          />
        </div>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to post?"
          rows={4}
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
        />
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : scheduledAt ? "Schedule Post" : "Save Draft"}
        </button>
      </form>

      <h2 className="mb-3 text-sm font-medium text-slate-400">Your Posts</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-slate-500">No posts yet. Create your first one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs uppercase text-slate-300">
                  {post.platform}
                </span>
                <span className="text-xs text-slate-500">{post.status}</span>
              </div>
              <p className="mb-3 whitespace-pre-wrap text-sm text-slate-200">{post.content}</p>
              <div className="flex gap-2">
                {post.status !== "published" && (
                  <button
                    onClick={() => updateStatus(post.id, "published")}
                    className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700"
                  >
                    Mark Published
                  </button>
                )}
                <button
                  onClick={() => deletePost(post.id)}
                  className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-red-400 hover:bg-slate-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
