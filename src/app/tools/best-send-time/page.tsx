"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const timezones = [
  { label: "US Eastern (ET)", offset: -5 },
  { label: "US Central (CT)", offset: -6 },
  { label: "US Mountain (MT)", offset: -7 },
  { label: "US Pacific (PT)", offset: -8 },
  { label: "UK (GMT)", offset: 0 },
  { label: "Central Europe (CET)", offset: 1 },
  { label: "Eastern Europe (EET)", offset: 2 },
  { label: "India (IST)", offset: 5.5 },
  { label: "China (CST)", offset: 8 },
  { label: "Japan (JST)", offset: 9 },
  { label: "Australia Eastern (AET)", offset: 11 },
];

const bestTimes = [
  { hour: 8, score: 70, label: "8:00 AM" },
  { hour: 9, score: 90, label: "9:00 AM" },
  { hour: 10, score: 95, label: "10:00 AM" },
  { hour: 11, score: 85, label: "11:00 AM" },
  { hour: 12, score: 60, label: "12:00 PM" },
  { hour: 13, score: 50, label: "1:00 PM" },
  { hour: 14, score: 65, label: "2:00 PM" },
  { hour: 15, score: 55, label: "3:00 PM" },
  { hour: 16, score: 40, label: "4:00 PM" },
  { hour: 17, score: 30, label: "5:00 PM" },
];

export default function BestSendTime() {
  const [senderTz, setSenderTz] = useState(8);
  const [recipientTz, setRecipientTz] = useState(-5);

  const convert = (hour: number, from: number, to: number) => {
    const diff = to - from;
    return ((hour + diff + 24) % 24);
  };

  const sorted = [...bestTimes].sort((a, b) => b.score - a.score);

  return (
    <ToolLayout icon="⏰" title="Best Send Time">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Select timezones</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Timezone</label>
                <select value={senderTz} onChange={(e) => setSenderTz(parseFloat(e.target.value))} className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                  {timezones.map((tz) => (
                    <option key={tz.label} value={tz.offset}>{tz.label} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Timezone</label>
                <select value={recipientTz} onChange={(e) => setRecipientTz(parseFloat(e.target.value))} className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                  {timezones.map((tz) => (
                    <option key={tz.label} value={tz.offset}>{tz.label} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">🏆 Best Times to Send</h3>
            <div className="space-y-2">
              {sorted.slice(0, 3).map((t, i) => {
                const yourTime = convert(t.hour, recipientTz, senderTz);
                return (
                  <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3">
                    <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                    <div>
                      <div className="text-sm font-semibold">{t.label} (recipient time)</div>
                      <div className="text-xs text-gray-500">= {yourTime}:00 (your time)</div>
                    </div>
                    <div className="ml-auto text-sm font-bold text-primary">{t.score}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">All Times (Recipient Local)</h3>
          <div className="space-y-2">
            {bestTimes.map((t) => {
              const yourTime = convert(t.hour, recipientTz, senderTz);
              return (
                <div key={t.hour} className="flex items-center gap-3">
                  <span className="text-xs w-20 text-gray-500">{t.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className={`rounded-full h-3 transition-all ${t.score >= 85 ? "bg-green-400" : t.score >= 60 ? "bg-blue-400" : "bg-gray-300"}`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                  <span className="text-xs w-8 text-right">{t.score}%</span>
                  <span className="text-xs text-gray-400 w-24">→ {yourTime}:00 yours</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-xs text-yellow-800">
            <strong>Tip:</strong> Tuesday and Thursday mornings consistently show the highest open rates. Avoid Monday (inbox overload) and Friday (weekend mode).
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
