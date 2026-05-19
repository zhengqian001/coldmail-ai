import Link from "next/link";

const tools = [
  { icon: "✉️", name: "Email Generator", slug: "email-generator", desc: "Template-based cold email builder" },
  { icon: "📧", name: "Subject Tester", slug: "subject-tester", desc: "Score & improve your subject lines" },
  { icon: "🔍", name: "Email Validator", slug: "email-validator", desc: "Verify email format & deliverability" },
  { icon: "📋", name: "Spam Checker", slug: "spam-checker", desc: "Check for spam trigger words" },
  { icon: "📝", name: "Follow-up Gen", slug: "follow-up-gen", desc: "Generate follow-up sequences" },
  { icon: "💰", name: "ROI Calculator", slug: "roi-calculator", desc: "Calculate cold email ROI" },
  { icon: "📊", name: "Open Rate Estimator", slug: "open-rate-estimator", desc: "Estimate your open rates" },
  { icon: "📄", name: "Template Library", slug: "template-library", desc: "Browse & copy email templates" },
  { icon: "🔗", name: "Email Finder", slug: "email-finder", desc: "Guess business email addresses" },
  { icon: "🛡️", name: "Deliverability Checker", slug: "deliverability-checker", desc: "Check SPF/DKIM/DMARC records" },
  { icon: "🎯", name: "Persona Builder", slug: "persona-builder", desc: "Build your ideal customer profile" },
  { icon: "⏰", name: "Best Send Time", slug: "best-send-time", desc: "Find optimal send times by timezone" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-primary">
          ColdMail<span className="text-accent">Toolbox</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>12 Free Tools</span>
          <span>•</span>
          <span>No Signup Required</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Cold Outreach Toolbox
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          12 free tools for cold email professionals. No signup, no AI needed — just pick a tool and go.
        </p>
      </section>

      {/* Tool Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {tool.icon}
              </div>
              <div className="text-sm font-semibold text-gray-800 text-center mb-1">
                {tool.name}
              </div>
              <div className="text-xs text-gray-400 text-center">
                {tool.desc}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold text-white mb-4 md:mb-0">
            ColdMail<span className="text-accent">Toolbox</span>
          </div>
          <div className="text-sm">
            © 2026 ColdMail Toolbox — Free cold outreach tools
          </div>
        </div>
      </footer>
    </div>
  );
}
