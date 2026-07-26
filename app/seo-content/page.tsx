"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

type SeoContentItem = {
  id: string;
  title: string;
  targetKeyword: string | null;
  body: string;
  seoScore: number | null;
  status: string;
  createdAt: string;
};

export default function SeoContentPage() {
  const [items, setItems] = useState<SeoContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [body, setBody] = useState("");
  const [liveScore, setLiveScore] = useState<number | null>(null);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    const res = await fetch("/api/seo-content");
    const data = await res.json();
    setItems(data.content ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleGenerate() {
    if (!title) {
      setError("Add a title first");
      return;
    }
    setError(null);
    setGenerating(true);

    const res = await fetch("/api/seo-content/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, targetKeyword }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    setBody(data.body);
    setLiveScore(data.seoScore);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/seo-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, targetKeyword, body }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    setTitle("");
    setTargetKeyword("");
    setBody("");
    setLiveScore(null);
    loadItems();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/seo-content/${id}`, { method: "DELETE" });
    loadItems();
  }

  return (
    <AppShell title="SEO Content">
      <form onSubmit={handleSave} className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Target keyword (optional)"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
          />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {generating ? "Generating…" : "✨ Generate with AI"}
          </button>
          {liveScore !== null && (
            <span className="text-sm text-slate-400">
              SEO Score: <span className="font-semibold text-white">{liveScore}/100</span>
            </span>
          )}
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write or generate your content here…"
          rows={10}
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
        />

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving || !body}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Content"}
        </button>
      </form>

      <h2 className="mb-3 text-sm font-medium text-slate-400">Saved Content</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">No content yet. Create your first piece above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-white">{item.title}</h3>
                {item.seoScore !== null && (
                  <span className="text-xs text-slate-400">Score: {item.seoScore}/100</span>
                )}
              </div>
              {item.targetKeyword && (
                <p className="mb-2 text-xs text-slate-500">Keyword: {item.targetKeyword}</p>
              )}
              <p className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm text-slate-300">{item.body}</p>
              <button
                onClick={() => deleteItem(item.id)}
                className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-red-400 hover:bg-slate-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
