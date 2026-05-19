"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const spamWords = [
  { word: "free", severity: "high", reason: "Top spam trigger word" },
  { word: "act now", severity: "high", reason: "Urgency language" },
  { word: "urgent", severity: "high", reason: "Urgency language" },
  { word: "limited time", severity: "high", reason: "Artificial scarcity" },
  { word: "buy now", severity: "high", reason: "Aggressive CTA" },
  { word: "order now", severity: "high", reason: "Aggressive CTA" },
  { word: "click here", severity: "medium", reason: "Common in phishing emails" },
  { word: "subscribe", severity: "medium", reason: "Marketing trigger" },
  { word: "discount", severity: "medium", reason: "Sales trigger" },
  { word: "guarantee", severity: "medium", reason: "Overpromising language" },
  { word: "no obligation", severity: "medium", reason: "Classic spam phrase" },
  { word: "risk-free", severity: "medium", reason: "Overpromising language" },
  { word: "winner", severity: "high", reason: "Lottery/scam trigger" },
  { word: "congratulations", severity: "high", reason: "Lottery/scam trigger" },
  { word: "cash", severity: "medium", reason: "Financial trigger" },
  { word: "bonus", severity: "low", reason: "Promotional language" },
  { word: "earn", severity: "low", reason: "Income claim" },
  { word: "million", severity: "medium", reason: "Exaggerated claim" },
  { word: "opportunity", severity: "low", reason: "Vague promise" },
  { word: "amazing", severity: "low", reason: "Overused marketing word" },
  { word: "unbelievable", severity: "medium", reason: "Exaggeration" },
  { word: "100%", severity: "medium", reason: "Absolute claim" },
  { word: "!!!", severity: "high", reason: "Multiple exclamation marks" },
  { word: "ALL CAPS", severity: "high", reason: "Shouting in subject lines" },
  { word: "$$$", severity: "high", reason: "Money symbols trigger filters" },
  { word: "dear friend", severity: "high", reason: "Classic spam greeting" },
  { word: "as seen on", severity: "medium", reason: "Infomercial language" },
  { word: "satisfaction guaranteed", severity: "medium", reason: "Overpromise" },
  { word: "once in a lifetime", severity: "medium", reason: "Exaggeration" },
  { word: "don't delete", severity: "medium", reason: "Manipulative language" },
];

const allCapsRegex = /[A-Z]{5,}/;

export default function SpamChecker() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [results, setResults] = useState<{ word: string; severity: string; reason: string; count: number }[]>([]);

  const check = () => {
    const text = `${subject} ${body}`.toLowerCase();
    const found: { word: string; severity: string; reason: string; count: number }[] = [];

    spamWords.forEach((sw) => {
      if (sw.word === "ALL CAPS") {
        const capsMatches = `${subject} ${body}`.match(allCapsRegex);
        if (capsMatches) {
          found.push({ word: "ALL CAPS", severity: sw.severity, reason: sw.reason, count: capsMatches.length });
        }
      } else if (sw.word === "!!!") {
        const exclCount = `${subject} ${body}`.split("!!!").length - 1;
        if (exclCount > 0) found.push({ word: "!!!", severity: sw.severity, reason: sw.reason, count: exclCount });
      } else {
        const regex = new RegExp(sw.word, "gi");
        const matches = text.match(regex);
        if (matches) found.push({ word: sw.word, severity: sw.severity, reason: sw.reason, count: matches.length });
      }
    });

    setResults(found);
  };

  const highCount = results.filter((r) => r.severity === "high").length;
  const medCount = results.filter((r) => r.severity === "medium").length;
  const lowCount = results.filter((r) => r.severity === "low").length;
  const riskScore = highCount * 30 + medCount * 15 + lowCount * 5;
  const riskLevel = riskScore >= 60 ? "High" : riskScore >= 30 ? "Medium" : "Low";

  return (
    <ToolLayout icon="📋" title="Spam Checker">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Paste your email</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Your email subject"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Paste your email body here..."
                  className="w-full border rounded-lg px-4 py-3 text-sm h-48 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <button
                onClick={check}
                disabled={!subject.trim() && !body.trim()}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                Check for Spam 📋
              </button>
            </div>
          </div>
        </div>

        <div>
          {results.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className={`text-3xl font-extrabold ${riskLevel === "High" ? "text-red-600" : riskLevel === "Medium" ? "text-yellow-600" : "text-green-600"}`}>
                  {riskLevel} Risk
                </div>
                <div className="flex gap-4 justify-center mt-3 text-sm">
                  <span className="text-red-600">🔴 {highCount} High</span>
                  <span className="text-yellow-600">🟡 {medCount} Medium</span>
                  <span className="text-green-600">🟢 {lowCount} Low</span>
                </div>
              </div>
              {results.map((r, i) => (
                <div key={i} className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 ${r.severity === "high" ? "border-l-4 border-l-red-500" : r.severity === "medium" ? "border-l-4 border-l-yellow-500" : "border-l-4 border-l-green-500"}`}>
                  <div>
                    <span className="font-mono text-sm font-medium">"{r.word}"</span>
                    <span className="text-xs text-gray-400 ml-2">×{r.count}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-auto">{r.reason}</div>
                </div>
              ))}
              {results.length === 0 && (
                <div className="bg-green-50 rounded-2xl p-6 text-center text-green-700">
                  ✅ No spam triggers found! Your email looks clean.
                </div>
              )}
            </div>
          ) : results.length === 0 && (subject || body) ? (
            <div className="bg-green-50 rounded-2xl p-6 text-center text-green-700">
              ✅ No spam triggers found! Your email looks clean.
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">📋</div>
              <p>Paste your email and check for spam triggers</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
