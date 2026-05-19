"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const scoringRules = [
  { keyword: /urgent|important|act now/i, score: -15, reason: "Spam trigger: urgency language" },
  { keyword: /free|winner|congratulations/i, score: -20, reason: "Spam trigger: 'free' or lottery language" },
  { keyword: /buy|purchase|order now/i, score: -10, reason: "Too salesy for a cold email" },
  { keyword: /\$/i, score: -5, reason: "Mentioning money can trigger spam filters" },
  { keyword: /!{2,}/, score: -10, reason: "Multiple exclamation marks look spammy" },
  { keyword: /ALL CAPS/, score: -10, reason: "ALL CAPS is a red flag" },
  { keyword: /\?{2,}/, score: -5, reason: "Multiple question marks reduce credibility" },
  { keyword: /^[A-Z]/, score: 5, reason: "Starts with capital letter ✅" },
  { keyword: /^\d/, score: -5, reason: "Starting with a number is less engaging" },
  { keyword: /you|your/i, score: 3, reason: "Personalization: uses 'you/your' ✅" },
  { keyword: /\[.*\]/, score: 2, reason: "Uses personalization tokens ✅" },
  { keyword: /.{50,}/, score: 5, reason: "Good length (50+ chars) ✅" },
  { keyword: /.{80,}/, score: -5, reason: "Too long (80+ chars) — may get cut off" },
  { keyword: /question|curious|wondering/i, score: 5, reason: "Curiosity-driven ✅" },
  { keyword: /help|improve|grow/i, score: 3, reason: "Value-oriented language ✅" },
  { keyword: /meeting|call|chat/i, score: 3, reason: "Low-friction CTA ✅" },
  { keyword: /click|subscribe|download/i, score: -8, reason: "High-friction CTA — avoid in subject lines" },
];

const goodExamples = [
  "Quick question about your sales process",
  "How [Company] handles outbound leads",
  "Saw your post on LinkedIn — thought you'd find this interesting",
  "3 ideas for [Company]'s Q4 outreach",
  "Worth a 10-minute chat?",
];

export default function SubjectTester() {
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ reason: string; points: number }[]>([]);

  const analyze = () => {
    if (!subject.trim()) return;
    let total = 50;
    const fb: { reason: string; points: number }[] = [];
    scoringRules.forEach((rule) => {
      if (rule.keyword.test(subject)) {
        total += rule.score;
        fb.push({ reason: rule.reason, points: rule.score });
      }
    });
    total = Math.max(0, Math.min(100, total));
    setScore(total);
    setFeedback(fb);
  };

  const getGrade = (s: number) => {
    if (s >= 80) return { label: "A — Great!", color: "text-green-600", bg: "bg-green-50" };
    if (s >= 60) return { label: "B — Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (s >= 40) return { label: "C — Needs work", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "D — Likely spam", color: "text-red-600", bg: "bg-red-50" };
  };

  return (
    <ToolLayout icon="📧" title="Subject Tester">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Enter your subject line</h2>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              placeholder="e.g. Quick question about your sales process"
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
            <button
              onClick={analyze}
              disabled={!subject.trim()}
              className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
            >
              Score This Subject 📧
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">💡 Proven Examples</h3>
            <div className="space-y-2">
              {goodExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => { setSubject(ex); }}
                  className="w-full text-left bg-gray-50 rounded-lg px-4 py-2 text-sm hover:bg-blue-50 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {score !== null ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className={`text-6xl font-extrabold ${getGrade(score).color}`}>{score}</div>
                <div className={`text-lg font-semibold mt-1 ${getGrade(score).color}`}>{getGrade(score).label}</div>
              </div>
              <div className="space-y-2">
                {feedback.map((f, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${f.points > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span>{f.points > 0 ? "✅" : "⚠️"}</span>
                    <span>{f.reason}</span>
                    <span className="ml-auto font-mono">{f.points > 0 ? `+${f.points}` : f.points}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">📧</div>
              <p>Enter a subject line and hit Score</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
