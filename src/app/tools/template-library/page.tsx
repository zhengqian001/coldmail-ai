"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const templates = [
  { category: "SaaS Sales", items: [
    { name: "Quick Intro", subject: "Quick question about [Company]'s sales stack", body: "Hi {{firstName}},\n\nI noticed [Company] is growing fast — congrats on the recent [milestone/news].\n\nI work with SaaS teams like yours who struggle with [pain point]. Our [product] helps them [benefit] in [timeframe].\n\nWorth a 10-minute chat?\n\nBest,\n{{sender}}" },
    { name: "Competitor Switch", subject: "Why [Competitor] users switch to [Product]", body: "Hi {{firstName}},\n\nI've been talking with several teams who recently moved from [Competitor] to [Product]. The #1 reason? [Specific benefit].\n\nWould you be open to seeing how it works?\n\nBest,\n{{sender}}" },
    { name: "Case Study", subject: "How [Similar Company] achieved [result]", body: "Hi {{firstName}},\n\n[Similar Company] was dealing with the same challenge [Company] might be facing — [pain point].\n\nAfter switching to [Product], they saw:\n- [Metric 1]\n- [Metric 2]\n- [Metric 3]\n\nWould you like to see how they did it?\n\nBest,\n{{sender}}" },
  ]},
  { category: "Agency", items: [
    { name: "Portfolio Share", subject: "Some work that reminded me of [Company]", body: "Hi {{firstName}},\n\nI came across [Company]'s recent [project/campaign] and it caught my eye.\n\nWe recently did something similar for [Client] — [result]. I thought you might find it interesting.\n\nNo pitch — just wanted to share. If you ever need a partner for [service], I'm here.\n\nBest,\n{{sender}}" },
    { name: "Audit Offer", subject: "3 quick wins I found for [Company]", body: "Hi {{firstName}},\n\nI spent 5 minutes on [Company]'s [website/app] and found 3 quick wins:\n\n1. [Quick win 1]\n2. [Quick win 2]\n3. [Quick win 3]\n\nHappy to walk you through them on a quick call.\n\nBest,\n{{sender}}" },
  ]},
  { category: "Recruiting", items: [
    { name: "Passive Candidate", subject: "[Company] is hiring — thought of you", body: "Hi {{firstName}},\n\nI came across your profile and was impressed by your experience with [skill/industry].\n\n[Company] is looking for a [role] — it's a great opportunity because [reason].\n\nWould you be open to a quick chat? Even if you're not looking, I'd love to connect.\n\nBest,\n{{sender}}" },
    { name: "Hiring Manager Outreach", subject: "Candidates for your [role] opening", body: "Hi {{firstName}},\n\nI saw [Company] is hiring for [role]. I have 3 strong candidates in my network who match:\n\n1. [Candidate 1 — one-line highlight]\n2. [Candidate 2 — one-line highlight]\n3. [Candidate 3 — one-line highlight]\n\nWant me to send over their profiles?\n\nBest,\n{{sender}}" },
  ]},
  { category: "Investor Outreach", items: [
    { name: "Seed Round", subject: "[Company] — [Traction metric] and raising [amount]", body: "Hi {{firstName}},\n\nI'm building [Company] — we [one-line description].\n\nSome recent traction:\n- [Metric 1]\n- [Metric 2]\n- [Metric 3]\n\nWe're raising a [round size] to [use of funds]. I'd love to share our deck if you're interested.\n\nBest,\n{{sender}}" },
  ]},
  { category: "Freelancer", items: [
    { name: "Service Offer", subject: "Help with [specific need] at [Company]?", body: "Hi {{firstName}},\n\nI noticed [Company] might need help with [specific service]. I'm a freelance [role] and I've helped companies like [Client] [achieve result].\n\nI have availability this month. Would you like to see some samples?\n\nBest,\n{{sender}}" },
  ]},
];

export default function TemplateLibrary() {
  const [activeCategory, setActiveCategory] = useState(templates[0].category);
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeTemplates = templates.find((t) => t.category === activeCategory)?.items || [];

  return (
    <ToolLayout icon="📄" title="Template Library">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.category}
                onClick={() => setActiveCategory(t.category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  activeCategory === t.category ? "bg-primary text-white border-primary" : "bg-gray-50 border-gray-200 hover:border-primary/30"
                }`}
              >
                {t.category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {activeTemplates.map((tpl, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{tpl.name}</h3>
                <button onClick={() => copy(`Subject: ${tpl.subject}\n\n${tpl.body}`, i)} className="text-sm text-primary hover:underline">
                  {copied === i ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div className="mb-2">
                <span className="text-xs text-gray-400">Subject: </span>
                <span className="text-sm font-medium text-primary">{tpl.subject}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs whitespace-pre-wrap leading-relaxed text-gray-600 max-h-40 overflow-y-auto">
                {tpl.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
