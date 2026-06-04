"use client";

import { useState, useEffect, useCallback } from "react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-400 transition-colors"
    >
      <CopyIcon />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function HistoryCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-700/60 rounded-xl bg-slate-800/40 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300 truncate">{item.originalText}</p>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(item.createdAt).toLocaleString()} · {item.processingTimeMs}ms
          </p>
        </div>
        <span className="ml-3 text-slate-500 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
          {item.xPosts.map((post, i) => (
            <div key={i} className="bg-slate-900/60 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap flex justify-between gap-2">
              <span>{post}</span>
              <CopyButton text={post} />
            </div>
          ))}
          <div className="bg-slate-900/60 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap flex justify-between gap-2">
            <span>{item.linkedin}</span>
            <CopyButton text={item.linkedin} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.history) setHistory(data.history);
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleGenerate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data);
      await fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0f14] text-slate-100 selection:bg-violet-600/40">
      {/* Gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered · No signup required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
            Content Repurposer
          </h1>
          <p className="mt-3 text-slate-400 text-lg">
            Paste any article. Get viral X threads &amp; LinkedIn posts instantly.
          </p>
        </div>

        {/* Input card */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm p-6 shadow-2xl mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your blog post, article, or any long-form text here..."
            rows={7}
            className="w-full bg-slate-900/70 border border-slate-600/50 rounded-xl p-4 text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-500">{text.length} chars</span>
            <button
              onClick={handleGenerate}
              disabled={loading || text.trim().length < 10}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 active:scale-95"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                "✦ Generate Social Pack"
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Generated in {result.processingTime}ms
            </div>

            {/* X/Twitter posts */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-4">
                <XIcon /> X / Twitter Posts
              </div>
              <div className="space-y-3">
                {result.xPosts.map((post, i) => (
                  <div key={i} className="bg-slate-900/70 rounded-xl p-4 text-sm text-slate-200 whitespace-pre-wrap border border-slate-700/40">
                    <div className="flex justify-between items-start gap-3">
                      <span className="flex-1">{post}</span>
                      <CopyButton text={post} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn post */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-4">
                <LinkedInIcon /> LinkedIn Post
              </div>
              <div className="bg-slate-900/70 rounded-xl p-4 text-sm text-slate-200 whitespace-pre-wrap border border-slate-700/40">
                <div className="flex justify-between items-start gap-3">
                  <span className="flex-1">{result.linkedin}</span>
                  <CopyButton text={result.linkedin} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="text-slate-500">⟳</span> Generation History
          </h2>
          {historyLoading ? (
            <div className="text-center py-8 text-slate-500 text-sm">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-700/50 rounded-2xl text-slate-500 text-sm">
              No history yet. Generate your first social pack above!
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
