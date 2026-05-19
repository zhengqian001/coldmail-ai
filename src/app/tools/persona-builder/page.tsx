"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const dimensions = [
  { key: "industry", label: "Industry", options: ["SaaS", "E-commerce", "Agency", "Finance", "Healthcare", "Education", "Manufacturing", "Real Estate", "Other"] },
  { key: "companySize", label: "Company Size", options: ["1-10", "11-50", "51-200", "201-1000", "1000+"] },
  { key: "role", label: "Decision Maker Role", options: ["CEO/Founder", "VP/Director", "Manager", "Individual Contributor", "Other"] },
  { key: "painPoint", label: "Primary Pain Point", options: ["Low response rates", "No personalization at scale", "Poor deliverability", "Time-consuming follow-ups", "No clear ROI tracking", "Other"] },
  { key: "budget", label: "Budget Range", options: ["< $100/mo", "$100-500/mo", "$500-2000/mo", "$2000+/mo", "Unknown"] },
  { key: "timeline", label: "Buying Timeline", options: ["Immediate", "1-3 months", "3-6 months", "6+ months", "Just exploring"] },
];

export default function PersonaBuilder() {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<Record<string, string>>({ company: "", title: "", location: "" });
  const [showResult, setShowResult] = useState(false);

  const set = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const completeness = Math.round((Object.keys(selections).length / dimensions.length) * 100);

  return (
    <ToolLayout icon="🎯" title="Persona Builder">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Define your ideal customer</h2>
            <div className="space-y-4">
              {dimensions.map((dim) => (
                <div key={dim.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{dim.label}</label>
                  <div className="flex flex-wrap gap-2">
                    {dim.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => set(dim.key, opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          selections[dim.key] === opt
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-50 border-gray-200 hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                {[
                  { key: "company", placeholder: "Target company (optional)" },
                  { key: "title", placeholder: "Job title (optional)" },
                  { key: "location", placeholder: "Location/Region (optional)" },
                ].map((f) => (
                  <input
                    key={f.key}
                    value={customFields[f.key] || ""}
                    onChange={(e) => setCustomFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border rounded-lg px-4 py-2 text-sm mb-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                ))}
              </div>
              <button onClick={() => setShowResult(true)} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">
                Build Persona 🎯
              </button>
            </div>
          </div>
        </div>

        <div>
          {showResult ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Your Ideal Customer Profile</h3>
              <div className="space-y-3">
                {dimensions.map((dim) => (
                  <div key={dim.key} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{dim.label}</span>
                    <span className="text-sm font-medium">{selections[dim.key] || "—"}</span>
                  </div>
                ))}
                {Object.entries(customFields).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500 capitalize">{k}</span>
                    <span className="text-sm font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-primary mb-2">💡 Outreach Tips for This Persona</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {selections.role === "CEO/Founder" ? "Keep it short — founders are busy" : `Address ${selections.role || "decision maker"}'s specific pain points`}</li>
                  <li>• {selections.painPoint === "Low response rates" ? "Focus on personalization and relevance" : `Lead with how you solve "${selections.painPoint || "their pain"}"`}</li>
                  <li>• {selections.timeline === "Immediate" ? "Include a clear CTA with next steps" : "Nurture with value-first content before asking for a meeting"}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">🎯</div>
              <p>Fill in the details and click Build Persona</p>
              <div className="mt-4">
                <div className="text-sm text-gray-500">{completeness}% complete</div>
                <div className="bg-gray-100 rounded-full h-2 mt-1">
                  <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${completeness}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
