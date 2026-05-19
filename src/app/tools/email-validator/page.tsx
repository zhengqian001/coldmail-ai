"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ValidationResult {
  isValid: boolean;
  checks: { label: string; passed: boolean; detail: string }[];
}

const validate = (email: string): ValidationResult => {
  const checks: { label: string; passed: boolean; detail: string }[] = [];

  // Basic format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const formatOk = emailRegex.test(email);
  checks.push({ label: "Format", passed: formatOk, detail: formatOk ? "Valid email format" : "Invalid format — check for typos" });

  // No spaces
  const noSpaces = !email.includes(" ");
  checks.push({ label: "No spaces", passed: noSpaces, detail: noSpaces ? "No spaces found" : "Email contains spaces" });

  // Has @
  const hasAt = email.split("@").length === 2;
  checks.push({ label: "Single @", passed: hasAt, detail: hasAt ? "Exactly one @ symbol" : "Missing or multiple @ symbols" });

  // Domain has dot
  const domain = email.split("@")[1] || "";
  const domainHasDot = domain.includes(".");
  checks.push({ label: "Domain valid", passed: domainHasDot, detail: domainHasDot ? `Domain: ${domain}` : "Domain missing TLD (e.g. .com)" });

  // TLD length
  const tld = domain.split(".").pop() || "";
  const tldOk = tld.length >= 2;
  checks.push({ label: "TLD valid", passed: tldOk, detail: tldOk ? `TLD: .${tld}` : "TLD too short" });

  // Common typo check
  const commonTypos = ["gmial.com", "gamil.com", "gmai.com", "yahooo.com", "hotmal.com", "outlok.com"];
  const hasTypo = commonTypos.some((t) => domain === t);
  checks.push({ label: "No typo", passed: !hasTypo, detail: hasTypo ? `Possible typo in domain — did you mean ${domain.replace(/gmial|gamil|gmai/, "gmail")}?` : "No common typos detected" });

  // Disposable email check
  const disposableDomains = ["mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email", "yopmail.com"];
  const isDisposable = disposableDomains.some((d) => domain === d);
  checks.push({ label: "Not disposable", passed: !isDisposable, detail: isDisposable ? "⚠️ Disposable email detected" : "Not a disposable email" });

  return { isValid: formatOk && noSpaces && hasAt && domainHasDot && tldOk, checks };
};

export default function EmailValidator() {
  const [emails, setEmails] = useState("");
  const [results, setResults] = useState<{ email: string; result: ValidationResult }[]>([]);

  const handleValidate = () => {
    const lines = emails.split("\n").map((e) => e.trim()).filter(Boolean);
    const r = lines.map((email) => ({ email, result: validate(email) }));
    setResults(r);
  };

  const validCount = results.filter((r) => r.result.isValid).length;

  return (
    <ToolLayout icon="🔍" title="Email Validator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-2">Enter email addresses</h2>
          <p className="text-sm text-gray-500 mb-4">One per line, up to 50</p>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder={"john@example.com\njane@company.com\ninvalid-email"}
            className="w-full border rounded-lg px-4 py-3 text-sm h-64 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono"
          />
          <button
            onClick={handleValidate}
            disabled={!emails.trim()}
            className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            Validate Emails 🔍
          </button>
        </div>

        <div>
          {results.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{validCount}</div>
                    <div className="text-xs text-gray-500">Valid</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{results.length - validCount}</div>
                    <div className="text-xs text-gray-500">Invalid</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{results.length}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>
              {results.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={r.result.isValid ? "text-green-500" : "text-red-500"}>{r.result.isValid ? "✅" : "❌"}</span>
                    <span className="font-mono text-sm font-medium">{r.email}</span>
                  </div>
                  <div className="space-y-1">
                    {r.result.checks.map((c, j) => (
                      <div key={j} className={`text-xs px-2 py-1 rounded ${c.passed ? "text-green-600" : "text-red-600"}`}>
                        {c.passed ? "✓" : "✗"} {c.label}: {c.detail}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p>Paste emails and click Validate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
