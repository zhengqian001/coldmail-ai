"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const emailPatterns = [
  { name: "First.Last", format: (f: string, l: string, d: string) => `${f.toLowerCase()}.${l.toLowerCase()}@${d}` },
  { name: "FirstLast", format: (f: string, l: string, d: string) => `${f.toLowerCase()}${l.toLowerCase()}@${d}` },
  { name: "FLast", format: (f: string, l: string, d: string) => `${f[0]?.toLowerCase()}${l.toLowerCase()}@${d}` },
  { name: "FirstL", format: (f: string, l: string, d: string) => `${f.toLowerCase()}${l[0]?.toLowerCase()}@${d}` },
  { name: "First", format: (f: string, l: string, d: string) => `${f.toLowerCase()}@${d}` },
  { name: "Last.First", format: (f: string, l: string, d: string) => `${l.toLowerCase()}.${f.toLowerCase()}@${d}` },
  { name: "F_Last", format: (f: string, l: string, d: string) => `${f[0]?.toLowerCase()}_${l.toLowerCase()}@${d}` },
  { name: "First.Last (separated)", format: (f: string, l: string, d: string) => `${f.toLowerCase()}.${l.toLowerCase()}@${d}` },
];

export default function EmailFinder() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<{ pattern: string; email: string }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    if (!firstName.trim() || !lastName.trim() || !domain.trim()) return;
    const r = emailPatterns.map((p) => ({
      pattern: p.name,
      email: p.format(firstName.trim(), lastName.trim(), domain.trim()),
    }));
    setResults(r);
  };

  const copy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.map((r) => r.email).join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout icon="🔗" title="Email Finder">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Enter contact details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. John" className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Smith" className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Domain</label>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. company.com" className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <button onClick={generate} disabled={!firstName.trim() || !lastName.trim() || !domain.trim()} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50">
              Generate Emails 🔗
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">⚠️ This generates likely email formats. Verify before sending.</p>
        </div>

        <div>
          {results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{results.length} possible emails</h3>
                <button onClick={copyAll} className="text-sm text-primary hover:underline">
                  {copied === "all" ? "✅ All Copied!" : "📋 Copy All"}
                </button>
              </div>
              {results.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">{r.pattern}</span>
                    <div className="font-mono text-sm font-medium">{r.email}</div>
                  </div>
                  <button onClick={() => copy(r.email)} className="text-sm text-primary hover:underline">
                    {copied === r.email ? "✅" : "📋"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">🔗</div>
              <p>Enter a name and domain to find emails</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
