"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function OpenRateEstimator() {
  const [subject, setSubject] = useState("");
  const [sendDay, setSendDay] = useState("tuesday");
  const [sendTime, setSendTime] = useState("morning");
  const [personalized, setPersonalized] = useState(false);
  const [segmented, setSegmented] = useState(false);
  const [listQuality, setListQuality] = useState("warm");

  const estimate = () => {
    let base = 21; // industry average
    if (personalized) base += 6;
    if (segmented) base += 8;
    if (listQuality === "warm") base += 10;
    if (listQuality === "cold") base -= 8;
    if (listQuality === "purchased") base -= 15;
    if (sendDay === "tuesday" || sendDay === "thursday") base += 3;
    if (sendDay === "saturday" || sendDay === "sunday") base -= 8;
    if (sendTime === "morning") base += 2;
    if (sendTime === "evening") base -= 3;
    const len = subject.length;
    if (len >= 6 && len <= 50) base += 2;
    if (len > 80) base -= 4;
    if (/[A-Z]{5,}/.test(subject)) base -= 5;
    if (subject.includes("?")) base += 1;
    if (/\d/.test(subject)) base += 1;
    if (/free|urgent|act now/i.test(subject)) base -= 8;
    return Math.max(1, Math.min(80, Math.round(base)));
  };

  const rate = estimate();
  const getLabel = (r: number) => {
    if (r >= 35) return { text: "Excellent", color: "text-green-600" };
    if (r >= 25) return { text: "Above Average", color: "text-blue-600" };
    if (r >= 15) return { text: "Average", color: "text-yellow-600" };
    return { text: "Below Average", color: "text-red-600" };
  };

  return (
    <ToolLayout icon="📊" title="Open Rate Estimator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Configure your campaign</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your email subject" className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Send Day</label>
              <select value={sendDay} onChange={(e) => setSendDay(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((d) => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Send Time</label>
              <select value={sendTime} onChange={(e) => setSendTime(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                <option value="morning">Morning (8-10am)</option>
                <option value="midday">Midday (11am-1pm)</option>
                <option value="afternoon">Afternoon (2-5pm)</option>
                <option value="evening">Evening (6-9pm)</option>
              </select>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={personalized} onChange={(e) => setPersonalized(e.target.checked)} className="rounded" />
                Personalized
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={segmented} onChange={(e) => setSegmented(e.target.checked)} className="rounded" />
                Segmented List
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">List Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "warm", label: "🟢 Warm" },
                  { id: "cold", label: "🟡 Cold" },
                  { id: "purchased", label: "🔴 Purchased" },
                ].map((opt) => (
                  <button key={opt.id} onClick={() => setListQuality(opt.id)} className={`px-3 py-2 rounded-lg text-sm border transition ${listQuality === opt.id ? "bg-primary text-white border-primary" : "bg-gray-50 border-gray-200"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className={`text-5xl font-extrabold ${getLabel(rate).color}`}>{rate}%</div>
            <div className={`text-lg font-semibold mt-1 ${getLabel(rate).color}`}>{getLabel(rate).text}</div>
            <div className="text-sm text-gray-500 mt-2">Estimated Open Rate</div>
            <div className="mt-4 bg-gray-100 rounded-full h-4">
              <div className="bg-primary rounded-full h-4 transition-all" style={{ width: `${rate}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm mb-3">📈 Tips to Improve</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {!personalized && <li className="flex gap-2"><span>💡</span> Personalize subject lines (+6%)</li>}
              {!segmented && <li className="flex gap-2"><span>💡</span> Segment your list (+8%)</li>}
              {listQuality !== "warm" && <li className="flex gap-2"><span>💡</span> Use a warm/opt-in list (+10-25%)</li>}
              {(sendDay === "saturday" || sendDay === "sunday") && <li className="flex gap-2"><span>💡</span> Try Tuesday or Thursday (+3%)</li>}
              {subject.length > 80 && <li className="flex gap-2"><span>💡</span> Shorten subject line to under 50 chars (+4%)</li>}
              {/free|urgent|act now/i.test(subject) && <li className="flex gap-2"><span>💡</span> Remove spam trigger words (+8%)</li>}
              {personalized && segmented && listQuality === "warm" && <li className="flex gap-2"><span>✅</span> Your setup looks great!</li>}
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
