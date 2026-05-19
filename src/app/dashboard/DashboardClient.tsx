"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface EmailVersion {
  subject: string;
  body: string;
}

interface GenerationResult {
  versions: EmailVersion[];
  subjectLines: string[];
}

export default function DashboardClient({
  user,
  plan,
}: {
  user: User;
  plan: "free" | "pro";
}) {
  const [product, setProduct] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"generate" | "history">(
    "generate"
  );
  const [upgrading, setUpgrading] = useState(false);

  const handleGenerate = async () => {
    if (!product.trim() || !targetCustomer.trim()) {
      setError("Please fill in both product and target customer.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, targetCustomer, tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setResult(data.results);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to start subscription");
        return;
      }
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            ColdMail<span className="text-accent">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                plan === "pro"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {plan === "pro" ? "⭐ Pro" : "Free"}
            </span>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Upgrade Banner for Free Users */}
      {plan === "free" && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <span className="text-sm">
              🚀 Free plan: 3 emails/day — Upgrade to Pro for unlimited
              generations at $9/month
            </span>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="bg-white text-primary px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
            >
              {upgrading ? "Processing..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-4 border-b mb-6">
          <button
            onClick={() => setActiveTab("generate")}
            className={`pb-3 px-1 font-medium ${
              activeTab === "generate"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
          >
            Generate Email
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-1 font-medium ${
              activeTab === "history"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === "generate" ? (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-bold mb-4">
                Describe Your Outreach
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Product / Service *
                  </label>
                  <textarea
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. AI-powered CRM software that helps sales teams close 30% more deals"
                    className="w-full border rounded-lg px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Customer *
                  </label>
                  <textarea
                    value={targetCustomer}
                    onChange={(e) => setTargetCustomer(e.target.value)}
                    placeholder="e.g. VP of Sales at mid-size SaaS companies with 50-200 employees"
                    className="w-full border rounded-lg px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Emails ✨"}
                </button>

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {!result && !loading && (
                <div className="bg-white rounded-xl p-12 shadow-sm border text-center text-gray-400">
                  <div className="text-5xl mb-4">📧</div>
                  <p>Your generated emails will appear here</p>
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
                  <div className="animate-pulse text-5xl mb-4">✨</div>
                  <p className="text-gray-600">
                    AI is crafting your perfect cold email...
                  </p>
                </div>
              )}

              {result && (
                <>
                  {/* Subject Lines */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="font-bold mb-3">
                      🎯 Subject Line Suggestions
                    </h3>
                    <div className="space-y-2">
                      {result.subjectLines.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2"
                        >
                          <span className="text-sm">{s}</span>
                          <button
                            onClick={() => copyToClipboard(s, 100 + i)}
                            className="text-xs text-primary hover:underline"
                          >
                            {copiedIdx === 100 + i ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email Versions */}
                  {result.versions.map((v, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-6 shadow-sm border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold">
                          Version {i + 1}: {v.subject}
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `Subject: ${v.subject}\n\n${v.body}`,
                              i
                            )
                          }
                          className="text-sm text-primary hover:underline"
                        >
                          {copiedIdx === i ? "Copied!" : "Copy All"}
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                        {v.body}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-xl p-12 shadow-sm border text-center text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p>Email history will appear here</p>
            <p className="text-sm mt-2">
              Generate some emails first, then come back to review them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
