"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const sequences: Record<string, { name: string; days: number[]; templates: string[] }[]> = {
  sales: [
    { name: "Initial Outreach", days: [0], templates: ["Hi {{firstName}},\n\nI noticed {{company}} might benefit from [product]. Would you be open to a quick chat?\n\nBest,\n{{sender}}"] },
    { name: "Value Add", days: [3], templates: ["Hi {{firstName}},\n\nFollowing up with a resource that might help: [link/article]. No response needed — just thought it'd be useful.\n\nBest,\n{{sender}}"] },
    { name: "Gentle Nudge", days: [7], templates: ["Hi {{firstName}},\n\nI know you're busy. Just wanted to float this back to the top of your inbox. Happy to chat whenever works for you.\n\nBest,\n{{sender}}"] },
    { name: "Breakup Email", days: [14], templates: ["Hi {{firstName}},\n\nI'll assume this isn't a priority right now — totally understand. If things change, I'm here.\n\nBest of luck!\n{{sender}}"] },
  ],
  networking: [
    { name: "Warm Intro", days: [0], templates: ["Hi {{firstName}},\n\nI came across your work at {{company}} and was really impressed by [specific thing]. I'd love to connect and learn more about what you're working on.\n\nBest,\n{{sender}}"] },
    { name: "Share Value", days: [5], templates: ["Hi {{firstName}},\n\nThought you might find this interesting: [resource/article]. It relates to what you're doing at {{company}}.\n\nCheers,\n{{sender}}"] },
    { name: "Soft Close", days: [12], templates: ["Hi {{firstName}},\n\nNo pressure at all — just wanted to leave the door open. If you'd ever like to grab a coffee (virtual or otherwise), I'd enjoy that.\n\nAll the best,\n{{sender}}"] },
  ],
  job: [
    { name: "Application Follow-up", days: [0], templates: ["Hi {{firstName}},\n\nI recently applied for the [role] position at {{company}}. I'm excited about the opportunity because [reason]. I'd love to discuss how my experience aligns with your team's needs.\n\nBest,\n{{sender}}"] },
    { name: "Add Context", days: [4], templates: ["Hi {{firstName}},\n\nI wanted to share a quick example of my work: [portfolio/link]. It shows how I've [relevant achievement].\n\nLooking forward to hearing from you!\n{{sender}}"] },
    { name: "Polite Check-in", days: [10], templates: ["Hi {{firstName}},\n\nJust checking in on my application for [role]. I understand you're reviewing many candidates — happy to provide any additional info if helpful.\n\nBest,\n{{sender}}"] },
  ],
};

export default function FollowUpGen() {
  const [type, setType] = useState("sales");
  const [sender, setSender] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text.replace(/\{\{sender\}\}/g, sender || "[Your Name]"));
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout icon="📝" title="Follow-up Generator">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Choose your sequence type</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {Object.entries(sequences).map(([key, seqs]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition ${
                  type === key
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/30"
                }`}
              >
                {key === "sales" ? "💼 Sales" : key === "networking" ? "🤝 Networking" : "💼 Job Search"}
              </button>
            ))}
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
        </div>

        <div className="space-y-4">
          {sequences[type].map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-gray-400">Day {step.days[0]}</span>
                  <h3 className="font-bold">{step.name}</h3>
                </div>
                <button onClick={() => copy(step.templates[0], i)} className="text-sm text-primary hover:underline">
                  {copied === i ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {step.templates[0].replace(/\{\{sender\}\}/g, sender || "[Your Name]")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
