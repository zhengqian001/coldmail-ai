import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-primary">
          ColdMail<span className="text-accent">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          {session ? (
            <Link
              href="/dashboard"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block mb-4 px-4 py-1 bg-blue-50 text-primary rounded-full text-sm font-medium">
          🚀 AI-Powered Cold Email Generator
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Write Cold Emails That
          <br />
          <span className="text-primary">Actually Get Replies</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Generate 3 high-converting cold email versions in 10 seconds. No more
          staring at a blank screen. Powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition shadow-lg shadow-blue-200"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/pricing"
            className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-300 transition"
          >
            See Pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          3 free generations per day • No signup required to try
        </p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Stop Writing, Start Closing
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-xl mx-auto">
            ColdMail AI handles the hardest part of outreach — writing emails
            people actually want to read.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✍️",
                title: "3 Versions Instantly",
                desc: "Get 3 different email versions — direct, story-driven, and value-focused. Pick the best one.",
              },
              {
                icon: "🎯",
                title: "Smart Subject Lines",
                desc: "5 AI-generated subject lines optimized for open rates. No more boring subject lines.",
              },
              {
                icon: "⚡",
                title: "10 Seconds, Not 10 Minutes",
                desc: "Describe your product and target customer. Get professional emails instantly.",
              },
              {
                icon: "🌍",
                title: "Any Industry, Any Tone",
                desc: "Professional, friendly, or casual. B2B SaaS, agency, freelancer — it works for everyone.",
              },
              {
                icon: "🔄",
                title: "Unlimited with Pro",
                desc: "Free users get 3 emails/day. Pro users generate unlimited emails for $9/month.",
              },
              {
                icon: "📋",
                title: "One-Click Copy",
                desc: "Copy any email version to clipboard instantly. Paste into your CRM and send.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Trusted by Sales Teams Worldwide
        </h2>
        <p className="text-gray-600 mb-12">
          Join thousands of B2B professionals who close more deals with AI.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "I used to spend 30 min per email. Now it takes 10 seconds. My response rate went up 40%.",
              name: "Sarah K.",
              role: "SDR Manager, TechCorp",
            },
            {
              quote:
                "The subject lines alone are worth the $9/month. My open rates jumped from 15% to 28%.",
              name: "Mike R.",
              role: "Founder, AgencyPro",
            },
            {
              quote:
                "Finally a cold email tool that actually sounds human. My prospects can't tell it's AI.",
              name: "Lisa C.",
              role: "Sales Director, CloudScale",
            },
          ].map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-8 text-left">
              <p className="text-gray-700 mb-4 italic">&quot;{t.quote}&quot;</p>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Write Better Cold Emails?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start free today. No credit card required.
          </p>
          <Link
            href="/auth/signin"
            className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold text-white mb-4 md:mb-0">
            ColdMail<span className="text-accent">AI</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <span>© 2026 ColdMail AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
