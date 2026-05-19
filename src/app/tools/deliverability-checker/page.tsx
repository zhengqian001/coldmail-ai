"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function DeliverabilityChecker() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<{ record: string; status: "pass" | "fail" | "warn"; detail: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    const d = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const res: { record: string; status: "pass" | "fail" | "warn"; detail: string }[] = [];

    try {
      const resp = await fetch(`https://dns.google/resolve?name=${d}&type=MX`);
      const data = await resp.json();
      if (data.Answer && data.Answer.length > 0) {
        res.push({ record: "MX", status: "pass", detail: `${data.Answer.length} MX record(s) found: ${data.Answer.map((a: { data: string }) => a.data).join(", ")}` });
      } else {
        res.push({ record: "MX", status: "fail", detail: "No MX records found — this domain cannot receive emails" });
      }
    } catch {
      res.push({ record: "MX", status: "warn", detail: "Could not check MX records (network error)" });
    }

    try {
      const resp = await fetch(`https://dns.google/resolve?name=${d}&type=TXT`);
      const data = await resp.json();
      const txtRecords = data.Answer?.map((a: { data: string }) => a.data) || [];
      const spf = txtRecords.find((t: string) => t.includes("v=spf1"));
      if (spf) {
        res.push({ record: "SPF", status: "pass", detail: `SPF found: ${spf}` });
      } else {
        res.push({ record: "SPF", status: "fail", detail: "No SPF record — emails may be flagged as spam" });
      }
      const dkim = txtRecords.find((t: string) => t.includes("DKIM") || t.includes("dkim"));
      if (dkim) {
        res.push({ record: "DKIM", status: "pass", detail: `DKIM selector found` });
      } else {
        res.push({ record: "DKIM", status: "warn", detail: "DKIM not found in root TXT (may be on selector subdomain — this is normal)" });
      }
      const dmarc = txtRecords.find((t: string) => t.includes("v=DMARC1"));
      if (dmarc) {
        res.push({ record: "DMARC", status: "pass", detail: `DMARC found: ${dmarc}` });
      } else {
        res.push({ record: "DMARC", status: "fail", detail: "No DMARC record — no email authentication policy" });
      }
    } catch {
      res.push({ record: "SPF/DKIM/DMARC", status: "warn", detail: "Could not check TXT records (network error)" });
    }

    setResults(res);
    setLoading(false);
  };

  const passCount = results.filter((r) => r.status === "pass").length;
  const score = results.length > 0 ? Math.round((passCount / results.length) * 100) : 0;

  return (
    <ToolLayout icon="🛡️" title="Deliverability Checker">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Check a sending domain</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="e.g. yourcompany.com" className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          </div>
          <button onClick={check} disabled={!domain.trim() || loading} className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? "Checking..." : "Check Deliverability 🛡️"}
          </button>
          <p className="text-xs text-gray-400 mt-4">Checks MX, SPF, DKIM, and DMARC records using Google DNS</p>
        </div>

        <div>
          {results.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className={`text-4xl font-extrabold ${score >= 75 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{score}%</div>
                <div className="text-sm text-gray-500">Deliverability Score</div>
              </div>
              {results.map((r, i) => (
                <div key={i} className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 ${r.status === "pass" ? "border-l-green-500" : r.status === "warn" ? "border-l-yellow-500" : "border-l-red-500"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{r.record}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "pass" ? "bg-green-100 text-green-700" : r.status === "warn" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {r.status === "pass" ? "✅ Pass" : r.status === "warn" ? "⚠️ Warn" : "❌ Fail"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{r.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">🛡️</div>
              <p>Enter your sending domain to check</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
