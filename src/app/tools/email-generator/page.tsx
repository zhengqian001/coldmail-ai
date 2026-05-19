"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const templates = [
  { id: "direct", name: "Direct & Concise", tone: "professional" },
  { id: "story", name: "Story-Driven", tone: "friendly" },
  { id: "value", name: "Value-First", tone: "professional" },
  { id: "question", name: "Question-Based", tone: "casual" },
  { id: "social", name: "Social Proof", tone: "professional" },
];

const templatesData: Record<string, (vars: { product: string; customer: string; sender: string }) => { subject: string; body: string }> = {
  direct: (v) => ({
    subject: `Quick question about ${v.customer.split(" ")[0]}'s outreach strategy`,
    body: `Hi {{firstName}},

I noticed {{company}} might benefit from ${v.product}. Companies like yours typically see results within the first 2 weeks.

Would you be open to a quick 10-minute call this week to explore if this could work for {{company}}?

Best,
${v.sender || "[Your Name]"}`,
  }),
  story: (v) => ({
    subject: `How a ${v.customer.split(" ")[0] || "peer"} solved their biggest outreach challenge`,
    body: `Hi {{firstName}},

Last month, I was talking with a ${v.customer.split(" ")[0] || "similar company"} who was struggling with the exact same challenge {{company}} might be facing.

They started using ${v.product}, and within 30 days, their response rates doubled.

I thought of you because it seems like {{company}} could see similar results. Worth a quick chat?

Best,
${v.sender || "[Your Name]"}`,
  }),
  value: (v) => ({
    subject: `${v.product} — 3 ways it helps ${v.customer.split(" ")[0] || "teams like yours"}`,
    body: `Hi {{firstName}},

Here are 3 ways ${v.product} can help {{company}}:

1. Save 5+ hours per week on outreach
2. Increase response rates by 2-3x
3. Automate follow-ups without sounding robotic

Would any of these be valuable for {{company}} right now?

Best,
${v.sender || "[Your Name]"}`,
  }),
  question: (v) => ({
    subject: `Quick question for you, {{firstName}}`,
    body: `Hi {{firstName}},

Are you still looking for better ways to handle outreach at {{company}}?

If so, ${v.product} might be exactly what you need. I'd love to show you how it works — no pressure, just a 10-minute demo.

Let me know if you're open to it!

Best,
${v.sender || "[Your Name]"}`,
  }),
  social: (v) => ({
    subject: `Why ${v.customer.split(" ")[0] || "companies"} are switching to ${v.product.split(" ")[0]}`,
    body: `Hi {{firstName}},

Over 500 companies have switched to ${v.product} in the last quarter alone. The #1 reason? They were tired of low response rates.

{{company}} seems like a great fit based on what you do.

Would you like to see a quick demo?

Best,
${v.sender || "[Your Name]"}`,
  }),
};

export default function EmailGenerator() {
  const [product, setProduct] = useState("");
  const [customer, setCustomer] = useState("");
  const [sender, setSender] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("direct");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!product.trim() || !customer.trim()) return;
    const fn = templatesData[selectedTemplate];
    if (fn) {
      setResult(fn({ product, customer, sender }));
    }
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout icon="✉️" title="Email Generator">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Fill in the details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Product / Service *</label>
              <textarea
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. AI-powered CRM software that helps sales teams close 30% more deals"
                className="w-full border rounded-lg px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Customer *</label>
              <textarea
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. VP of Sales at mid-size SaaS companies"
                className="w-full border rounded-lg px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Style</label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                      selectedTemplate === t.id
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/30"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!product.trim() || !customer.trim()}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
            >
              Generate Email ✉️
            </button>
          </div>
        </div>

        {/* Result */}
        <div>
          {result ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Generated Email</h3>
                <button onClick={copyAll} className="text-sm text-primary hover:underline">
                  {copied ? "✅ Copied!" : "📋 Copy All"}
                </button>
              </div>
              <div className="mb-3">
                <label className="text-xs text-gray-500">Subject Line</label>
                <div className="bg-blue-50 rounded-lg px-4 py-2 text-sm font-medium">{result.subject}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Email Body</label>
                <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">{result.body}</div>
              </div>
              <p className="mt-4 text-xs text-gray-400">💡 Replace {`{{firstName}}`}, {`{{company}}`} with real data before sending</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">✉️</div>
              <p>Your generated email will appear here</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
