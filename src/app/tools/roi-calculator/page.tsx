"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ROICalculator() {
  const [emailsSent, setEmailsSent] = useState("1000");
  const [openRate, setOpenRate] = useState("25");
  const [replyRate, setReplyRate] = useState("5");
  const [closeRate, setCloseRate] = useState("20");
  const [dealValue, setDealValue] = useState("5000");
  const [monthlyCost, setMonthlyCost] = useState("50");

  const sent = parseInt(emailsSent) || 0;
  const opened = Math.round(sent * (parseInt(openRate) || 0) / 100);
  const replied = Math.round(opened * (parseInt(replyRate) || 0) / 100);
  const closed = Math.round(replied * (parseInt(closeRate) || 0) / 100);
  const revenue = closed * (parseInt(dealValue) || 0);
  const cost = parseInt(monthlyCost) || 0;
  const roi = cost > 0 ? Math.round(((revenue - cost) / cost) * 100) : 0;
  const cpl = replied > 0 ? Math.round(cost / replied) : 0;
  const cpa = closed > 0 ? Math.round(cost / closed) : 0;

  return (
    <ToolLayout icon="💰" title="ROI Calculator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Input your numbers</h2>
          <div className="space-y-4">
            {[
              { label: "Emails Sent / Month", value: emailsSent, setter: setEmailsSent, prefix: "" },
              { label: "Open Rate (%)", value: openRate, setter: setOpenRate, prefix: "" },
              { label: "Reply Rate (%)", value: replyRate, setter: setReplyRate, prefix: "" },
              { label: "Close Rate (%)", value: closeRate, setter: setCloseRate, prefix: "" },
              { label: "Avg Deal Value ($)", value: dealValue, setter: setDealValue, prefix: "$" },
              { label: "Monthly Tool Cost ($)", value: monthlyCost, setter: setMonthlyCost, prefix: "$" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <div className="relative">
                  {field.prefix && <span className="absolute left-3 top-3 text-sm text-gray-400">{field.prefix}</span>}
                  <input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none ${field.prefix ? "pl-7" : ""}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl font-extrabold text-primary">{roi}%</div>
            <div className="text-sm text-gray-500 mt-1">Return on Investment</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-green-600">${revenue.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-blue-600">{closed}</div>
              <div className="text-xs text-gray-500">Deals Closed</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-purple-600">${cpa}</div>
              <div className="text-xs text-gray-500">Cost per Acquisition</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-orange-600">${cpl}</div>
              <div className="text-xs text-gray-500">Cost per Lead</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm mb-2">Funnel Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: "Sent", value: sent, color: "bg-gray-200", pct: 100 },
                { label: "Opened", value: opened, color: "bg-blue-200", pct: sent > 0 ? (opened / sent) * 100 : 0 },
                { label: "Replied", value: replied, color: "bg-purple-200", pct: sent > 0 ? (replied / sent) * 100 : 0 },
                { label: "Closed", value: closed, color: "bg-green-200", pct: sent > 0 ? (closed / sent) * 100 : 0 },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">{step.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4">
                    <div className={`${step.color} rounded-full h-4 transition-all`} style={{ width: `${Math.max(step.pct, 2)}%` }} />
                  </div>
                  <span className="text-xs font-mono w-12 text-right">{step.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
