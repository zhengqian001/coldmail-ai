import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export default async function Pricing() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-primary">
          ColdMail<span className="text-accent">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
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
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-600 text-center mb-16 text-lg">
          Start free. Upgrade when you need more.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="border-2 border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-gray-500 mb-6">
              Perfect for trying out ColdMail AI
            </p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "3 email generations per day",
                "3 email versions per generation",
                "5 subject line suggestions",
                "All tone options",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signin"
              className="block text-center border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-300 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-primary rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-gray-500 mb-6">
              For serious outreach professionals
            </p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$9</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited email generations",
                "3 email versions per generation",
                "5 subject line suggestions",
                "All tone options",
                "Email history & save",
                "Priority AI processing",
                "No ads",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {session ? (
              <Link
                href="/dashboard?upgrade=true"
                className="block text-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Upgrade to Pro
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="block text-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Get Started — $9/month
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
